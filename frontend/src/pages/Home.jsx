import React from 'react';
import { Link } from 'react-router-dom';
import { useJobsContext } from '../context/jobsContext';

const Home = () => {
  const { user } = useJobsContext();
  
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-teal mb-6">
          Find Your Dream Job or Perfect Candidate
        </h1>
        <p className="text-xl text-teal-dark mb-10">
          JobQuest connects talented professionals with exciting opportunities. 
          Whether you're looking for a job or hiring talent, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user && (
            <Link
              to="/register"
              className="px-8 py-3 btn-teal rounded-md font-medium shadow-sm hover:shadow-md transition-all"
            >
              Join JobQuest
            </Link>
          )}
          <Link
            to="/jobs"
            className="px-8 py-3 bg-cream-light text-teal rounded-md font-medium border border-teal/20 hover:bg-cream-dark hover:border-teal/30 transition-all"
          >
            Browse Jobs
          </Link>
          {user?.role === 'recruiter' && (
            <Link
              to="/post-job"
              className="px-8 py-3 bg-teal-dark text-cream rounded-md font-medium hover:bg-teal-dark/90 transition-all"
            >
              Post a Job
            </Link>
          )}
        </div>
      </div>
      
      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-cream-light p-8 rounded-lg shadow-md border border-teal/10 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-teal mb-4">For Job Seekers</h3>
          <ul className="space-y-2 text-teal-dark/90 mb-6">
            <li>• Discover relevant opportunities</li>
            <li>• Apply with one click</li>
            <li>• Track your applications</li>
            <li>• Get noticed by top employers</li>
          </ul>
          <Link to="/jobs" className="text-teal font-medium hover:text-teal-dark hover:underline transition-colors">
            Find Jobs →
          </Link>
        </div>
        
        <div className="bg-cream-light p-8 rounded-lg shadow-md border border-teal/10 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-teal mb-4">For Recruiters</h3>
          <ul className="space-y-2 text-teal-dark/90 mb-6">
            <li>• Post job listings easily</li>
            <li>• Reach qualified candidates</li>
            <li>• Review applications efficiently</li>
            <li>• Build your employer brand</li>
          </ul>
          <Link to="/post-job" className="text-teal font-medium hover:text-teal-dark hover:underline transition-colors">
            Post a Job →
          </Link>
        </div>
        
        <div className="bg-cream-light p-8 rounded-lg shadow-md border border-teal/10 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-teal mb-4">Why JobQuest</h3>
          <ul className="space-y-2 text-teal-dark/90 mb-6">
            <li>• User-friendly interface</li>
            <li>• Smart matching algorithms</li>
            <li>• Dedicated support</li>
            <li>• Completely free to use</li>
          </ul>
          {!user ? (
            <Link to="/register" className="text-teal font-medium hover:text-teal-dark hover:underline transition-colors">
              Join Now →
            </Link>
          ) : (
            <Link to="/dashboard" className="text-teal font-medium hover:text-teal-dark hover:underline transition-colors">
              Go to Dashboard →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 