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
    Tags
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [active, setActive] = useState("Dashboard");
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
        { name: "Film", icon: <Film size={20} />, path: "/FlimPage" },
        { name: "Genre", icon: <Tags size={20} />, path: "/genre" },
        { name: "Author", icon: <BookOpen size={20} />, path: "/author" },
        { name: "Performer", icon: <User size={20} />, path: "/performer" },
    ];

    const pages = [
        { name: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
        { name: "Contact", icon: <Contact size={20} />, path: "/contact" },
    ];

    const handleClick = (name, path) => {
        setActive(name);
        navigate(path);
        if (toggleSidebar) toggleSidebar();
    };

    return (
        <div className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <div className="px-6 py-4 font-bold text-xl text-blue-600 flex justify-between items-center border-b">
                <div className="flex items-center">
                    <Film className="mr-2" size={24} />
                    <span>FilmDash</span>
                </div>
                <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-black">
                    ✕
                </button>
            </div>

            <div className="py-4">
                <nav className="px-4 space-y-1">
                    <div className="text-gray-400 text-xs uppercase px-3 mb-2">Menu</div>
                    {menu.map((item) => (
                        <button
                            key={item.name}
                            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                active === item.name ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => handleClick(item.name, item.path)}
                        >
                            <span className="mr-3 opacity-75">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}

                    <div className="mt-6 text-gray-400 text-xs uppercase px-3 mb-2">Pages</div>

                    {pages.map((item) => (
                        <button
                            key={item.name}
                            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                active === item.name ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => handleClick(item.name, item.path)}
                        >
                            <span className="mr-3 opacity-75">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t">
                <div className="space-y-2">
                    <button className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                        <Settings size={18} className="mr-3 opacity-75" />
                        Settings
                    </button>
                    <button className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut size={18} className="mr-3 opacity-75" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
