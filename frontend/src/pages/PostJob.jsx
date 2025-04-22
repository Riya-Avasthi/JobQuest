import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobsContext } from '../context/jobsContext';
import { toast } from 'react-toastify';

const initialState = {
  title: '',
  company: '',
  location: '',
  jobType: 'full-time',
  description: '',
  requirements: '',
  salary: '',
  tags: ''
};

const PostJob = () => {
  const [values, setValues] = useState(initialState);
  const { user, createJob, isLoading } = useJobsContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'recruiter') {
      toast.error('You must be a recruiter to post jobs');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { title, company, location, jobType, description, requirements, salary, tags } = values;
    
    if (!title || !company || !location || !description) {
      toast.error('Please provide all required fields');
      return;
    }
    
    // Format requirements as array
    const requirementsArray = requirements
      .split('\n')
      .filter(item => item.trim() !== '')
      .map(item => item.trim());
    
    // Format tags as array
    const tagsArray = tags
      .split(',')
      .filter(tag => tag.trim() !== '')
      .map(tag => tag.trim());
    
    const jobData = {
      title,
      company,
      location,
      jobType,
      description,
      requirements: requirementsArray,
      salary: parseInt(salary) || 0,
      tags: tagsArray
    };
    
    createJob(jobData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Post a Job</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={values.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={values.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City, Country"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="jobType" className="block text-gray-700 font-medium mb-2">
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={values.jobType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="salary" className="block text-gray-700 font-medium mb-2">
              Salary ($ per year)
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={values.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 60000"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={values.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. JavaScript, React, Node.js"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="requirements" className="block text-gray-700 font-medium mb-2">
              Requirements (one per line)
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={values.requirements}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="e.g. 3+ years of React experience"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob; 