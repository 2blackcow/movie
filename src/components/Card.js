import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ data }) => {
  // TMDB 이미지 기본 URL
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
  
  // 포스터 이미지 URL 생성
  const imageUrl = data?.poster_path 
    ? `${IMAGE_BASE_URL}${data.poster_path}`
    : '/placeholder-image.jpg'; // 대체 이미지 경로

  // 개봉일 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  // 평점 포맷팅 (소수점 한 자리까지)
  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  return (
    <Link 
      to={`/movie/${data.id}`} 
      className="block group"
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* 이미지 컨테이너 */}
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={data.title || data.name}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null; // 무한 로드 방지
              e.target.src = '/placeholder-image.jpg'; // 에러 시 대체 이미지
            }}
          />
        </div>

        {/* 영화 정보 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
          <h3 className="text-white font-bold truncate">
            {data.title || data.name}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span className="flex items-center">
              ★ {formatRating(data.vote_average)}
            </span>
            {data.release_date && (
              <>
                <span>•</span>
                <span>{formatDate(data.release_date)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;