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

// API 키 가져오기
export const getApiKey = () => {
  const apiKey = localStorage.getItem('TMDB-Key');
  if (!apiKey) {
    throw new Error('API 키가 없습니다. 로그인이 필요합니다.');
  }
  return apiKey;
};

// API URL 생성
export const createApiUrl = (endpoint, params = {}) => {
  try {
    const apiKey = getApiKey();
    const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    const queryParams = new URLSearchParams({
      api_key: apiKey,
      language: API_CONFIG.LANGUAGE,
      ...params
    });

    return `${baseUrl}?${queryParams.toString()}`;
  } catch (error) {
    console.error('API URL 생성 실패:', error);
    throw error;
  }
};

// 이미지 URL 생성
export const createImageUrl = (path, size = 'original') => {
  if (!path) return '/placeholder-image.jpg';
  return `${API_CONFIG.IMAGE_BASE_URL}${size}${path}`;
};

// API 요청 함수
export const fetchFromApi = async (endpoint, params = {}) => {
  try {
    const url = createApiUrl(endpoint, params);
    const response = await fetch(url);

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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 이미지 사이즈 옵션
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
};

// API 에러 처리
export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.message.includes('API 키')) {
    // API 키 관련 에러
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('TMDB-Key');
    window.location.href = '/signin';
    return '로그인이 필요합니다.';
  }
  return '오류가 발생했습니다. 다시 시도해주세요.';
};