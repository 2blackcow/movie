import React, { useRef } from "react";
import Card from "./Card";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

const HorizontalScrollCard = ({ data = [], heading }) => {
  const containerRef = useRef();

  const handleWheel = (event) => {
    if (!containerRef.current || !event) return;
    
    event.preventDefault();
    containerRef.current.scrollLeft += event.deltaY;
  };

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
          onWheel={handleWheel}
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