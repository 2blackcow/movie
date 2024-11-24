import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import MobileNavigation from './components/MobileNavigation';
import { useEffect } from 'react';
import { setBannerDtata, setImageURL } from './store/movieSlice';
import { useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import { ENDPOINTS } from './config/api.config';

function App() {
  const dispatch = useDispatch();
  const { data: trendingData } = useFetch(ENDPOINTS.NOW_PLAYING);
  const { data: configData } = useFetch(ENDPOINTS.CONFIGURATION);

  useEffect(() => {
    if (trendingData.length > 0) {
      dispatch(setBannerDtata(trendingData));
    }
  }, [trendingData, dispatch]);

  useEffect(() => {
    if (configData?.images?.secure_base_url) {
      dispatch(setImageURL(configData.images.secure_base_url + "original"));
    }
  }, [configData, dispatch]);

  return (
    <main className='pb-14 lg:pb-0'>
      <Header/>
      <div className="">
        <Outlet/>
      </div>
      <MobileNavigation/>
    </main>
  );
}

export default App;