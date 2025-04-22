import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../utils/config';

function ConnectionTest() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [apiURL, setApiURL] = useState(config.API_URL);

  useEffect(() => {
    const testConnection = async () => {
      // Try the direct test endpoint first
      try {
        console.log(`Attempting to connect to: ${config.API_URL}/api/test-connection`);
        const response = await axios.get(`${config.API_URL}/api/test-connection`, {
          withCredentials: true,
          timeout: 5000 // 5 second timeout
        });
        setStatus(response.data.message);
        console.log("API Connection success:", response.data);
        setError(null);
      } catch (directErr) {
        console.error('Direct connection test failed, trying API route:', directErr);
        
        // Fall back to the regular API route
        try {
          const response = await axios.get(`${config.API_URL}/api/v1/test`, {
            withCredentials: true,
            timeout: 5000
          });
          setStatus(response.data.message);
          console.log("API v1 Connection success:", response.data);
          setError(null);
        } catch (apiErr) {
          console.error('All connection tests failed:', apiErr);
          const errorDetails = apiErr.response 
            ? `Status: ${apiErr.response.status}, Data: ${JSON.stringify(apiErr.response.data)}`
            : apiErr.message;
          setError(errorDetails);
          setStatus('Failed to connect to backend');
        }
      } finally {
        setTimestamp(new Date().toLocaleTimeString());
      }
    };

    testConnection();
    
    // Try again every 10 seconds
    const interval = setInterval(testConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: error ? '#ffeded' : '#edfff6', borderRadius: '5px', margin: '20px 0' }}>
      <h3>Backend Connection Status</h3>
      <p>Status: {status}</p>
      <p>Last checked: {timestamp}</p>
      <p>Connecting to: {apiURL}</p>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <p>Error: {error}</p>
          <p>Troubleshooting tips:</p>
          <ul>
            <li>Make sure backend is running on port 3000</li>
            <li>Check if CORS is properly configured</li>
            <li>Verify network connectivity between frontend and backend</li>
          </ul>
        </div>
      )}
      <button 
        onClick={() => window.location.reload()}
        style={{ padding: '8px 16px', marginTop: '10px', cursor: 'pointer' }}
      >
        Retry Now
      </button>
    </div>
  );
}

export default ConnectionTest; 