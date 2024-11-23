import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdStar, MdArrowBack } from 'react-icons/md';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: process.env.REACT_APP_API_KEY,
            language: 'ko-KR',
          }
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('영화 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        영화 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={handleBack}
        className="fixed top-24 left-4 z-50 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full transition-colors duration-300"
      >
        <MdArrowBack size={24} />
      </button>

      <div className="container mx-auto">
        {/* 배경 이미지 */}
        {movie.backdrop_path && (
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-black/70"></div>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt="배경"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* 포스터 */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/placeholder-image.jpg'
                }
                alt={movie.title}
                className="w-full"
              />
            </div>
          </div>

          {/* 영화 정보 */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-4xl font-bold mb-4">
              {movie.title}
              <span className="text-xl text-gray-400 ml-2">
                ({movie.release_date?.slice(0, 4)})
              </span>
            </h1>

            {/* 평점 */}
            <div className="flex items-center gap-2 mb-6">
              <MdStar className="text-yellow-500" size={24} />
              <span className="text-xl">
                {movie.vote_average?.toFixed(1)}
              </span>
              <span className="text-gray-400 text-sm">
                ({movie.vote_count?.toLocaleString()} 평가)
              </span>
            </div>

            {/* 장르 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(genre => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 bg-red-500 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* 개요 */}
            <div>
              <h2 className="text-2xl font-bold mb-2">개요</h2>
              <p className="text-lg leading-relaxed text-gray-200">
                {movie.overview || '등록된 개요가 없습니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;