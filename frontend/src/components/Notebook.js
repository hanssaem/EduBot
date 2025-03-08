import React from 'react';

const Notebook = ({ date, topic, onClick }) => {
  return (
    <div
      className="relative w-52 h-64 bg-yellow-300 rounded-2xl shadow-md transition-transform duration-300 ease-in-out hover:translate-y-[-10px] hover:shadow-xl"
      onClick={() => onClick({ date, topic })}
    >
      {/* 왼쪽 파란색 접힌 부분 */}
      <div className="absolute top-0 left-0 w-8 h-full bg-blue-400 rounded-l-2xl"></div>

      {/* 스프링 표현 */}
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="absolute left-1 w-5 h-4 bg-blue-500 rounded-full"
          style={{ top: `${40 + i * 50}px` }}
        ></div>
      ))}

      {/* 오른쪽 인덱스 태그 */}
      {['bg-red-300', 'bg-yellow-200', 'bg-green-300'].map((color, i) => (
        <div
          key={i}
          className={`absolute right-[-15px] w-4 h-8 ${color} rounded-r-md`}
          style={{ top: `${30 + i * 60}px` }}
        ></div>
      ))}

      {/* 공책 본체 */}
      <div className="flex flex-col items-center justify-center h-full ml-8">
        <div className="relative bg-yellow-100 w-36 min-h-24 p-4 rounded-md flex flex-col items-center justify-center shadow group">
          <h2 className="text-lg font-bold text-gray-700 text-center line-clamp-2 text-ellipsis">
            {topic}
          </h2>
          <div className="text-sm mt-2 text-gray-600">
            <p>{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebook;
