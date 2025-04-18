import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import Layout from '../layouts/layout.jsx';

const HomePage = () => {
    return (
        <Layout>
           <h1 className="text-2xl font-bold">Chào mừng đến với DashStack</h1>
           <p className="mt-4">Nội dung hiển thị ở đây...</p>
        </Layout>
    );
};

export default HomePage;