import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    // 모달이 열릴 때 body 스크롤 방지
    document.body.style.overflow = 'hidden';
    
    // 모달이 닫힐 때 body 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative z-10 p-4 w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-red-500 text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;