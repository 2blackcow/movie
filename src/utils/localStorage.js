// 스토리지 키 상수
export const STORAGE_KEYS = {
    CURRENT_USER: 'currentUser',
    IS_LOGGED_IN: 'isLoggedIn',
    TMDB_KEY: 'TMDB-Key',
    REMEMBERED_EMAIL: 'rememberedEmail',
    RECENT_SEARCHES: 'recentSearches',
    FAVORITE_MOVIES: 'favoriteMovies',
    USER_PREFERENCES: 'userPreferences',
    USERS: 'users'
  };
  
  // 사용자별 키 생성 함수
  const getUserKey = (key) => {
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return currentUser ? `${currentUser}_${key}` : key;
  };
  
  // 데이터 유효성 검증
  const validateData = (data) => {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error('Invalid data format:', error);
      return null;
    }
  };
  
  // 최근 검색어 관리
  export const searchHistory = {
    add: (searchTerm) => {
      try {
        const userSearchKey = getUserKey(STORAGE_KEYS.RECENT_SEARCHES);
        const searches = JSON.parse(localStorage.getItem(userSearchKey) || '[]');
        const updatedSearches = [searchTerm, ...searches.filter(term => term !== searchTerm)]
          .slice(0, 5)
          .filter(term => term && term.trim()); // 빈 문자열 필터링
        localStorage.setItem(userSearchKey, JSON.stringify(updatedSearches));
        return updatedSearches;
      } catch (error) {
        console.error('Error adding search term:', error);
        return [];
      }
    },
    
    get: () => {
      try {
        const userSearchKey = getUserKey(STORAGE_KEYS.RECENT_SEARCHES);
        return JSON.parse(localStorage.getItem(userSearchKey) || '[]');
      } catch (error) {
        console.error('Error getting search history:', error);
        return [];
      }
    },
    
    clear: () => {
      try {
        const userSearchKey = getUserKey(STORAGE_KEYS.RECENT_SEARCHES);
        localStorage.removeItem(userSearchKey);
      } catch (error) {
        console.error('Error clearing search history:', error);
      }
    },
  
    removeItem: (searchTerm) => {
      try {
        const userSearchKey = getUserKey(STORAGE_KEYS.RECENT_SEARCHES);
        const searches = JSON.parse(localStorage.getItem(userSearchKey) || '[]');
        const updatedSearches = searches.filter(term => term !== searchTerm);
        localStorage.setItem(userSearchKey, JSON.stringify(updatedSearches));
        return updatedSearches;
      } catch (error) {
        console.error('Error removing search term:', error);
        return [];
      }
    }
  };
  
  // 즐겨찾기 영화 관리
  export const favoriteMovies = {
    add: (movie) => {
      try {
        if (!movie || !movie.id) throw new Error('Invalid movie data');
        
        const userFavoritesKey = getUserKey(STORAGE_KEYS.FAVORITE_MOVIES);
        const favorites = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
        
        if (!favorites.some(fav => fav.id === movie.id)) {
          const validatedMovie = validateData(movie);
          if (!validatedMovie) throw new Error('Invalid movie data format');
          
          const updatedFavorites = [...favorites, validatedMovie];
          localStorage.setItem(userFavoritesKey, JSON.stringify(updatedFavorites));
          return updatedFavorites;
        }
        return favorites;
      } catch (error) {
        console.error('Error adding favorite movie:', error);
        return [];
      }
    },
    
    remove: (movieId) => {
      try {
        const userFavoritesKey = getUserKey(STORAGE_KEYS.FAVORITE_MOVIES);
        const favorites = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
        const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
        localStorage.setItem(userFavoritesKey, JSON.stringify(updatedFavorites));
        return updatedFavorites;
      } catch (error) {
        console.error('Error removing favorite movie:', error);
        return [];
      }
    },
    
    get: () => {
      try {
        const userFavoritesKey = getUserKey(STORAGE_KEYS.FAVORITE_MOVIES);
        return JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
      } catch (error) {
        console.error('Error getting favorite movies:', error);
        return [];
      }
    },
    
    isFavorite: (movieId) => {
      try {
        const userFavoritesKey = getUserKey(STORAGE_KEYS.FAVORITE_MOVIES);
        const favorites = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
        return favorites.some(movie => movie.id === movieId);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
      }
    },
  
    clear: () => {
      try {
        const userFavoritesKey = getUserKey(STORAGE_KEYS.FAVORITE_MOVIES);
        localStorage.removeItem(userFavoritesKey);
      } catch (error) {
        console.error('Error clearing favorites:', error);
      }
    }
  };
  
  // 사용자 설정 관리
  export const userPreferences = {
    save: (preferences) => {
      try {
        const validatedPreferences = validateData(preferences);
        if (!validatedPreferences) throw new Error('Invalid preferences data');
        
        const userPreferencesKey = getUserKey(STORAGE_KEYS.USER_PREFERENCES);
        localStorage.setItem(userPreferencesKey, JSON.stringify(validatedPreferences));
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    },
    
    get: () => {
      try {
        const userPreferencesKey = getUserKey(STORAGE_KEYS.USER_PREFERENCES);
        return JSON.parse(localStorage.getItem(userPreferencesKey) || '{}');
      } catch (error) {
        console.error('Error getting preferences:', error);
        return {};
      }
    },
  
    clear: () => {
      try {
        const userPreferencesKey = getUserKey(STORAGE_KEYS.USER_PREFERENCES);
        localStorage.removeItem(userPreferencesKey);
      } catch (error) {
        console.error('Error clearing preferences:', error);
      }
    }
  };
  
  // 사용자 데이터 전체 관리
  export const userStorage = {
    initUser: (email) => {
      try {
        if (!email || typeof email !== 'string') throw new Error('Invalid email');
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    },
  
    clearUserData: () => {
      try {
        const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (currentUser) {
          searchHistory.clear();
          favoriteMovies.clear();
          userPreferences.clear();
          Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
          });
        }
      } catch (error) {
        console.error('Error clearing user data:', error);
      }
    }
  };
  
  // Local Storage 상태 확인
  export const checkLocalStorageStatus = () => {
    try {
      const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const requiredKeys = [
        STORAGE_KEYS.IS_LOGGED_IN,
        STORAGE_KEYS.TMDB_KEY,
        getUserKey(STORAGE_KEYS.FAVORITE_MOVIES),
        getUserKey(STORAGE_KEYS.RECENT_SEARCHES),
        getUserKey(STORAGE_KEYS.USER_PREFERENCES)
      ];
      
      const status = requiredKeys.map(key => ({
        key,
        exists: localStorage.getItem(key) !== null
      }));
      
      return {
        isComplete: status.filter(s => s.exists).length >= 3,
        status,
        currentUser
      };
    } catch (error) {
      console.error('Error checking storage status:', error);
      return {
        isComplete: false,
        status: [],
        currentUser: null
      };
    }
  };