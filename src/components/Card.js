import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { toggleMyList } from '../store/movieSlice';

const Card = ({ data }) => {
  const dispatch = useDispatch();
  const myList = useSelector((state) => state.movieData.myList);
  const isInMyList = myList.some(movie => movie.id === data.id);

  // TMDB 이미지 기본 URL
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
  
  const handleToggleMyList = (e) => {
    e.preventDefault(); // Link 이벤트 방지
    dispatch(toggleMyList(data));
  };

  return (
    <div className="relative group">
      <Link to={`/movie/${data.id}`} className="block">
        <div className="overflow-hidden rounded-lg aspect-[2/3] relative">
          {/* 이미지 */}
          <img
            src={data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : '/placeholder-image.jpg'}
            alt={data.title || data.name}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          
          {/* 오버레이 정보 */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg">
              {data.title || data.name}
            </h3>
            <p className="text-white/80 text-sm line-clamp-3 mt-2">
              {data.overview}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-white/90">
                ★ {(data.vote_average || 0).toFixed(1)}
              </span>
              <span className="text-white/90">
                {new Date(data.release_date).getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* 찜하기 버튼 */}
      <button
        onClick={handleToggleMyList}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors z-10"
      >
        {isInMyList ? (
          <MdFavorite className="text-red-500" size={24} />
        ) : (
          <MdFavoriteBorder size={24} />
        )}
      </button>
    </div>
  );
};

export default Card;