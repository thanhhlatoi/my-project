import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import HomePage from "./pages/HomePage";
import Genre from "./pages/Genre";
import Sidebar from "./components/Sidebar";
import FilmPage from "./pages/FlimPage.jsx";
import './App.css'

function App() {
    // Kiểm tra xem có đang ở trang login hay không
    const location = useLocation();
    const isLoginPage = location.pathname === "/";

    return (
        <div className="flex">
            {/* Chỉ hiện sidebar khi không phải trang login */}
            {!isLoginPage && <Sidebar />}

            <main className={!isLoginPage ? "flex-1 ml-64 p-6" : "flex-1"}>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/genre" element={<Genre />} />
                    <Route path="/flimPage" element={<FilmPage />} />
                </Routes>
            </main>
        </div>
    );
}

// Wrapper component để sử dụng useLocation
function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
