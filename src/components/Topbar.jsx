import React, { useState } from 'react';
import { Menu, Search, Bell, MessageCircle, Calendar, Settings, HelpCircle } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
    const [notifications, setNotifications] = useState(3);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Toggle notification dropdown
    const toggleNotifications = () => {
        setIsNotificationOpen(!isNotificationOpen);
        if (isProfileOpen) setIsProfileOpen(false);
    };

    // Toggle profile dropdown
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        if (isNotificationOpen) setIsNotificationOpen(false);
    };

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b sticky top-0 z-30">
            <div className="flex items-center gap-4">
                {/* Toggle Sidebar */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>

                {/* Page Title */}
                <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Dashboard</h1>

                {/* Search */}
                <div className="relative ml-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="flex items-center gap-1 md:gap-3">
                {/* Quick Actions */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg hidden md:block transition-colors">
                    <Calendar size={20} />
                </button>

                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg hidden md:block transition-colors">
                    <MessageCircle size={20} />
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {notifications > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {notifications}
              </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                            <div className="px-4 py-2 border-b flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Notifications</h3>
                                <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full">{notifications} new</span>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-blue-500 cursor-pointer">
                                    <div className="flex gap-3">
                                        <div className="bg-blue-100 rounded-full p-2">
                                            <MessageCircle size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">New comment on "The Matrix"</p>
                                            <p className="text-xs text-gray-500">John Doe left a comment on your film</p>
                                            <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-green-500 cursor-pointer">
                                    <div className="flex gap-3">
                                        <div className="bg-green-100 rounded-full p-2">
                                            <Settings size={18} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">System update completed</p>
                                            <p className="text-xs text-gray-500">Your system has been updated successfully</p>
                                            <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex gap-3">
                                        <div className="bg-purple-100 rounded-full p-2">
                                            <Bell size={18} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Weekly report ready</p>
                                            <p className="text-xs text-gray-500">Your weekly analytics report is ready to view</p>
                                            <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-2 border-t text-center">
                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help button */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg hidden md:block transition-colors">
                    <HelpCircle size={20} />
                </button>

                {/* Avatar & Profile Dropdown */}
                <div className="relative ml-2">
                    <button
                        onClick={toggleProfile}
                        className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                    >
                        <img
                            src="https://i.pravatar.cc/300?img=15"
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <span className="text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                            <div className="px-4 py-3 border-b">
                                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                                <p className="text-xs text-gray-500">admin@example.com</p>
                            </div>

                            <div className="py-1">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <Settings size={14} className="text-blue-600" />
                  </span>
                                    Account settings
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <HelpCircle size={14} className="text-green-600" />
                  </span>
                                    Help &amp; Support
                                </button>
                            </div>

                            <div className="border-t py-1">
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Topbar;
