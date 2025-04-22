import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useJobsContext } from '../context/jobsContext';

const initialState = {
  email: '',
  password: '',
};

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
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
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = values;
    
    if (!email || !password) {
      toast.error('Please fill out all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Login URL:', `${API_URL}/api/v1/auth/login`);
      console.log('Login data:', { email });
      
      // Try to use the full URL to avoid any relative path issues
      const fullUrl = `${API_URL}/api/v1/auth/login`;
      console.log('Sending login request to:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
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
        throw new Error(data.message || 'Login failed');
      }
      
      console.log('Login successful:', data);
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error details:', error);
      
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.');
      } else if (serverStatus === 'offline') {
        toast.error('Cannot connect to the server. Is the backend running?');
      } else {
        toast.error(error.message || 'Login failed. Please try again later.');
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
            Welcome Back
          </h2>
          <p className="auth-subheading">
            Sign in to continue your job search journey
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
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
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
                autoComplete="current-password"
                required
                className="auth-input"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || serverStatus === 'offline'}
              className="auth-button"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
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
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 