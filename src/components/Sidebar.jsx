import {
    LayoutDashboard,
    Film,
    BookOpen,
    Users,
    User,
    Calendar,
    Contact,
    Settings,
    LogOut,
    Tags,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState("Dashboard");
    const [menuOpen, setMenuOpen] = useState(true);
    const [pagesOpen, setPagesOpen] = useState(false);

    // Determine active menu item based on current path
    useEffect(() => {
        const path = location.pathname;
        const menuItem = [...menu, ...pages].find(item =>
            path === item.path || (path !== "/" && item.path !== "/" && path.startsWith(item.path))
        );
        if (menuItem) {
            setActive(menuItem.name);
        }
    }, [location.pathname]);

    const menu = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/HomePage" },
        { name: "Film", icon: <Film size={20} />, path: "/FlimPage" },
        { name: "Genre", icon: <Tags size={20} />, path: "/genre" },
        { name: "Author", icon: <BookOpen size={20} />, path: "/author" },
        { name: "Performer", icon: <User size={20} />, path: "/performer" },
        { name: "User", icon: <Users size={20} />, path: "/user" },
        { name: "Category", icon: <Users size={20} />, path: "/category" },
        { name: "VideoFilm", icon: <Users size={20} />, path: "/videoFilm" },
    ];

    const pages = [
        { name: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
        { name: "Contact", icon: <Contact size={20} />, path: "/contact" },
    ];

    const handleClick = (name, path) => {
        setActive(name);
        navigate(path);
        if (window.innerWidth < 1024 && toggleSidebar) {
            toggleSidebar();
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const togglePages = () => {
        setPagesOpen(!pagesOpen);
    };

    return (
        <div className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 border-r shadow-sm z-40 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:w-72`}>

            {/* Logo and Brand */}
            <div className="px-6 py-5 flex justify-between items-center border-b">
                <div className="flex items-center">
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg mr-2.5">
                        <Film size={20} />
                    </div>
                    <span className="font-bold text-xl text-gray-800">FilmDash</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg p-1.5"
                    aria-label="Close sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <div className="py-4 h-[calc(100vh-70px)] flex flex-col overflow-y-auto">
                <nav className="px-3 space-y-1 flex-grow">
                    {/* Menu Section */}
                    <div className="mb-4">
                        <button
                            onClick={toggleMenu}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
                        >
                            <span>MENU</span>
                            {menuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {menuOpen && (
                            <div className="mt-1 space-y-1">
                                {menu.map((item) => (
                                    <button
                                        key={item.name}
                                        className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            active === item.name
                                                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                        onClick={() => handleClick(item.name, item.path)}
                                    >
                                        <div className={`mr-3 ${active === item.name ? "text-blue-600" : "text-gray-500"}`}>
                                            {item.icon}
                                        </div>
                                        <span>{item.name}</span>
                                        {active === item.name && (
                                            <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pages Section */}
                    <div className="mb-4">
                        <button
                            onClick={togglePages}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
                        >
                            <span>PAGES</span>
                            {pagesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {pagesOpen && (
                            <div className="mt-1 space-y-1">
                                {pages.map((item) => (
                                    <button
                                        key={item.name}
                                        className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            active === item.name
                                                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                        onClick={() => handleClick(item.name, item.path)}
                                    >
                                        <div className={`mr-3 ${active === item.name ? "text-blue-600" : "text-gray-500"}`}>
                                            {item.icon}
                                        </div>
                                        <span>{item.name}</span>
                                        {active === item.name && (
                                            <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* User Profile Section */}
                <div className="mt-auto px-4 py-4 border-t bg-white">
                    <div className="flex items-center mb-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">Admin User</div>
                            <div className="text-xs text-gray-500">admin@filmdash.com</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <button className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                            <Settings size={18} className="mr-3 text-gray-500" />
                            Settings
                        </button>
                        <button className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                            <LogOut size={18} className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
