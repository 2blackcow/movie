import React, { useRef, useEffect } from "react";
import Card from "./Card";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import LoadingSpinner from "./LoadingSpinner";

const HorizontalScrollCard = ({ data = [], heading, loading = false }) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event) => {
      const containerScrollPosition = container.scrollLeft;
      const containerScrollWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      
      const isScrollEnd = 
        (containerScrollPosition === 0 && event.deltaY < 0) || 
        (containerScrollPosition + containerWidth >= containerScrollWidth && event.deltaY > 0);
      
      if (!isScrollEnd) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    const scrollAmount = 300;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!data?.length && !loading) return null;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{heading}</h2>
      
      {loading ? (
        <div className="relative h-[300px] bg-neutral-800/50 rounded-lg">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="relative group">
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
              <div key={item.id} className="flex-none w-[200px]">
                <Card data={item} />
              </div>
            ))}
          </div>

          {data.length > 0 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <GoTriangleLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <GoTriangleRight size={20} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollCard;