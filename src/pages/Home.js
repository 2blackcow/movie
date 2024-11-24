import React from "react";
import Banner from "../components/Banner";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
import useFetch from "../hooks/useFetch";
import { MOVIE_CATEGORIES, ENDPOINTS } from "../config/api.config";

const Home = () => {
  // trending 데이터를 Redux에서 가져오는 대신 API로 직접 호출
  const { data: trendingData, loading: trendingLoading } = useFetch(ENDPOINTS.TRENDING);
  const { data: nowPlayingData, loading: nowPlayingLoading } = useFetch(ENDPOINTS.NOW_PLAYING);
  const { data: topRatedData, loading: topRatedLoading } = useFetch(ENDPOINTS.TOP_RATED);

  return (
    <div className="w-full">
      <Banner />
      <div className="container mx-auto px-4 space-y-8">
        {/* 대세 콘텐츠 섹션 */}
        {!trendingLoading && (
          <HorizontalScrollCard 
            data={trendingData} 
            heading={MOVIE_CATEGORIES.trending.title}
          />
        )}
        
        {/* 현재 상영작 섹션 */}
        {!nowPlayingLoading && (
          <HorizontalScrollCard 
            data={nowPlayingData} 
            heading={MOVIE_CATEGORIES.nowPlaying.title}
          />
        )}

        {/* 최고 평점 섹션 */}
        {!topRatedLoading && (
          <HorizontalScrollCard 
            data={topRatedData} 
            heading={MOVIE_CATEGORIES.topRated.title}
          />
        )}
      </div>
    </div>
  );
};

export default Home;