// constants/api.config.js

// API 키 가져오기 함수
export const getApiKey = () => {
  const apiKey = localStorage.getItem('TMDB-Key');
  if (!apiKey) {
    throw new Error('API 키가 없습니다. 로그인이 필요합니다.');
  }
  return apiKey;
};

// 기본 설정
export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
  LANGUAGE: 'ko-KR'
};

// 엔드포인트
export const ENDPOINTS = {
  TRENDING: '/trending/movie/week',  // 대세 콘텐츠
  NOW_PLAYING: '/movie/now_playing', // 현재 상영작
  TOP_RATED: '/movie/top_rated',     // 최고 평점
};

// 영화 카테고리
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

// API URL 생성 함수
export const createApiUrl = (endpoint) => {
  const apiKey = getApiKey();
  return `${API_CONFIG.BASE_URL}${endpoint}?api_key=${apiKey}&language=${API_CONFIG.LANGUAGE}`;
};

// 이미지 URL 생성 함수
export const createImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${API_CONFIG.IMAGE_BASE_URL}${size}${path}`;
};

// API 요청 함수
export const fetchFromApi = async (endpoint) => {
  try {
    const response = await fetch(createApiUrl(endpoint));
    if (!response.ok) {
      if (response.status === 401) {
        // API 키가 유효하지 않은 경우
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('TMDB-Key');
        window.location.href = '/signin';
        throw new Error('API 키가 유효하지 않습니다. 다시 로그인해주세요.');
      }
      throw new Error('API 요청에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};