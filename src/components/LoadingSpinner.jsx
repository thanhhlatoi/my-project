import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                <div className="text-center">
                    <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin mx-auto mb-4`} />
                    <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-8">
            <div className="text-center">
                <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin mx-auto mb-2`} />
                <p className={`${textSizeClasses[size]} text-gray-600`}>{text}</p>
            </div>
        </div>
    );
};

// Component cho inline loading
export const InlineLoader = ({ size = 'sm' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
    );
};

// Component cho button loading
export const ButtonLoader = () => {
    return (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
    );
};

export default LoadingSpinner; 