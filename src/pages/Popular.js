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
  const [gridDimensions, setGridDimensions] = useState({ rows: 3, cols: 5 });
  const containerRef = useRef();

  const calculateGridSize = () => {
    if (!containerRef.current) return { rows: 3, cols: 5 };
    
    const containerWidth = containerRef.current.offsetWidth;
    const availableHeight = window.innerHeight - 300;
    
    let columns;
    if (containerWidth >= 1536) columns = 8;
    else if (containerWidth >= 1280) columns = 7;
    else if (containerWidth >= 1024) columns = 6;
    else if (containerWidth >= 768) columns = 5;
    else if (containerWidth >= 640) columns = 4;
    else columns = 3;
    
    const minGap = 16;
    const availableWidth = containerWidth - (minGap * (columns + 1));
    const cardWidth = Math.floor(availableWidth / columns);
    const cardHeight = Math.floor(cardWidth * 1.5);
    
    const rows = Math.min(3, Math.floor((availableHeight - minGap) / (cardHeight + minGap)));
    
    return { rows, cols: columns };
  };

  const fetchGridMovies = async (pageNumber) => {
    try {
      setLoading(true);
      const apiKey = localStorage.getItem('TMDB-Key');
      const { rows, cols } = gridDimensions;
      const moviesNeeded = rows * cols;
      
      const firstPageResponse = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${pageNumber}`
      );
      const firstPageData = await firstPageResponse.json();
      
      let moviesToDisplay = [...firstPageData.results];
      
      if (moviesNeeded > 20 && pageNumber < firstPageData.total_pages) {
        const secondPageResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${pageNumber + 1}`
        );
        const secondPageData = await secondPageResponse.json();
        moviesToDisplay = [...moviesToDisplay, ...secondPageData.results];
      }
      
      setMovies(moviesToDisplay.slice(0, moviesNeeded));
      setTotalPages(Math.min(Math.ceil(firstPageData.total_pages * 20 / moviesNeeded), 500));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const fetchInfiniteMovies = async (pageNumber, isFirstLoad = false) => {
    try {
      setLoading(true);
      const apiKey = localStorage.getItem('TMDB-Key');
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${pageNumber}`
      );
      const data = await response.json();
      
      if (isFirstLoad) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setHasMore(pageNumber < Math.min(data.total_pages, 500));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      viewMode === 'infinite' &&
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
      !loading &&
      hasMore
    ) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    if (viewMode === 'grid') {
      const dimensions = calculateGridSize();
      setGridDimensions(dimensions);
      setPage(1);
      fetchGridMovies(1);
    } else {
      setPage(1);
      fetchInfiniteMovies(1, true);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'grid') {
      fetchGridMovies(page);
    } else if (page > 1) {
      fetchInfiniteMovies(page);
    }
  }, [page, gridDimensions]);

  useEffect(() => {
    if (viewMode === 'infinite') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode, loading, hasMore]);

  useEffect(() => {
    const handleResize = () => {
      if (viewMode === 'grid') {
        const newDimensions = calculateGridSize();
        setGridDimensions(newDimensions);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  if (loading && movies.length === 0) {
    return <LoadingSpinner fullScreen message="콘텐츠를 불러오는 중..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-900 pt-24">
      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
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
            <div 
              className="grid auto-rows-fr overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
                gap: '16px',
                height: 'calc(100vh - 300px)',
                padding: '8px',
              }}
            >
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="relative"
                  style={{
                    aspectRatio: '2/3',
                    maxHeight: `calc((100vh - 300px - ${(gridDimensions.rows + 1) * 16}px) / ${gridDimensions.rows})`
                  }}
                >
                  <Card data={movie} />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
                  disabled={page === 1 || loading}
                  className={`px-6 py-2 rounded-lg transition-colors
                    ${page === 1 || loading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  ＜ 이전
                </button>
                
                <span className="text-white px-4">
                  {page} / {totalPages} 페이지
                </span>
                
                <button
                  onClick={() => setPage(prevPage => Math.min(prevPage + 1, totalPages))}
                  disabled={page === totalPages || loading}
                  className={`px-6 py-2 rounded-lg transition-colors
                    ${page === totalPages || loading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  다음 ＞
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="aspect-[2/3]">
                <Card data={movie} />
              </div>
            ))}
            {loading && <LoadingSpinner fullScreen message="콘텐츠를 불러오는 중..." />}
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Popular;