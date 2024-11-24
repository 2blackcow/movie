import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder, MdInfo } from 'react-icons/md';
import { toggleMyList } from '../store/movieSlice';
import { createImageUrl } from '../constants/api.config';

const Card = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const myList = useSelector((state) => state.movieData.myList);
  const isInMyList = myList.some(movie => movie.id === data.id);

  const formatRating = (rating) => {
    if (!rating || rating === 0 || isNaN(rating)) {
      return "평점 없음";
    }
    return `★ ${rating.toFixed(1)}`;
  };

  const handleToggleMyList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleMyList(data));
  };

  const handleCardClick = () => {
    navigate(`/movie/${data.id}`);
  };

  const imageUrl = !imageError && data.poster_path 
    ? createImageUrl(data.poster_path, 'w500')
    : '/placeholder-image.jpg';

  return (
    <div className="relative group cursor-pointer" onClick={handleCardClick}>
      <div className="overflow-hidden rounded-lg aspect-[2/3] relative">
        <img
          src={imageUrl}
          alt={data.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            setImageError(true);
            e.target.src = '/placeholder-image.jpg';
          }}
          loading="lazy"
        />
        
        {/* Info Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg line-clamp-2">
            {data.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-white flex items-center gap-1 ${
              !data.vote_average || data.vote_average === 0 ? 'text-gray-400' : 'text-yellow-400'
            }`}>
              {formatRating(data.vote_average)}
            </span>
            {data.release_date && (
              <span className="text-white/80">
                {new Date(data.release_date).getFullYear()}
              </span>
            )}
          </div>
          {data.overview && (
            <p className="text-white/80 text-sm line-clamp-3 mt-2">
              {data.overview}
            </p>
          )}

          {/* 상세보기 버튼 */}
          <button 
            className="mt-3 w-full bg-red-500 text-white py-1 rounded-full 
                      opacity-0 group-hover:opacity-100 transition-opacity 
                      hover:bg-red-600 flex items-center justify-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${data.id}`);
            }}
          >
            <MdInfo size={16} />
            상세정보
          </button>
        </div>
      </div>

      {/* 찜하기 버튼 */}
      <button
        onClick={handleToggleMyList}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full 
                  text-white hover:bg-red-500 transition-all z-10 
                  opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        {isInMyList ? (
          <MdFavorite className="text-red-500" size={24} />
        ) : (
          <MdFavoriteBorder size={24} />
        )}
      </button>

      {/* 모바일용 오버레이 (터치 디바이스) */}
      <div className="md:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <h3 className="text-white font-bold text-sm line-clamp-1">
          {data.title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className={`text-white ${
            !data.vote_average || data.vote_average === 0 ? 'text-gray-400' : 'text-yellow-400'
          }`}>
            {formatRating(data.vote_average)}
          </span>
          {data.release_date && (
            <span className="text-white/80">
              {new Date(data.release_date).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;