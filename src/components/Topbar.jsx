// src/components/Topbar.jsx
import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar */}
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-black">
          <Menu size={24} />
        </button>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-gray-600" size={20} />
        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/30?img=15"
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Topbar;