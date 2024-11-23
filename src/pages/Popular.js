import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import ScrollToTop from '../components/ScrollToTop';
import { MdLocalFireDepartment } from 'react-icons/md';

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 마지막 영화 요소 참조를 위한 콜백 함수
  const lastMovieElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 1.0 });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // 영화 데이터 가져오기
  const fetchMovies = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
          language: 'ko-KR',
          page: pageNum,
          region: 'KR',
          'vote_count.gte': 20, // 최소 20개 이상의 평가가 있는 영화만
        }
      });

      const newMovies = response.data.results.filter(movie => movie.poster_path);
      
      setMovies(prev => {
        // 중복 제거를 위한 Set 사용
        const uniqueMovies = new Set([...prev, ...newMovies].map(m => JSON.stringify(m)));
        return Array.from(uniqueMovies).map(m => JSON.parse(m));
      });
      
      setHasMore(newMovies.length > 0 && pageNum < response.data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      setLoading(false);
    }
  };

  // 초기 데이터 로드 및 페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-8">
          <MdLocalFireDepartment className="text-red-500" size={30} />
          <h1 className="text-2xl font-bold">대세 콘텐츠</h1>
        </div>

        {/* 영화 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-[200px]">
          {movies.map((movie, index) => {
            if (movies.length === index + 1) {
              // 마지막 요소에 ref 추가
              return (
                <div key={movie.id} ref={lastMovieElementRef}>
                  <Card data={movie} />
                </div>
              );
            } else {
              return (
                <div key={movie.id}>
                  <Card data={movie} />
                </div>
              );
            }
          })}
        </div>

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        )}

        {/* 더 이상 데이터가 없을 때 메시지 */}
        {!hasMore && movies.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            모든 콘텐츠를 불러왔습니다.
          </div>
        )}

        {/* 데이터가 없을 때 메시지 */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            표시할 콘텐츠가 없습니다.
          </div>
        )}
      </div>

      {/* 스크롤 탑 버튼 */}
      <ScrollToTop />
    </div>
  );
};

export default Popular;