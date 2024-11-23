import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

const Banner = () => {
  const bannerData = useSelector((state) => state.movieData.bannerData);
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const [currentIndex, setCurrentIndex] = useState(1); // 시작 인덱스를 1로 설정
  const [isAnimating, setIsAnimating] = useState(false);

  // 무한 슬라이드를 위해 앞뒤로 슬라이드 추가
  const extendedBannerData = [
    bannerData[bannerData.length - 1], // 마지막 슬라이드를 맨 앞에 추가
    ...bannerData,
    bannerData[0], // 첫 번째 슬라이드를 맨 뒤에 추가
  ];

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
    if (!isAnimating) {
      if (currentIndex === 0) { // 처음으로 갔을 때
        const timer = setTimeout(() => {
          setCurrentIndex(bannerData.length);
        }, 300);
        return () => clearTimeout(timer);
      }
      if (currentIndex === bannerData.length + 1) { // 마지막으로 갔을 때
        const timer = setTimeout(() => {
          setCurrentIndex(1);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, isAnimating]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev - 1);
  };

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full h-full relative overflow-hidden">
      <div className="flex min-h-full max-h-[95vh]">
        {extendedBannerData.map((data, index) => (
          <div
            key={`${data.id}-${index}`}
            className="min-w-full min-h-[450px] lg:min-h-full relative group"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isAnimating ? "transform 300ms ease-in-out" : "none"
            }}
          >
            <div className="w-full h-full">
              <img
                src={imageURL + data.backdrop_path}
                alt={data.title || data.name}
                className="h-full w-full object-cover"
              />
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
                  {data.title || data.name}
                </h2>
                <p className="text-ellipsis line-clamp-4 my-2">{data.overview}</p>

                <div className="flex items-center gap-4">
                  <p>평점 : {Number(data.vote_average).toFixed(1)} ⭐</p>
                </div>
                <button className="bg-transparent bg-red-600 px-4 py-2 text-white font-bold rounded mt-4 hover:bg-gradient-to-bl transition-all hover:scale-105">
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 인디케이터 */}
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