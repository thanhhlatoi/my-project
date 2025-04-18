import {
    LayoutDashboard, Box, Heart, Mail,
    ListOrdered, Package, Calendar,
    Contact, Settings, LogOut,

} from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import { useState } from "react";

  const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [active, setActive] = useState("Dashboard");
    const navigate = useNavigate();

    const menu = [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
      { name: "Film", icon: <Box size={20} />, path: "/FlimPage" },
      { name: "Genre", icon: <Heart size={20} />, path: "/genre" },
      { name: "Author", icon: <Mail size={20} />, path: "/inbox" },
      { name: "Performer", icon: <ListOrdered size={20} />, path: "/orders" },
      { name: "Product Stock", icon: <Package size={20} />, path: "/stock" },
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

        <div className="px-6 py-4 font-bold text-xl text-blue-600 flex justify-between items-center">
          Dash
          <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menu.map((item) => (
            <button
              key={item.name}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium ${
                active === item.name ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleClick(item.name, item.path)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}

          <div className="mt-4 text-gray-400 text-xs uppercase px-3">Pages</div>

          {pages.map((item) => (
            <button
              key={item.name}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium ${
                active === item.name ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleClick(item.name, item.path)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t flex flex-col space-y-2">
          <button className="flex items-center text-sm text-gray-600 hover:text-red-500">
            <Settings size={18} className="mr-2" />
            Settings
          </button>
          <button className="flex items-center text-sm text-gray-600 hover:text-red-500">
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    );
  };

  export default Sidebar;
