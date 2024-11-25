import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { useEffect } from 'react';
import { setBannerData, setImageURL } from './store/movieSlice';
import { useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import { ENDPOINTS } from './constants/api.config';

function App() {
  const dispatch = useDispatch();
  const { data: trendingData } = useFetch(ENDPOINTS.NOW_PLAYING);
  const { data: configData } = useFetch(ENDPOINTS.CONFIGURATION);

  useEffect(() => {
    if (trendingData.length > 0) {
      dispatch(setBannerData(trendingData));
    }
  }, [trendingData, dispatch]);

  useEffect(() => {
    if (configData?.images?.secure_base_url) {
      dispatch(setImageURL(configData.images.secure_base_url + "original"));
    }
  }, [configData, dispatch]);

  return (
    <main>
      <Header/>
      <div>
        <Outlet/>
      </div>
    </main>
  );
}

export default App;