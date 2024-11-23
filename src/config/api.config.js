export const API_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
    API_KEY: process.env.REACT_APP_API_KEY,
    LANGUAGE: 'ko-KR'
  };
  
  export const ENDPOINTS = {
    TRENDING: '/trending/all/week',  // 대세 콘텐츠
    NOW_PLAYING: '/movie/now_playing', // 현재 상영작
    TOP_RATED: '/movie/top_rated',   // 최고 평점
  };
  
  export const MOVIE_CATEGORIES = {
    trending: {
      title: "대세 콘텐츠",
      endpoint: ENDPOINTS.TRENDING
    },
    nowPlaying: {
      title: "현재 상영작",
      endpoint: ENDPOINTS.NOW_PLAYING
    },
    topRated: {
      title: "최고 평점",
      endpoint: ENDPOINTS.TOP_RATED
    }
  };