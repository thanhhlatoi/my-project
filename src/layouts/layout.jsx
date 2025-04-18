import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`ml-0 lg:ml-64 transition-all duration-300`}>
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
