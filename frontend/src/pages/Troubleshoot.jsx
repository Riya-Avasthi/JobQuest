import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Troubleshoot = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [testStatus, setTestStatus] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [pingTime, setPingTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [corsError, setCorsError] = useState(null);
  
  useEffect(() => {
    const checkEndpoints = async () => {
      setIsLoading(true);
      setError(null);
      setCorsError(null);
      
      try {
        // First measure ping time
        const startTime = Date.now();
        
        // Check if server is reachable at all
        try {
          const pingResponse = await fetch(`${API_URL}/api/test-connection`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          const endTime = Date.now();
          setPingTime(endTime - startTime);
          
          const pingData = await pingResponse.json();
          setTestStatus({
            success: true,
            message: pingData.message,
            timestamp: pingData.timestamp
          });
        } catch (pingError) {
          setPingTime(null);
          setTestStatus({
            success: false,
            error: pingError.message
          });
          
          if (pingError.message.includes('Cross-Origin')) {
            setCorsError('CORS issue detected. The server is running but not allowing cross-origin requests.');
          }
        }
        
        // Check health endpoint
        try {
          const healthResponse = await fetch(`${API_URL}/api/v1/health-check`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          const healthData = await healthResponse.json();
          setHealthStatus({
            success: true,
            status: healthData.status,
            dbConnection: healthData.dbConnection,
            timestamp: healthData.timestamp,
            environment: healthData.environment
          });
        } catch (healthError) {
          setHealthStatus({
            success: false,
            error: healthError.message
          });
        }
        
        // Check database status
        try {
          const dbResponse = await fetch(`${API_URL}/api/test-database`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json' 
            }
          });
          
          const dbData = await dbResponse.json();
          setDbStatus({
            success: dbData.success,
            message: dbData.message,
            databaseName: dbData.databaseName
          });
        } catch (dbError) {
          setDbStatus({
            success: false,
            error: dbError.message
          });
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkEndpoints();
  }, []);
  
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setHealthStatus(null);
    setTestStatus(null);
    setDbStatus(null);
    setPingTime(null);
    setCorsError(null);
    
    // Re-run the checks after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-cream-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-teal mb-6">API Connection Troubleshooter</h1>
          
          {isLoading ? (
            <div className="text-center p-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal border-r-transparent"></div>
              <p className="mt-4 text-teal-dark">Testing API connectivity...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md text-red-800 mb-6">
              <p className="font-semibold">Error testing connection:</p>
              <p>{error}</p>
              <button 
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-teal text-white rounded hover:bg-teal-dark"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-teal-dark mb-2">Connection Summary</h2>
                <div className="bg-cream p-4 rounded-md">
                  <p className="mb-2">
                    <span className="font-medium">API URL:</span> {API_URL}
                  </p>
                  {pingTime !== null && (
                    <p className="mb-2">
                      <span className="font-medium">Ping time:</span> {pingTime}ms
                    </p>
                  )}
                  <p className="mb-2">
                    <span className="font-medium">Overall status:</span>{' '}
                    {healthStatus?.success && testStatus?.success ? (
                      <span className="text-green-600 font-medium">Connected</span>
                    ) : (
                      <span className="text-red-600 font-medium">Connection issues detected</span>
                    )}
                  </p>
                  {corsError && (
                    <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                      <p className="font-semibold">CORS Issue Detected:</p>
                      <p>{corsError}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`p-4 rounded-md ${testStatus?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h3 className="font-semibold mb-2">Basic Connectivity</h3>
                  {testStatus?.success ? (
                    <p className="text-green-600">✓ Server reachable</p>
                  ) : (
                    <p className="text-red-600">✗ Server unreachable</p>
                  )}
                  <p className="text-sm mt-2">{testStatus?.message || testStatus?.error}</p>
                </div>
                
                <div className={`p-4 rounded-md ${healthStatus?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h3 className="font-semibold mb-2">API Health</h3>
                  {healthStatus?.success ? (
                    <p className="text-green-600">✓ API is healthy</p>
                  ) : (
                    <p className="text-red-600">✗ API health check failed</p>
                  )}
                  {healthStatus?.status && (
                    <p className="text-sm mt-2">Status: {healthStatus.status}</p>
                  )}
                  {healthStatus?.environment && (
                    <p className="text-sm">Environment: {healthStatus.environment}</p>
                  )}
                </div>
                
                <div className={`p-4 rounded-md ${dbStatus?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h3 className="font-semibold mb-2">Database</h3>
                  {dbStatus?.success ? (
                    <p className="text-green-600">✓ Database connected</p>
                  ) : (
                    <p className="text-red-600">✗ Database issue</p>
                  )}
                  {dbStatus?.message && (
                    <p className="text-sm mt-2">{dbStatus.message}</p>
                  )}
                  {dbStatus?.databaseName && (
                    <p className="text-sm">DB: {dbStatus.databaseName}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-teal-dark mb-2">Troubleshooting Steps</h2>
                <ul className="list-disc list-inside space-y-2 bg-cream p-4 rounded-md">
                  <li>Make sure the backend server is running (<code>cd backend && npm run dev</code>)</li>
                  <li>Check that MongoDB is installed and running on port 27017</li>
                  <li>Verify that the frontend is using the correct API URL: <code>{API_URL}</code></li>
                  <li>Ensure CORS is properly configured in the backend</li>
                  <li>Check for network issues or firewall blocking connections</li>
                </ul>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 bg-teal text-white rounded hover:bg-teal-dark"
                >
                  Test Again
                </button>
                <Link to="/" className="px-4 py-2 border border-teal text-teal rounded hover:bg-teal hover:text-white">
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Troubleshoot; 