import { Outlet } from 'react-router-dom';
import Header from '../Components/Header';
import { useJobsContext } from '../context/jobsContext';
import { Navigate } from 'react-router-dom';

const MainLayout = () => {
  const { user } = useJobsContext();
  
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-teal text-cream py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} JobQuest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 