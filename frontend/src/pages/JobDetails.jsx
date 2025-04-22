import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobsContext } from '../context/jobsContext';
import { toast } from 'react-toastify';
import ApplicationModal from '../Components/ApplicationModal';
import ApplicantsList from '../Components/ApplicantsList';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, likeJob, user, isLoading } = useJobsContext();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobData = await getJobById(id);
        console.log('Job data in component:', jobData);
        
        if (jobData) {
          setJob(jobData);
          setError(null);
        } else {
          setError('Could not find job details');
          toast.error('Job not found');
          // Wait a moment before redirecting
          setTimeout(() => navigate('/jobs'), 2000);
        }
      } catch (err) {
        console.error('Error in job details component:', err);
        setError('Error loading job details');
      }
    };

    fetchJobDetails();
  }, [id, getJobById, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <p className="text-lg text-teal animate-pulse">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <div className="mt-4">
          <Link to="/jobs" className="text-teal hover:text-teal-dark hover:underline transition-colors">Go back to Jobs</Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <p className="text-lg text-teal">No job details available</p>
        <div className="mt-4">
          <Link to="/jobs" className="text-teal hover:text-teal-dark hover:underline transition-colors">Go back to Jobs</Link>
        </div>
      </div>
    );
  }

  // Safety check for job properties
  const {
    title = 'Untitled Position',
    company = 'Unknown Company',
    location = 'Remote',
    jobType = 'Full-time',
    salary = 0,
    createdAt = new Date(),
    tags = [],
    description = 'No description provided',
    requirements = [],
    applicants = [],
    postedBy
  } = job;

  const isOwner = user && postedBy === user._id;
  const hasApplied = user && applicants.includes(user._id);
  const applicationsCount = job.applications?.length || applicants.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/jobs" className="text-teal hover:text-teal-dark hover:underline transition-colors">&larr; Back to Jobs</Link>
      </div>
      
      <div className="bg-cream-light shadow-md rounded-lg overflow-hidden border border-teal/10">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-teal">{title}</h1>
            <p className="text-xl text-teal-dark/80 mb-2">{company}</p>
            <p className="text-teal-dark/70">{location}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-teal">Job Details</h3>
              <ul className="space-y-2 text-teal-dark">
                <li><span className="font-medium text-teal">Type:</span> {jobType}</li>
                <li><span className="font-medium text-teal">Salary:</span> ${salary}/year</li>
                <li><span className="font-medium text-teal">Posted:</span> {new Date(createdAt).toLocaleDateString()}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-teal">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-teal/10 text-teal text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-teal">Description</h3>
            <p className="text-teal-dark/90 whitespace-pre-line">{description}</p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-teal">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1 text-teal-dark/90">
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          
          {!isOwner && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowApplicationModal(true)}
                disabled={hasApplied}
                className={hasApplied 
                  ? 'px-6 py-3 rounded-md text-cream font-medium bg-teal-dark/70 cursor-default' 
                  : 'btn-teal px-6 py-3 rounded-md font-medium shadow hover:shadow-md'
                }
              >
                {hasApplied ? 'Applied' : 'Apply Now'}
              </button>
              <button
                onClick={() => likeJob(job._id)}
                className="btn-outline px-6 py-3 rounded-md font-medium"
              >
                Save Job
              </button>
            </div>
          )}
          
          {isOwner && (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/edit-job/${job._id}`)}
                className="btn-teal px-6 py-3 rounded-md font-medium shadow hover:shadow-md"
              >
                Edit Job
              </button>
              <button
                onClick={() => navigate(`/job/${job._id}/applicants`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium shadow hover:shadow-md transition-colors"
              >
                Manage Applicants ({applicationsCount})
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-teal/10 px-6 py-4">
          <p className="text-teal-dark">
            <span className="font-medium text-teal">{applicationsCount}</span> people have applied to this job
            {isOwner && applicationsCount > 0 && (
              <Link 
                to={`/job/${job._id}/applicants`}
                className="ml-2 text-teal hover:text-teal-dark hover:underline transition-colors"
              >
                Review applications
              </Link>
            )}
          </p>
        </div>
      </div>

      {/* Show applicants list for the recruiter who posted the job */}
      {isOwner && <ApplicantsList jobId={id} />}
      
      {/* Application Modal */}
      <ApplicationModal 
        isOpen={showApplicationModal} 
        onClose={() => setShowApplicationModal(false)} 
        jobId={id}
        jobTitle={title}
      />
    </div>
  );
};

export default JobDetails; 