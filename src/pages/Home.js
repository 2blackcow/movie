import React from "react";
import Banner from "../components/Banner";
import { useSelector } from "react-redux";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
import useFetch from "../hooks/useFetch";
import { MOVIE_CATEGORIES } from "../config/api.config";
import MovieSection from "../components/MovieSection";

const Home = () => {
  // Banner data는 Redux에서 관리
  const trendingData = useSelector((state) => state.movieData.bannerData) || [];

  return (
    <div className="w-full">
      <Banner />
      <div className="container mx-auto px-4 space-y-8">
        {/* 트렌딩 영화 섹션 */}
        <HorizontalScrollCard 
          data={trendingData} 
          heading={MOVIE_CATEGORIES.trending.title}
        />
        
        {/* 다른 카테고리들 */}
        {Object.entries(MOVIE_CATEGORIES)
          .filter(([key]) => key !== 'trending') // trending은 이미 위에서 표시
          .map(([key, category]) => (
            <MovieSection 
              key={key}
              endpoint={category.endpoint}
              title={category.title}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;