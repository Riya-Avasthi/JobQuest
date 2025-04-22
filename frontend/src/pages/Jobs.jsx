import { useState, useEffect } from 'react';
import { useJobsContext } from '../context/jobsContext';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const { jobs, isLoading } = useJobsContext();
  const navigate = useNavigate();

  // Log jobs when they change to debug
  useEffect(() => {
    console.log('Jobs data in Jobs component:', jobs);
  }, [jobs]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-teal">Available Jobs</h1>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <p className="text-lg text-teal">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center my-12">
          <p className="text-lg text-teal-dark">No jobs found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-cream-light shadow-md rounded-lg p-6 border border-teal/10 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2 text-teal">{job.title}</h2>
              <p className="text-teal-dark/80 mb-2">{job.company}</p>
              <p className="text-teal-dark/70 mb-4">{job.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-teal font-medium">${job.salary}/year</span>
                <button 
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="btn-teal px-4 py-2 rounded shadow hover:shadow-md"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs; 