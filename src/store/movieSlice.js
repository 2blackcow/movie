import { createSlice } from '@reduxjs/toolkit';
import { favoriteMovies } from '../utils/localStorage';

// 사용자별 찜 목록 로드 함수
const loadMyList = () => {
  try {
    const savedList = favoriteMovies.get();
    return savedList || [];
  } catch {
    return [];
  }
};

const initialState = {
  bannerData: [],
  imageURL: '',
  myList: loadMyList(),
};

const movieSlice = createSlice({
  name: 'movieData',
  initialState,
  reducers: {
    setBannerData: (state, action) => {
      state.bannerData = action.payload;
    },
    
    setImageURL: (state, action) => {
      state.imageURL = action.payload;
    },
    
    toggleMyList: (state, action) => {
      const movieIndex = state.myList.findIndex(movie => movie.id === action.payload.id);
      if (movieIndex === -1) {
        // 찜하기
        state.myList.push(action.payload);
        favoriteMovies.add(action.payload);
      } else {
        // 찜하기 취소
        state.myList.splice(movieIndex, 1);
        favoriteMovies.remove(action.payload.id);
      }
    },
    
    clearMyList: (state) => {
      state.myList = [];
      favoriteMovies.clear();
    },

    // 로그인 시 해당 사용자의 찜 목록 로드
    loadUserList: (state) => {
      state.myList = loadMyList();
    }
  }
});

export const {
  setBannerData,
  setImageURL,
  toggleMyList,
  clearMyList,
  loadUserList
} = movieSlice.actions;

export default movieSlice.reducer;