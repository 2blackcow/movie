import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../components/Card';

const MyList = () => {
  const myList = useSelector((state) => state.movieData.myList);

  if (myList.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">내가 찜한 콘텐츠♥️</h1>
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-xl text-gray-400">찜한 콘텐츠가 없습니다</p>
            <p className="text-gray-500">
              관심있는 콘텐츠를 찜하여 나만의 리스트를 만들어보세요!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">내가 찜한 콘텐츠♥️ </h1>
          <span className="text-gray-400">
            총 {myList.length}개의 콘텐츠
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {myList.map((movie) => (
            <Card key={movie.id} data={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyList;