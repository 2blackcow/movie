import React, { useRef, useState, useEffect } from "react";
import Card from "./Card";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

const HorizontalScrollCard = ({ data = [], heading }) => {
  const containerRef = useRef();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event) => {
      // 마우스가 영역 안에 있을 때만 스크롤 처리
      if (!isHovering) return;

      // 무조건 기본 스크롤 동작을 막음
      event.preventDefault();

      // 가로 스크롤이 가능한 상태인지 확인
      const canScrollLeft = container.scrollLeft > 0;
      const canScrollRight = 
        container.scrollLeft < container.scrollWidth - container.clientWidth;

      // deltaMode가 0이면 픽셀 단위, 1이면 라인 단위
      const scrollMultiplier = event.deltaMode === 1 ? 40 : 1;
      const scrollAmount = event.deltaY * scrollMultiplier;

      // 스크롤 방향에 따라 조건 체크하여 스크롤
      if ((scrollAmount > 0 && canScrollRight) || (scrollAmount < 0 && canScrollLeft)) {
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    // 이벤트 리스너 등록 시 { passive: false } 옵션 추가
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isHovering]); // isHovering이 변경될 때마다 이벤트 리스너 재설정

  const handleNext = () => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollBy({
      left: container.clientWidth / 2,
      behavior: 'smooth'
    });
  };

  const handlePrevious = () => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollBy({
      left: -(container.clientWidth / 2),
      behavior: 'smooth'
    });
  };

  if (!Array.isArray(data)) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>

      <div 
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-4 pb-4 relative scroll-smooth transition-all scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Render cards */}
          {data.map((item) => (
            <div 
              key={item.id} 
              className="flex-none w-[200px]"
            >
              <Card data={item} />
            </div>
          ))}
        </div>

        {/* Navigation buttons - 스크롤 가능할 때만 표시 */}
        {data.length > 0 && (
          <div className="absolute top-0 flex justify-between w-full h-full items-center pointer-events-none">
            <button
              onClick={handlePrevious}
              className="bg-white/90 p-2 text-red-500 rounded-full -ml-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto hover:bg-white"
            >
              <GoTriangleLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="bg-white/90 p-2 text-red-500 rounded-full -mr-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto hover:bg-white"
            >
              <GoTriangleRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalScrollCard;