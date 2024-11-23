import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

const Banner = () => {
  const bannerData = useSelector((state) => state.movieData.bannerData) || [];
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // 무한 슬라이드를 위해 앞뒤로 슬라이드 추가
  const extendedBannerData = bannerData.length > 0 ? [
    bannerData[bannerData.length - 1],
    ...bannerData,
    bannerData[0],
  ] : [];

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // 슬라이드 위치 재조정
  useEffect(() => {
    if (!isAnimating && bannerData.length > 0) {
      if (currentIndex === 0) {
        const timer = setTimeout(() => {
          setCurrentIndex(bannerData.length);
        }, 300);
        return () => clearTimeout(timer);
      }
      if (currentIndex === bannerData.length + 1) {
        const timer = setTimeout(() => {
          setCurrentIndex(1);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, isAnimating, bannerData.length]);

  // 자동 슬라이드
  useEffect(() => {
    if (bannerData.length > 0) {
      const interval = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true);
          setCurrentIndex(prev => prev + 1);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerData.length, isAnimating]);

  const handleNext = () => {
    if (isAnimating || !bannerData.length) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (isAnimating || !bannerData.length) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev - 1);
  };

  // 데이터가 없을 때의 로딩 상태
  if (!bannerData.length) {
    return <div className="w-full h-[450px] bg-neutral-900 animate-pulse" />;
  }

  return (
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
                  src={imageURL + data.backdrop_path}
                  alt={data?.title || data?.name || "Movie Banner"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900" />
              )}
            </div>

            {/* 이전/다음 버튼 */}
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
                <p className="text-ellipsis line-clamp-4 my-2">
                  {data?.overview || ""}
                </p>

                <div className="flex items-center gap-4">
                  <p>평점 : {Number(data?.vote_average || 0).toFixed(1)} ⭐</p>
                </div>
                <button className="bg-transparent bg-red-600 px-4 py-2 text-white font-bold rounded mt-4 hover:bg-gradient-to-bl transition-all hover:scale-105">
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {bannerData.map((_, index) => (
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
  );
};

export default Banner;