import React from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">JobQuest</Link>
          <nav className="flex gap-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/findwork" className="hover:text-primary">Find Work</Link>
            <Link to="/myjobs" className="hover:text-primary">My Jobs</Link>
            <Link to="/post" className="hover:text-primary">Post Job</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Toaster position="top-center" />
        {children}
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} JobQuest. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout; 