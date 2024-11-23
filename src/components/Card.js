import React from 'react';
import { Link } from 'react-router-dom';
import { API_CONFIG } from '../config/api.config';

const Card = ({ data }) => {
  const imageUrl = data.poster_path 
    ? `${API_CONFIG.IMAGE_BASE_URL}w500${data.poster_path}`
    : '/placeholder-image.jpg';

  return (
    <Link to={`/movie/${data.id}`} className="block">
      <div className="relative group cursor-pointer">
        <div className="aspect-[2/3] overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={data.title || data.name}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white font-bold truncate">
            {data.title || data.name}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>★ {data.vote_average.toFixed(1)}</span>
            <span>•</span>
            <span>{new Date(data.release_date).getFullYear()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;