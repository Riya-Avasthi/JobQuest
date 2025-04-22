import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobsContext } from '@/context/jobsContext';
import { useGlobalContext } from '@/context/globalContext';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

const MyJobs = () => {
  const { userJobs, loading, deleteJob, likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Jobs</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading jobs...</p>
        </div>
      ) : userJobs.length > 0 ? (
        <div className="space-y-4">
          {userJobs.map(job => (
            <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/job/${job._id}`)}
                >
                  <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
                  <p className="text-sm text-gray-600 mb-1">{job.location}</p>
                  <p className="text-sm text-gray-500">
                    Posted {formatDate(job.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => deleteJob(job._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-blue-500"
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <p className="line-clamp-2 text-gray-700">{job.description}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {job.jobType?.map((type, index) => (
                    <Badge key={index} variant="outline">{type}</Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>{job.applicants?.length || 0} applications</span>
                  <span>{job.likes?.length || 0} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-lg text-gray-600 mb-4">You haven't posted any jobs yet.</p>
          <Button onClick={() => navigate('/post')}>Post a New Job</Button>
        </div>
      )}
    </div>
  );
};

export default MyJobs; 