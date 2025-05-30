import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbNameMap = {
        'HomePage': 'Dashboard',
        'FlimPage': 'Movies',
        'genre': 'Genres',
        'author': 'Authors',
        'performer': 'Performers',
        'user': 'Users',
        'category': 'Categories',
        'videoFilm': 'Video Management',
        'analytics': 'Analytics',
        'settings': 'Settings',
        'calendar': 'Calendar',
        'contact': 'Contact'
    };

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link 
                to="/HomePage" 
                className="flex items-center hover:text-blue-600 transition-colors"
            >
                <Home size={16} className="mr-1" />
                Home
            </Link>
            
            {pathnames.map((pathname, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const breadcrumbName = breadcrumbNameMap[pathname] || pathname;

                return (
                    <React.Fragment key={pathname}>
                        <ChevronRight size={16} className="text-gray-400" />
                        {isLast ? (
                            <span className="text-gray-900 font-medium">
                                {breadcrumbName}
                            </span>
                        ) : (
                            <Link 
                                to={routeTo} 
                                className="hover:text-blue-600 transition-colors"
                            >
                                {breadcrumbName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb; 