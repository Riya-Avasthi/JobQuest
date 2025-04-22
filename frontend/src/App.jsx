import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobsProvider } from './context/jobsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Troubleshoot from './pages/Troubleshoot';
import ApplicantTracking from './pages/ApplicantTracking';

function App() {
  return (
    <Router>
      <JobsProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/troubleshoot" element={<Troubleshoot />} />
          
          {/* Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="job/:id/applicants" element={<ApplicantTracking />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </JobsProvider>
    </Router>
  );
}

export default App;
