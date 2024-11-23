import { createSlice } from '@reduxjs/toolkit';

const loadMyList = () => {
  try {
    const savedList = localStorage.getItem('myList');
    return savedList ? JSON.parse(savedList) : [];
  } catch {
    return [];
  }
};

const initialState = {
  bannerData: [],
  imageURL: '',
  myList: loadMyList(), // 로컬 스토리지에서 찜한 목록 불러오기
};

const movieSlice = createSlice({
  name: 'movieData',
  initialState,
  reducers: {
    setBannerDtata: (state, action) => {
      state.bannerData = action.payload;
    },
    setImageURL: (state, action) => {
      state.imageURL = action.payload;
    },
    toggleMyList: (state, action) => {
      const movieIndex = state.myList.findIndex(movie => movie.id === action.payload.id);
      if (movieIndex === -1) {
        state.myList.push(action.payload);
      } else {
        state.myList.splice(movieIndex, 1);
      }
      // 로컬 스토리지에 저장
      localStorage.setItem('myList', JSON.stringify(state.myList));
    },
    clearMyList: (state) => {
      state.myList = [];
      localStorage.removeItem('myList');
    }
  }
});

export const { 
  setBannerDtata, 
  setImageURL, 
  toggleMyList, 
  clearMyList 
} = movieSlice.actions;

export default movieSlice.reducer;