import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useJobsContext } from '../context/jobsContext';

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'hired':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ApplicantTracking = () => {
  const { id: jobId } = useParams();
  const { token, user } = useJobsContext();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  useEffect(() => {
    // Redirect if not a recruiter
    if (user && user.role !== 'recruiter') {
      toast.error('Only recruiters can access this page');
      navigate('/');
      return;
    }
    
    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/api/v1/jobs/${jobId}/applicants`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch applicants');
        }
        
        setApplications(data.applications);
        setJob({
          title: data.jobTitle,
          id: data.jobId
        });
        
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError(error.message || 'Failed to fetch applicants');
        toast.error(error.message || 'Failed to fetch applicants');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
      fetchApplicants();
    }
  }, [jobId, token, user, navigate]);
  
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      
      const response = await fetch(`${API_URL}/api/v1/jobs/${jobId}/applicants`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      // Update local state
      setApplications(applications.map(app => 
        app._id === applicationId 
          ? { ...app, status: newStatus } 
          : app
      ));
      
      toast.success(`Status updated to ${newStatus}`);
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  
  const viewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-cream-light py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-teal inline-block px-6 py-2 rounded">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-cream-light py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-teal">{job.title}</h1>
              <p className="text-gray-600">Applicant Tracking</p>
            </div>
            <Link 
              to={`/job/${jobId}`} 
              className="text-teal hover:text-teal-dark transition-colors"
            >
              View Job Post
            </Link>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-teal-dark mb-2">
              Applications ({applications.length})
            </h2>
            {applications.length === 0 ? (
              <div className="bg-cream-light p-4 rounded text-center">
                <p className="text-gray-600">No applications yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-teal/10">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-medium text-teal-dark">Applicant</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-teal-dark">Contact</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-teal-dark">Applied On</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-teal-dark">Status</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-teal-dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {application.userId?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.userId?.company || application.userId?.position ? 
                              `${application.userId?.position || ''} ${application.userId?.company ? 'at ' + application.userId.company : ''}` : 
                              'No company information'
                            }
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div>{application.userId?.email || 'No email'}</div>
                            <div>{application.phoneNumber || 'No phone'}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-500">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => viewApplicantDetails(application)}
                            className="text-teal hover:text-teal-dark mr-2"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {selectedApplicant && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-teal">Applicant Details</h2>
              <button 
                onClick={() => setSelectedApplicant(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="font-semibold text-teal-dark mb-2">Personal Information</h3>
                <div className="bg-cream-light p-4 rounded">
                  <p className="mb-2">
                    <span className="font-medium">Name:</span> {selectedApplicant.userId?.name || 'Not provided'}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Email:</span> {selectedApplicant.userId?.email || 'Not provided'}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Phone:</span> {selectedApplicant.phoneNumber || 'Not provided'}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Location:</span> {selectedApplicant.userId?.location || 'Not provided'}
                  </p>
                  {selectedApplicant.userId?.bio && (
                    <div className="mt-4">
                      <p className="font-medium mb-1">Bio:</p>
                      <p className="text-sm">{selectedApplicant.userId.bio}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-1">
                <h3 className="font-semibold text-teal-dark mb-2">Professional Information</h3>
                <div className="bg-cream-light p-4 rounded">
                  <p className="mb-2">
                    <span className="font-medium">Position:</span> {selectedApplicant.userId?.position || 'Not provided'}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Company:</span> {selectedApplicant.userId?.company || 'Not provided'}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Applied on:</span> {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Status:</span> <StatusBadge status={selectedApplicant.status} />
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <h3 className="font-semibold text-teal-dark mb-2">Application Details</h3>
                <div className="bg-cream-light p-4 rounded">
                  {selectedApplicant.resumeUrl && (
                    <div className="mb-4">
                      <p className="font-medium mb-2">Resume:</p>
                      <a 
                        href={selectedApplicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-teal hover:bg-teal-dark text-white px-3 py-1 rounded text-sm inline-flex items-center"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                  
                  {selectedApplicant.coverLetter && (
                    <div className="mb-4">
                      <p className="font-medium mb-1">Cover Letter:</p>
                      <div className="bg-white p-3 rounded text-sm border border-gray-200 max-h-40 overflow-y-auto">
                        {selectedApplicant.coverLetter}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-teal-dark mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {['pending', 'reviewed', 'rejected', 'shortlisted', 'hired'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedApplicant._id, status)}
                    disabled={statusUpdateLoading || selectedApplicant.status === status}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedApplicant.status === status 
                        ? 'bg-teal-dark text-white cursor-default' 
                        : 'bg-cream hover:bg-cream-dark text-teal transition-colors'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantTracking; 