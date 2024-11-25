import React, { useState, useEffect, useRef } from 'react';
import { MdGrid4X4, MdViewStream } from 'react-icons/md';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ScrollToTop from '../components/ScrollToTop';

const Popular = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef();
  const observer = useRef();

  const lastMovieElementRef = React.useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const calculateGridSize = () => {
    if (!containerRef.current) return { rows: 4, cols: 5 };
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = window.innerHeight - 240; 
    
    let columns;
    if (containerWidth >= 1536) columns = 6;    
    else if (containerWidth >= 1280) columns = 5;
    else if (containerWidth >= 1024) columns = 4;
    else if (containerWidth >= 768) columns = 3; 
    else if (containerWidth >= 640) columns = 2;
    else columns = 1;                            

    const cardWidth = (containerWidth - (columns + 1) * 16) / columns;
    const cardHeight = (cardWidth * 3) / 2;
    
    const rows = Math.floor(containerHeight / (cardHeight + 16)); 

    return { rows, cols: columns };
  };

  const fetchMovies = async (pageNumber) => {
    try {
      setLoading(true);
      const apiKey = localStorage.getItem('TMDB-Key');
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${pageNumber}`
      );
      const data = await response.json();
      
      if (viewMode === 'grid') {
        const { rows, cols } = calculateGridSize();
        const moviesNeeded = rows * cols;
        
        if (moviesNeeded > 20) {
          const nextPage = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${pageNumber + 1}`
          );
          const nextData = await nextPage.json();
          const allMovies = [...data.results, ...nextData.results];
          setMovies(allMovies.slice(0, moviesNeeded));
        } else {
          setMovies(data.results.slice(0, moviesNeeded));
        }
      } else {
        setMovies(data.results);
      }
      
      setTotalPages(Math.min(data.total_pages, 500));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(1);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'grid') {
      fetchMovies(page);
    }
  }, [page, viewMode]);

  useEffect(() => {
    const handleResize = () => {
      if (viewMode === 'grid') {
        fetchMovies(page);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode, page]);

  return (
    <div className="min-h-screen bg-neutral-900 pt-20">
      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">대세 콘텐츠</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full
                ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <MdGrid4X4 size={20} />
              Table View
            </button>
            <button
              onClick={() => setViewMode('infinite')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full
                ${viewMode === 'infinite' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <MdViewStream size={20} />
              Infinite Scroll
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 auto-rows-fr">
              {movies.map((movie) => (
                <div key={movie.id} className="aspect-[2/3]">
                  <Card data={movie} />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
                  disabled={page === 1}
                  className={`px-6 py-2 rounded-lg transition-colors
                    ${page === 1 ? 'bg-gray-700 text-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  ＜ 이전
                </button>
                
                <span className="text-white">
                  {page} / {totalPages} 페이지  
                </span>
                
                <button
                  onClick={() => setPage(prevPage => Math.min(prevPage + 1, totalPages))} 
                  disabled={page === totalPages}
                  className={`px-6 py-2 rounded-lg transition-colors
                    ${page === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  다음 ＞
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div key={movie.id}>
                <Card data={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popular;