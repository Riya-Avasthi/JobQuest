import { useState, useEffect } from 'react';
import { useJobsContext } from '../context/jobsContext';
import { toast } from 'react-toastify';

const ApplicantsList = ({ jobId }) => {
  const { getJobApplicants } = useJobsContext();
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        const data = await getJobApplicants(jobId);
        if (data) {
          setApplicants(data);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        toast.error('Failed to load applicants');
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId, getJobApplicants]);

  const handleDownloadResume = (resumeUrl, applicantName) => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${applicantName.replace(/\s+/g, '_')}_resume${resumeUrl.substring(resumeUrl.lastIndexOf('.'))}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="text-center py-6 text-teal">Loading applicants...</div>;
  }

  if (!applicants || applicants.length === 0) {
    return <div className="text-center py-6 text-teal-dark">No applicants yet for this job.</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-teal">Applicants ({applicants.length})</h3>
      
      {selectedApplicant ? (
        <div className="bg-cream-light p-6 rounded-lg shadow-md border border-teal/10 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-teal">{selectedApplicant.name}</h4>
              <p className="text-teal-dark/80">{selectedApplicant.email}</p>
              <p className="text-teal-dark/80">{selectedApplicant.phoneNumber}</p>
            </div>
            <button 
              onClick={() => setSelectedApplicant(null)}
              className="text-teal hover:text-teal-dark"
            >
              ← Back to list
            </button>
          </div>
          
          <div className="mb-4">
            <h5 className="font-medium text-teal mb-2">Resume</h5>
            <button 
              className="btn-teal px-3 py-1 rounded text-sm"
              onClick={() => handleDownloadResume(selectedApplicant.resumeUrl, selectedApplicant.name)}
            >
              Download Resume
            </button>
          </div>
          
          {selectedApplicant.coverLetter && (
            <div>
              <h5 className="font-medium text-teal mb-2">Cover Letter</h5>
              <div className="bg-white p-4 rounded border border-teal/10 text-teal-dark/90 whitespace-pre-line">
                {selectedApplicant.coverLetter}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {applicants.map((applicant) => (
            <div 
              key={applicant._id} 
              className="bg-cream-light p-4 rounded-lg shadow-sm border border-teal/10 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedApplicant(applicant)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-teal">{applicant.name}</h4>
                  <p className="text-teal-dark/80 text-sm">{applicant.email}</p>
                </div>
                <span className="text-xs text-teal-dark/60">
                  Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsList; 