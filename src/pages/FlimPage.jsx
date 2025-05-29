import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FilmService from '../api/FilmService.js';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { BASE_URL } from "../api/config.js";
import CreateFilm from '../components/Create/CreateFilm.jsx';
import { Calendar, Star, Clock, Eye, Film as FilmIcon } from 'lucide-react';

const FlimPage = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await FilmService.getAll(page, 10, 'id', 'asc', searchKeyword);
            if (response && response.data && response.data.data) {
                setMovies(response.data.data.content || []);
                setTotalPages(response.data.data.totalPages || 1);
            } else {
                setMovies([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
            setMovies([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, searchKeyword]);

    const MovieCard = ({ movie, index }) => (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <Link to={`/film/${movie.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={movie.imgMovie 
                            ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${movie.imgMovie}` 
                            : 'https://via.placeholder.com/300x400?text=No+Poster'
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rating Badge */}
                    {movie.rating && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{movie.rating}</span>
                        </div>
                    )}
                    
                    {/* Duration Badge */}
                    {movie.duration && (
                        <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock size={12} />
                            <span className="text-xs">{movie.duration} min</span>
                        </div>
                    )}
                </div>
                
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {movie.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                        {movie.releaseDate && (
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                            </div>
                        )}
                        
                        {movie.genres && movie.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {movie.genres.slice(0, 2).map((genre, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                                {movie.genres.length > 2 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        +{movie.genres.length - 2}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {movie.views && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Eye size={14} />
                                <span>{movie.views.toLocaleString()} views</span>
                            </div>
                        )}
                    </div>
                    
                    {movie.description && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                            {movie.description}
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="🎬 Movie Collection"
                    description="Discover and explore our vast collection of movies"
                    showAddButton={true}
                    addButtonText="Add New Movie"
                    onAddClick={() => setShowModal(true)}
                    gradient="from-purple-600 to-pink-600"
                    showPagination={totalPages > 1}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />

                {/* Search Bar */}
                <SearchBar
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search movies by title, genre, or year..."
                    showFilters={true}
                    showExport={true}
                    onFilterClick={() => console.log('Filter clicked')}
                    onExportClick={() => console.log('Export clicked')}
                />

                {/* Movies Grid */}
                {loading ? (
                    <LoadingSpinner text="Loading movies..." />
                ) : (
                    <>
                        {movies.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {movies.map((movie, index) => (
                                    <MovieCard key={movie.id} movie={movie} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FilmIcon size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchKeyword 
                                        ? `No movies match "${searchKeyword}". Try a different search term.`
                                        : "Start building your movie collection by adding your first movie."
                                    }
                                </p>
                                {searchKeyword ? (
                                    <button
                                        onClick={() => setSearchKeyword('')}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Add First Movie
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Add Movie Modal */}
                {showModal && (
                    <CreateFilm
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onSuccess={() => {
                            setShowModal(false);
                            fetchData();
                        }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default FlimPage;
