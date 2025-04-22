import { useState } from 'react';
import { useJobsContext } from '../context/jobsContext';
import { toast } from 'react-toastify';

const ApplicationModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const { applyToJob } = useJobsContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max size
        toast.error('Resume file size must be less than 5MB');
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast.error('Please provide your phone number');
      return;
    }
    
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('phoneNumber', phoneNumber);
      formData.append('resume', resume);
      formData.append('coverLetter', coverLetter);
      
      await applyToJob(jobId, formData);
      onClose();
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream-light rounded-lg w-full max-w-lg overflow-hidden shadow-xl">
        <div className="bg-teal text-cream p-4">
          <h2 className="text-xl font-semibold">Apply for {jobTitle}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-teal font-medium mb-2" htmlFor="phoneNumber">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-teal/50"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-teal font-medium mb-2" htmlFor="resume">
              Resume (PDF, DOCX) *
            </label>
            <input
              type="file"
              id="resume"
              onChange={handleResumeChange}
              className="w-full p-2 border border-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-teal/50"
              accept=".pdf,.doc,.docx"
              required
            />
            <p className="text-sm text-teal-dark/70 mt-1">Max file size: 5MB</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-teal font-medium mb-2" htmlFor="coverLetter">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-2 border border-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-teal/50 min-h-[100px]"
              placeholder="Why do you want to work with us? (Optional)"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-teal px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal; 