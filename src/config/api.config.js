export const API_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
    API_KEY: process.env.REACT_APP_API_KEY,
    LANGUAGE: 'ko-KR'
  };
  
  export const ENDPOINTS = {
    TRENDING: '/trending/all/week',
    NOW_PLAYING: '/movie/now_playing',
    TOP_RATED: '/movie/top_rated',
    POPULAR: '/movie/popular',
    LATEST: '/movie/upcoming', // 최신 영화는 upcoming API를 사용
  };
  
  export const MOVIE_CATEGORIES = {
    trending: {
      title: "인기 영화",
      endpoint: ENDPOINTS.TRENDING
    },
    nowPlaying: {
      title: "현재 상영작",
      endpoint: ENDPOINTS.NOW_PLAYING
    },
    topRated: {
      title: "최고 평점",
      endpoint: ENDPOINTS.TOP_RATED
    },
    popular: {
      title: "인기 상영작",
      endpoint: ENDPOINTS.POPULAR
    },
    latest: {
      title: "최신 영화",
      endpoint: ENDPOINTS.LATEST
    }
  };