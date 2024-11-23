import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import axios from "axios";
import Modal from "./Modal"; // 새로 만들 Modal 컴포넌트

const Banner = () => {
  const bannerData = useSelector((state) => state.movieData.bannerData) || [];
  const [filteredBannerData, setFilteredBannerData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(false);

  // 설명이 있는 영화만 필터링
  useEffect(() => {
    const filtered = bannerData.filter(movie => 
      movie.overview && movie.overview.trim() !== ""
    );
    setFilteredBannerData(filtered);
    setCurrentIndex(1); // 필터링 후 인덱스 리셋
  }, [bannerData]);

  // 무한 슬라이드를 위해 앞뒤로 슬라이드 추가
  const extendedBannerData = filteredBannerData.length > 0 ? [
    filteredBannerData[filteredBannerData.length - 1],
    ...filteredBannerData,
    filteredBannerData[0],
  ] : [];

  // 예고편 가져오기
  const fetchTrailer = async (movieId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
      );
      
      // 예고편 찾기 (한국어 우선, 없으면 영어)
      let trailer = response.data.results.find(
        video => video.type === "Trailer" && video.site === "YouTube" && video.iso_639_1 === "ko"
      );
      
      if (!trailer) {
        trailer = response.data.results.find(
          video => video.type === "Trailer" && video.site === "YouTube"
        );
      }
      
      setTrailer(trailer);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("예고편을 불러올 수 없습니다.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating && filteredBannerData.length > 0) {
      if (currentIndex === 0) {
        const timer = setTimeout(() => {
          setCurrentIndex(filteredBannerData.length);
        }, 300);
        return () => clearTimeout(timer);
      }
      if (currentIndex === filteredBannerData.length + 1) {
        const timer = setTimeout(() => {
          setCurrentIndex(1);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, isAnimating, filteredBannerData.length]);

  useEffect(() => {
    if (filteredBannerData.length > 0) {
      const interval = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true);
          setCurrentIndex(prev => prev + 1);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [filteredBannerData.length, isAnimating]);

  const handleNext = () => {
    if (isAnimating || !filteredBannerData.length) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (isAnimating || !filteredBannerData.length) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev - 1);
  };

  if (!filteredBannerData.length) {
    return <div className="w-full h-[450px] bg-neutral-900 animate-pulse" />;
  }

  return (
    <>
      <section className="w-full h-full relative overflow-hidden">
        <div className="flex min-h-full max-h-[95vh]">
          {extendedBannerData.map((data, index) => (
            <div
              key={`${data?.id || index}-${index}`}
              className="min-w-full min-h-[450px] lg:min-h-full relative group"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isAnimating ? "transform 300ms ease-in-out" : "none"
              }}
            >
              <div className="w-full h-full">
                {data?.backdrop_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                    alt={data?.title || data?.name || "Movie Banner"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900" />
                )}
              </div>

              <div className="absolute top-0 w-full h-full hidden items-center justify-between px-3 group-hover:flex">
                <button
                  onClick={handlePrevious}
                  disabled={isAnimating}
                  className="hover:bg-white p-2 rounded-full text-3xl z-10 text-red-500 transition-all duration-200 hover:scale-110"
                >
                  <GoTriangleLeft />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="hover:bg-white p-2 rounded-full text-3xl z-10 text-red-500 transition-all duration-200 hover:scale-110"
                >
                  <GoTriangleRight />
                </button>
              </div>

              <div className="absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent"></div>

              <div className="container mx-auto">
                <div className="container mx-auto absolute bottom-0 max-w-md px-4">
                  <h2 className="font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl">
                    {data?.title || data?.name || "Loading..."}
                  </h2>
                  <p className="text-ellipsis line-clamp-4 my-2 text-white">
                    {data?.overview || ""}
                  </p>

                  <div className="flex items-center gap-4 text-white">
                    <p>평점 : {Number(data?.vote_average || 0).toFixed(1)} ⭐</p>
                  </div>
                  <button 
                    onClick={() => fetchTrailer(data?.id)}
                    disabled={loading}
                    className={`bg-red-700 px-6 py-3 text-white font-bold rounded mt-4 
                      hover:bg-red-800 transition-all hover:scale-105 flex items-center gap-2
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? '로딩 중...' : (
                      <>
                        <span>▶</span> 예고편 보기
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {filteredBannerData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index + 1);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index + 1 ? "bg-red-500 w-4" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 예고편 모달 */}
      {showModal && trailer && (
        <Modal onClose={() => {
          setShowModal(false);
          setTrailer(null);
        }}>
          <div className="aspect-video w-full max-w-4xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default Banner;