import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobsContext } from '@/context/jobsContext';
import { useGlobalContext } from '@/context/globalContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const JobCard = ({ job }) => {
  const { likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = (id) => {
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  useEffect(() => {
    if (userProfile?._id) {
      setIsLiked(job.likes?.includes(userProfile?._id));
    }
  }, [job.likes, userProfile]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between mb-4">
        <div 
          className="flex flex-col cursor-pointer" 
          onClick={() => navigate(`/job/${job._id}`)}
        >
          <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
          <p className="text-sm text-gray-600">{job.createdBy?.name || 'Anonymous'}</p>
        </div>
        <button
          className={`text-2xl ${isLiked ? "text-[#7263f3]" : "text-gray-400"}`}
          onClick={() => {
            isAuthenticated ? handleLike(job._id) : navigate("/login");
          }}
        >
          {isLiked ? "♥" : "♡"}
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">{job.location}</p>
        <p className="text-sm text-gray-500 mb-3">
          Posted {formatDate(job.createdAt)}
        </p>

        <p className="line-clamp-2 text-gray-700 mb-4">{job.description}</p>

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills?.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {job.tags?.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 