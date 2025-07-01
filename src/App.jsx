import React from "react";
import {BrowserRouter as Router, Routes, Route, useLocation, useParams, Navigate} from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import HomePage from "./pages/HomePage";
import Genre from "./pages/Genre";
import Author from "./pages/AuthorPage";
import Performer from "./pages/PerformerPage";
import Sidebar from "./components/Sidebar";
import FilmPage from "./pages/FlimPage.jsx";
import './App.css'
import FilmDetail from "./components/FilmDetail.jsx";
import FilmWatch from "./components/FilmWatch.jsx";
import User from "./pages/UserPage";
import Category from "./pages/CategoryPage";
import VideoFilm from "./pages/VideoFilmPage";
import WatchPage from "./pages/WatchPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import FavoriteManagementPage from "./pages/FavoriteManagementPage.jsx";

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
                    <Route path="/dashboard" element={<HomePage />} />
                    <Route path="/HomePage" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/favorites" element={<Navigate to="/favorites-management" replace />} />
                    <Route path="/genre" element={<Genre />} />
                    <Route path="/FlimPage" element={<FilmPage />} />
                    <Route path="/film/:id" element={<FilmDetail />} />
                    <Route path="/movies" element={<FilmWatch />} />
                    <Route path="/author" element={<Author />} />
                    <Route path="/performer" element={<Performer />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/videoFilm" element={<VideoFilm />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/favorites-management" element={<FavoriteManagementPage />} />
                    <Route path="/watch/:id" element={<WatchPage />} />
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
function WatchPageWrapper() {
    const { videoId } = useParams();
    return <WatchPage videoId={videoId} />;
}
export default AppWrapper;
