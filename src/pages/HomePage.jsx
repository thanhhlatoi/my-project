import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="relative">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`ml-0 lg:ml-64 transition-all duration-300`}>
                <Topbar toggleSidebar={toggleSidebar} />

                <main className="p-6">
                    <h1 className="text-2xl font-bold">Chào mừng đến với DashStack</h1>
                    <p className="mt-4">Nội dung hiển thị ở đây...</p>
                </main>
            </div>
        </div>
    );
};

export default HomePage;