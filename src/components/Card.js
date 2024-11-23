import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { toggleMyList } from '../store/movieSlice';

const Card = ({ data }) => {
  const dispatch = useDispatch();
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
    dispatch(toggleMyList(data));
  };

  return (
    <div className="relative group">
      <Link to={`/movie/${data.id}`} className="block">
        <div className="overflow-hidden rounded-lg aspect-[2/3] relative">
          <img
            src={data.poster_path 
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : '/placeholder-image.jpg'
            }
            alt={data.title}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
            loading="lazy"
          />
          
          {/* Info Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg">
              {data.title}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-white ${!data.vote_average || data.vote_average === 0 ? 'text-gray-400' : ''}`}>
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
          </div>
        </div>
      </Link>

      {/* 찜하기 버튼 */}
      <button
        onClick={handleToggleMyList}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors z-10 opacity-0 group-hover:opacity-100"
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