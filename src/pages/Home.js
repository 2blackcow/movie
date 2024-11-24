import React, { useState } from "react";
import Banner from "../components/Banner";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
import { fetchFromApi } from "../constants/api.config";
import { MOVIE_CATEGORIES, ENDPOINTS } from "../constants/api.config";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [movieSections, setMovieSections] = useState({
    trending: { data: null, loading: true, error: null },
    nowPlaying: { data: null, loading: true, error: null },
    topRated: { data: null, loading: true, error: null }
  });

  React.useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // 대세 콘텐츠 가져오기
        const trendingData = await fetchFromApi(ENDPOINTS.TRENDING);
        setMovieSections(prev => ({
          ...prev,
          trending: { data: trendingData.results, loading: false, error: null }
        }));

        // 현재 상영작 가져오기
        const nowPlayingData = await fetchFromApi(ENDPOINTS.NOW_PLAYING);
        setMovieSections(prev => ({
          ...prev,
          nowPlaying: { data: nowPlayingData.results, loading: false, error: null }
        }));

        // 최고 평점 가져오기
        const topRatedData = await fetchFromApi(ENDPOINTS.TOP_RATED);
        setMovieSections(prev => ({
          ...prev,
          topRated: { data: topRatedData.results, loading: false, error: null }
        }));
      } catch (error) {
        console.error('영화 데이터 로딩 실패:', error);
        // 에러 상태 업데이트
        setMovieSections(prev => ({
          trending: { ...prev.trending, loading: false, error: error.message },
          nowPlaying: { ...prev.nowPlaying, loading: false, error: error.message },
          topRated: { ...prev.topRated, loading: false, error: error.message }
        }));
      }
    };

    fetchMovieData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-neutral-900">
      <Banner />
      <div className="container mx-auto px-4 space-y-8 pt-8">
        {/* 대세 콘텐츠 섹션 */}
        {movieSections.trending.loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : movieSections.trending.error ? (
          <div className="text-white text-center py-8">
            {movieSections.trending.error}
          </div>
        ) : (
          <HorizontalScrollCard 
            data={movieSections.trending.data} 
            heading={MOVIE_CATEGORIES.trending.title}
          />
        )}
        
        {/* 현재 상영작 섹션 */}
        {movieSections.nowPlaying.loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : movieSections.nowPlaying.error ? (
          <div className="text-white text-center py-8">
            {movieSections.nowPlaying.error}
          </div>
        ) : (
          <HorizontalScrollCard 
            data={movieSections.nowPlaying.data} 
            heading={MOVIE_CATEGORIES.nowPlaying.title}
          />
        )}

        {/* 최고 평점 섹션 */}
        {movieSections.topRated.loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : movieSections.topRated.error ? (
          <div className="text-white text-center py-8">
            {movieSections.topRated.error}
          </div>
        ) : (
          <HorizontalScrollCard 
            data={movieSections.topRated.data} 
            heading={MOVIE_CATEGORIES.topRated.title}
          />
        )}
      </div>
    </div>
  );
};

export default Home;