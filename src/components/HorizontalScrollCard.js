import React, { useRef, useEffect } from "react";
import Card from "./Card";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

const HorizontalScrollCard = ({ data = [], heading }) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event) => {
      const containerScrollPosition = container.scrollLeft;
      const containerScrollWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      
      // 스크롤이 끝에 도달했는지 확인
      const isScrollEnd = 
        (containerScrollPosition === 0 && event.deltaY < 0) || 
        (containerScrollPosition + containerWidth >= containerScrollWidth && event.deltaY > 0);
      
      // 스크롤이 끝에 도달하지 않았다면 세로 스크롤을 방지
      if (!isScrollEnd) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
      }
    };

    // passive: false로 이벤트 리스너 추가
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    const scrollAmount = 300;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // 데이터가 없거나 로딩 중일 때 처리
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{heading}</h2>
      
      <div className="relative group">
        {/* 스크롤 가능한 컨테이너 */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {data.map((item) => (
            <div 
              key={item.id} 
              className="flex-none w-[200px]"
            >
              <Card data={item} />
            </div>
          ))}
        </div>

        {/* 스크롤 버튼 */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GoTriangleLeft size={20} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GoTriangleRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalScrollCard;