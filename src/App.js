import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import { useEffect } from 'react';
import axios from 'axios';
import { setBannerDtata, setImageURL } from './store/movieSlice';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch()
  const fetchTrendingData = async()=>{
    try{
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`)

        dispatch(setBannerDtata(response.data.results))
  
    } catch(error){
      console.log("error", error)
    }
  }

  const fetchConfiguration = async()=>{
    try{
      const response = await axios.get(`https://api.themoviedb.org/3/configuration?api_key=${process.env.REACT_APP_API_KEY}`)
      dispatch(setImageURL( response.data.images.secure_base_url + "original"))

    } catch (error){

    }
  }

  useEffect(()=>{
    fetchTrendingData()
    fetchConfiguration()
  },[])

  return (
    <main className='pb-14 lg:pb-0'>
      <Header/>
      <div className="">
        <Outlet/>
      </div>
      <Footer/>
      <MobileNavigation/>
    </main>
  );
}

export default App;
