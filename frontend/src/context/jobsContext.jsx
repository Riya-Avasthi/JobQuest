import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const JobsContext = createContext();

// Set up axios defaults with the correct API URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('Setting up axios with API URL:', apiUrl);
axios.defaults.baseURL = apiUrl;

export const JobsProvider = ({ children }) => {
  const navigate = useNavigate();

  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [userJobs, setUserJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    tags: "",
    location: "",
    title: "",
  });

  //filters
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    internship: false,
    contract: false,
    fullStack: false,
    backend: false,
    devOps: false,
    uiux: false,
  });

  const [minSalary, setMinSalary] = useState(30000);
  const [maxSalary, setMaxSalary] = useState(120000);

  // Check for user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Set auth header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // Update axios auth header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const getJobs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs");
      console.log('getJobs response:', res.data);
      
      // Handle both formats - array of jobs or {jobs:[...]} object
      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else if (res.data && res.data.jobs) {
        setJobs(res.data.jobs);
      } else {
        console.error("Unexpected response format:", res.data);
        setJobs([]);
      }
    } catch (error) {
      console.log("Error getting jobs", error);
      toast.error("Failed to fetch jobs");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      const res = await axios.post("/api/v1/jobs", jobData);

      toast.success("Job created successfully");

      setJobs((prevJobs) => [res.data, ...prevJobs]);

      // update userJobs
      if (user?._id) {
        setUserJobs((prevUserJobs) => [res.data, ...prevUserJobs]);
        await getUserJobs(user._id);
      }

      await getJobs();
      // redirect to the job details page
      navigate(`/job/${res.data._id}`);
    } catch (error) {
      console.log("Error creating job", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    }
  };

  const getUserJobs = async (userId) => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs/user/myjobs");

      if (res.data && res.data.jobs) {
        setUserJobs(res.data.jobs);
      } else {
        console.error("Unexpected response format:", res.data);
        setUserJobs([]);
      }
    } catch (error) {
      console.log("Error getting user jobs", error);
      toast.error("Failed to fetch your jobs");
      setUserJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchJobs = async (tags, location, title) => {
    setIsLoading(true);
    try {
      // build query string
      const query = new URLSearchParams();

      if (tags) query.append("tags", tags);
      if (location) query.append("location", location);
      if (title) query.append("title", title);

      // send the request
      const res = await axios.get(`/api/v1/jobs/search?${query.toString()}`);

      // set jobs to the response data
      if (res.data && res.data.jobs) {
        setJobs(res.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.log("Error searching jobs", error);
      toast.error("Failed to search jobs");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // get job by id
  const getJobById = async (id) => {
    setIsLoading(true);
    try {
      console.log(`Fetching job with id: ${id}`);
      const res = await axios.get(`/api/v1/jobs/${id}`);
      console.log('API Response:', res.data);
      
      if (res.data && res.data.job) {
        console.log('Job found:', res.data.job);
        return res.data.job;
      }
      console.log('Job not found in response');
      return null;
    } catch (error) {
      console.error("Error getting job by id", error.message);
      console.error("Error details:", error.response?.data || 'No response data');
      toast.error("Failed to fetch job details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // like a job
  const likeJob = async (jobId) => {
    if (!user) {
      toast.error("Please login to like jobs");
      navigate('/login');
      return;
    }

    try {
      const res = await axios.put(`/api/v1/jobs/${jobId}/like`);
      toast.success("Job liked successfully");
      getJobs();
    } catch (error) {
      console.log("Error liking job", error);
      toast.error(error.response?.data?.message || "Failed to like job");
    }
  };

  // apply to a job
  const applyToJob = async (jobId, applicationData) => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      navigate('/login');
      return;
    }

    const job = jobs.find((job) => job._id === jobId);

    if (job && job.applicants && job.applicants.includes(user._id)) {
      toast.error("You have already applied to this job");
      return;
    }

    try {
      const res = await axios.put(`/api/v1/jobs/${jobId}/apply`, applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Applied to job successfully");
      getJobs();
      return true;
    } catch (error) {
      console.log("Error applying to job", error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
      return false;
    }
  };

  // Get applicants for a specific job (for recruiters)
  const getJobApplicants = async (jobId) => {
    if (!user || user.role !== 'recruiter') {
      toast.error("Only recruiters can view applicants");
      return null;
    }

    try {
      setIsLoading(true);
      const res = await axios.get(`/api/v1/jobs/${jobId}/applicants`);
      return res.data.applicants;
    } catch (error) {
      console.error("Error getting job applicants", error);
      toast.error("Failed to fetch applicants");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // delete a job
  const deleteJob = async (jobId) => {
    if (!user) {
      toast.error("Please login to delete jobs");
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`/api/v1/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setUserJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.log("Error deleting job", error);
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  const handleSearchChange = (searchName, value) => {
    setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
  };

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getUserJobs(user._id);
    }
  }, [user?._id]);

  return (
    <JobsContext.Provider
      value={{
        // Auth
        user,
        setUser,
        token,
        setToken,
        logout,
        isLoading,
        
        // Jobs
        jobs,
        createJob,
        userJobs,
        searchJobs,
        getJobById,
        likeJob,
        applyToJob,
        deleteJob,
        getJobApplicants,
        
        // Search and filters
        handleSearchChange,
        searchQuery,
        setSearchQuery,
        handleFilterChange,
        filters,
        minSalary,
        setMinSalary,
        maxSalary,
        setMaxSalary,
        setFilters,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobsContext = () => {
  return useContext(JobsContext);
}; 