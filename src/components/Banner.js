import React, { useState, useEffect } from "react";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import Modal from "./Modal";
import { fetchFromApi, createImageUrl, ENDPOINTS } from "../constants/api.config";
import LoadingSpinner from "./LoadingSpinner";

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);
  const [filteredBannerData, setFilteredBannerData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Banner 데이터 가져오기
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const data = await fetchFromApi(ENDPOINTS.TRENDING);
        setBannerData(data.results || []);
      } catch (error) {
        setError(error.message);
        console.error('Banner data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  // 설명이 있는 영화만 필터링
  useEffect(() => {
    const filtered = bannerData.filter(movie => 
      movie.overview && movie.overview.trim() !== ""
    );
    setFilteredBannerData(filtered);
    setCurrentIndex(1);
  }, [bannerData]);

  // 예고편 가져오기
  const fetchTrailer = async (movieId) => {
    setLoading(true);
    try {
      const data = await fetchFromApi(`/movie/${movieId}/videos`);
      
      // 예고편 찾기 (한국어 우선, 없으면 영어)
      let trailer = data.results.find(
        video => video.type === "Trailer" && video.site === "YouTube" && video.iso_639_1 === "ko"
      );
      
      if (!trailer) {
        trailer = data.results.find(
          video => video.type === "Trailer" && video.site === "YouTube"
        );
      }
      
      if (!trailer) {
        throw new Error('예고편을 찾을 수 없습니다.');
      }
      
      setTrailer(trailer);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("예고편을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 무한 슬라이드를 위한 데이터 확장
  const extendedBannerData = filteredBannerData.length > 0 ? [
    filteredBannerData[filteredBannerData.length - 1],
    ...filteredBannerData,
    filteredBannerData[0],
  ] : [];

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

  // 자동 슬라이드
  useEffect(() => {
    if (filteredBannerData.length > 0) {
      const interval = setInterval(() => {
        if (!isAnimating && !showModal) { // 모달이 열려있지 않을 때만 자동 슬라이드
          setIsAnimating(true);
          setCurrentIndex(prev => prev + 1);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [filteredBannerData.length, isAnimating, showModal]);

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

  if (loading) {
    return <div className="w-full h-[450px] bg-neutral-900 flex items-center justify-center">
      <LoadingSpinner />
    </div>;
  }

  if (error) {
    return <div className="w-full h-[450px] bg-neutral-900 flex items-center justify-center text-white">
      오류가 발생했습니다: {error}
    </div>;
  }

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
                    src={createImageUrl(data.backdrop_path, 'original')}
                    alt={data?.title || "Movie Banner"}
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

              <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0">
                <div className="max-w-2xl mb-8">
                  <h2 className="font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl mb-2">
                    {data?.title || data?.name || "Loading..."}
                  </h2>
                  <p className="text-ellipsis line-clamp-4 text-white text-sm lg:text-base">
                    {data?.overview || ""}
                  </p>

                  <div className="flex items-center gap-4 text-white mt-2">
                    <p className="text-sm lg:text-base">
                      평점: {Number(data?.vote_average || 0).toFixed(1)} ⭐
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => fetchTrailer(data?.id)}
                    disabled={loading}
                    className={`bg-red-700 px-4 py-2 text-white font-bold rounded mt-4 
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