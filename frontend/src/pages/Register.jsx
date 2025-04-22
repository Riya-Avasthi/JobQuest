import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useJobsContext } from '../context/jobsContext';

const initialState = {
  name: '',
  email: '',
  password: '',
  role: 'jobseeker',
};

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { user, setUser, setToken } = useJobsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const navigate = useNavigate();

  // Check if the server is reachable
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/health-check`, { 
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          setServerStatus('online');
          console.log('Server is reachable at:', API_URL);
        } else {
          setServerStatus('error');
          console.error('Server returned an error:', response.status);
        }
      } catch (error) {
        setServerStatus('offline');
        console.error('Server connection error:', error);
        toast.error(`Cannot connect to server at ${API_URL}. Please ensure the backend is running.`);
      }
    };
    
    checkServer();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = values;
    
    if (!name || !email || !password) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('Registration URL:', `${API_URL}/api/v1/auth/register`);
      console.log('Registration data:', { name, email, password, role });
      
      // Try to use the full URL to avoid any relative path issues
      const fullUrl = `${API_URL}/api/v1/auth/register`;
      console.log('Sending registration request to:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });
      
      // Get response details even if it fails
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers]));
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        throw new Error('Invalid server response format');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      console.log('Registration successful:', data);
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Registration error details:', error);
      
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.');
      } else if (serverStatus === 'offline') {
        toast.error('Cannot connect to the server. Is the backend running?');
      } else {
        toast.error(error.message || 'Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div>
          <h2 className="auth-heading">
            Join JobQuest
          </h2>
          <p className="auth-subheading">
            Create your account to start your journey
          </p>
          {serverStatus === 'offline' && (
            <div className="mt-4 p-2 bg-red-100 text-red-600 rounded text-sm text-center">
              Backend server appears to be offline. Please ensure it's running.
              <div className="mt-1">
                <Link to="/troubleshoot" className="text-teal underline">Troubleshoot connection issues</Link>
              </div>
            </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-teal-dark mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="auth-input"
                placeholder="Full Name"
                value={values.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-teal-dark mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="auth-input"
                placeholder="Email address"
                value={values.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-teal-dark mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="auth-input"
                placeholder="Password (min. 6 characters)"
                value={values.password}
                onChange={handleChange}
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-teal-dark mb-1">I am a</label>
              <select
                id="role"
                name="role"
                className="auth-input"
                value={values.role}
                onChange={handleChange}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || serverStatus === 'offline'}
              className="auth-button"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-2">
            API URL: {API_URL}
            {serverStatus !== 'online' && (
              <div className="mt-1">
                <Link to="/troubleshoot" className="text-teal underline">Troubleshoot connection</Link>
              </div>
            )}
          </div>
          
          <div className="text-sm text-center text-teal-dark">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 