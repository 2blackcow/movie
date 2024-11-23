import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowUp } from 'react-icons/md';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 버튼 표시 여부 결정
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 페이지 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <MdKeyboardArrowUp size={24} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;