import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import favoriteService from '../api/FavoriteService';

const FavoriteButton = ({ 
    movieId, 
    size = 'md', 
    variant = 'button', 
    className = '',
    onToggle = null,
    disabled = false,
    readOnly = false
}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        checkFavoriteStatus();
    }, [movieId]);

    const checkFavoriteStatus = async () => {
        if (!movieId) return;
        
        try {
            setIsChecking(true);
            const response = await favoriteService.checkIsFavorite(movieId);
            setIsFavorite(response.isFavorite || false);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleToggle = async (e) => {
        e.stopPropagation(); // Prevent event bubbling
        
        if (isLoading || !movieId || disabled || readOnly) return;

        try {
            setIsLoading(true);
            const response = await favoriteService.toggleFavorite(movieId);
            setIsFavorite(response.isFavorite);
            
            // Call callback if provided
            if (onToggle) {
                onToggle(response.isFavorite, movieId);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Show error message
            alert('Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-4 h-4';
            case 'lg':
                return 'w-6 h-6';
            case 'xl':
                return 'w-8 h-8';
            default:
                return 'w-5 h-5';
        }
    };

    const getButtonClasses = () => {
        const baseClasses = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
        const sizeClasses = {
            sm: 'p-1',
            md: 'p-2',
            lg: 'p-3',
            xl: 'p-4'
        };
        
        switch (variant) {
            case 'icon':
                return `${baseClasses} ${sizeClasses[size]} rounded-full hover:bg-gray-100 focus:ring-red-500`;
            case 'outline':
                return `${baseClasses} ${sizeClasses[size]} border-2 rounded-lg hover:bg-red-50 focus:ring-red-500 ${
                    isFavorite 
                        ? 'border-red-500 text-red-500 bg-red-50' 
                        : 'border-gray-300 text-gray-600 hover:border-red-300'
                }`;
            default:
                return `${baseClasses} ${sizeClasses[size]} rounded-lg focus:ring-red-500 ${
                    isFavorite 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`;
        }
    };

    const getHeartClasses = () => {
        const sizeClasses = getSizeClasses();
        if (variant === 'icon') {
            return `${sizeClasses} ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`;
        }
        return `${sizeClasses} ${isFavorite ? 'fill-current' : ''}`;
    };

    if (isChecking) {
        return (
            <div className={`${getButtonClasses()} ${className} opacity-50 cursor-not-allowed`}>
                <div className={`${getSizeClasses()} animate-pulse bg-gray-300 rounded`}></div>
            </div>
        );
    }

    return (
        <button
            onClick={readOnly ? undefined : handleToggle}
            disabled={isLoading || disabled}
            className={`${getButtonClasses()} ${className} ${
                isLoading || disabled || readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            title={
                readOnly 
                    ? 'Chỉ xem' 
                    : isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'
            }
        >
            {isLoading ? (
                <div className={`${getSizeClasses()} animate-spin border-2 border-current border-t-transparent rounded-full`}></div>
            ) : (
                <Heart className={getHeartClasses()} />
            )}
        </button>
    );
};

// Higher-order component for easy integration
export const withFavoriteButton = (WrappedComponent) => {
    return (props) => {
        const [favoriteCount, setFavoriteCount] = useState(props.favoriteCount || 0);
        
        const handleFavoriteToggle = (isFavorite) => {
            setFavoriteCount(prev => isFavorite ? prev + 1 : prev - 1);
        };

        return (
            <WrappedComponent
                {...props}
                favoriteCount={favoriteCount}
                FavoriteButton={(buttonProps) => (
                    <FavoriteButton
                        {...buttonProps}
                        onToggle={handleFavoriteToggle}
                    />
                )}
            />
        );
    };
};

export default FavoriteButton; 