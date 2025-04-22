"use client";
import { Link, useLocation } from 'react-router-dom';
import { useJobsContext } from '../context/jobsContext';

function Header() {
  const { user, logout } = useJobsContext();
  const location = useLocation();
  
  return (
    <header className="bg-teal text-cream shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-bold text-2xl text-cream">JobQuest</h1>
          </Link>

          <nav>
            <ul className="flex items-center gap-8">
              <li>
                <Link
                  to="/jobs"
                  className={`py-2 px-4 ${
                    location.pathname === "/jobs"
                      ? "text-cream-light border-b-2 border-cream-light font-semibold"
                      : "hover:text-cream-light"
                  }`}
                >
                  Find Jobs
                </Link>
              </li>
              {user?.role === 'recruiter' && (
                <li>
                  <Link
                    to="/post-job"
                    className={`py-2 px-4 ${
                      location.pathname === "/post-job"
                        ? "text-cream-light border-b-2 border-cream-light font-semibold"
                        : "hover:text-cream-light"
                    }`}
                  >
                    Post a Job
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link
                    to="/dashboard"
                    className={`py-2 px-4 ${
                      location.pathname === "/dashboard"
                        ? "text-cream-light border-b-2 border-cream-light font-semibold"
                        : "hover:text-cream-light"
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="py-2 px-4 hover:text-cream-light"
                >
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="py-2 px-4 bg-red-600 text-cream rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="py-2 px-4 rounded bg-teal-dark text-cream hover:bg-teal-dark/80 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 rounded border border-cream hover:bg-teal-dark/20 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;