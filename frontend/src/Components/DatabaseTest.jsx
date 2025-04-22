import React, { useState } from 'react';
import axios from 'axios';
import config from '../utils/config';

function DatabaseTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing database connection and operations...');
      const response = await axios.get(`${config.API_URL}/api/test-database`);
      setResult(response.data);
      console.log('Database test result:', response.data);
    } catch (err) {
      console.error('Database test failed:', err);
      setError(err.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px', margin: '20px 0' }}>
      <h3>MongoDB Database Test</h3>
      
      <button 
        onClick={testDatabase}
        disabled={loading}
        style={{ 
          padding: '8px 16px',
          backgroundColor: loading ? '#ccc' : '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Database Connection'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px', backgroundColor: '#edfff6', padding: '15px', borderRadius: '4px' }}>
          <h4>Test Result: {result.success ? 'Success' : 'Failed'}</h4>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Database:</strong> {result.databaseName || 'N/A'}</p>
          <p><strong>Collection:</strong> {result.collectionName || 'N/A'}</p>
          
          {result.inserted && (
            <div>
              <p><strong>Test Document Created:</strong></p>
              <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
                {JSON.stringify(result.inserted, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '20px', backgroundColor: '#ffeded', padding: '15px', borderRadius: '4px' }}>
          <h4>Error</h4>
          <p>{error.message || 'Unknown error'}</p>
          {error.readyState !== undefined && (
            <p>
              <strong>MongoDB Connection State:</strong> {' '}
              {error.readyState === 0 ? 'Disconnected' : 
               error.readyState === 1 ? 'Connected' : 
               error.readyState === 2 ? 'Connecting' : 
               error.readyState === 3 ? 'Disconnecting' : 'Unknown'}
            </p>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h4>Troubleshooting Tips:</h4>
        <ul>
          <li>Make sure MongoDB connection string in backend .env is correct</li>
          <li>Check that the database name in the connection string matches your desired database</li>
          <li>Verify MongoDB Atlas network access settings allow connections from your IP</li>
          <li>Check MongoDB Atlas user has correct permissions</li>
          <li>For local MongoDB, ensure the MongoDB service is running</li>
        </ul>
      </div>
    </div>
  );
}

export default DatabaseTest; 