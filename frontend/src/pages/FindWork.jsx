import React from 'react';
import { useJobsContext } from '@/context/jobsContext';
import Filters from '@/Components/Filters';
import JobCard from '@/Components/JobCard';

const FindWork = () => {
  const { jobs, loading } = useJobsContext();

  return (
    <div className="flex gap-6">
      <aside>
        <Filters />
      </aside>
      
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-6">Find Work</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p>No jobs found. Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWork; 