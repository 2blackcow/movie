import { createSlice } from '@reduxjs/toolkit';

// 사용자별 찜 목록 로드 함수
const loadMyList = () => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const key = `${currentUser}_myList`;
      const savedList = localStorage.getItem(key);
      return savedList ? JSON.parse(savedList) : [];
    }
    return [];
  } catch {
    return [];
  }
};

const initialState = {
  bannerData: [],
  imageURL: '',
  myList: loadMyList(), // 현재 로그인한 사용자의 찜 목록 불러오기
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
      } else {
        // 찜하기 취소
        state.myList.splice(movieIndex, 1);
      }
      
      // 현재 사용자의 로컬 스토리지에 저장
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const key = `${currentUser}_myList`;
        localStorage.setItem(key, JSON.stringify(state.myList));
      }
    },
    
    clearMyList: (state) => {
      state.myList = [];
      // 현재 사용자의 찜 목록만 삭제
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const key = `${currentUser}_myList`;
        localStorage.removeItem(key);
      }
    },

    // 로그인 시 해당 사용자의 찜 목록 로드
    loadUserList: (state, action) => {
      const email = action.payload; // 로그인한 사용자의 이메일
      if (email) {
        const key = `${email}_myList`;
        const savedList = localStorage.getItem(key);
        state.myList = savedList ? JSON.parse(savedList) : [];
      }
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