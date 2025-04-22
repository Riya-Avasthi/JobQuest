import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobsContext } from '../context/jobsContext';

const Dashboard = () => {
  const { user, userJobs, isLoading, deleteJob } = useJobsContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          {user.location && (
            <div>
              <p className="text-gray-600 mb-1">Location</p>
              <p className="font-medium">{user.location}</p>
            </div>
          )}
        </div>
      </div>
      
      {user.role === 'recruiter' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Posted Jobs</h2>
            <button 
              onClick={() => navigate('/post-job')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Post New Job
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading your jobs...</p>
            </div>
          ) : userJobs.length === 0 ? (
            <div className="text-center py-8 bg-white shadow-md rounded-lg">
              <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
              <button 
                onClick={() => navigate('/post-job')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {userJobs.map(job => (
                <div key={job._id} className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-1">{job.company}</p>
                  <p className="text-gray-600 mb-4">{job.location}</p>
                  <div className="flex items-center mb-4">
                    <span className="font-medium mr-2">Applicants:</span>
                    <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {job.applications?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="px-3 py-1.5 bg-teal text-white rounded text-sm hover:bg-teal-dark"
                    >
                      View Job
                    </button>
                    <button 
                      onClick={() => navigate(`/job/${job._id}/applicants`)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Manage Applicants
                    </button>
                    <button 
                      onClick={() => deleteJob(job._id)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {user.role === 'jobseeker' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">My Applications</h2>
          <div className="text-center py-8 bg-white shadow-md rounded-lg">
            <p className="text-gray-600">Application tracking coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 