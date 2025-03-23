import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const NotebookDetail = ({ isOpen, onClose, notebook }) => {
  // 애니메이션 상태
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // 패널이 닫혀있고 애니메이션 중이 아니면 렌더링하지 않음
  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed top-0 right-0 w-1/2 h-full shadow-2xl transition-all duration-500 ease-out transform z-20 font-pretendard ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onTransitionEnd={() => {
        if (!isOpen) setIsAnimating(false);
      }}
      style={{
        background: '#f9fafb', // Light gray base background
      }}
    >
      {/* 격자무늬 배경을 가진 스크롤 가능한 메인 컨테이너 */}
      <div
        className="h-full w-full overflow-y-auto"
        style={{
          backgroundImage: `
            linear-gradient(#e6e6e6 1px, transparent 1px),
            linear-gradient(90deg, #e6e6e6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '-0.5px -0.5px',
        }}
      >
        {/* 왼쪽 여백과 제본 구멍 - 고정 위치 */}
        <div
          className="fixed top-0 left-0 w-12 h-full bg-gray-100 border-r border-gray-200"
          style={{
            zIndex: 30, // Above the grid but below content
          }}
        >
          {/* 종이 제본 구멍 */}
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="absolute left-4 w-4 h-4 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ top: `${40 + index * 50}px` }}
            >
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          ))}
        </div>

        {/* 전체 높이까지 확장되는 세로선 */}
        <div
          className="absolute left-16 top-0 h-full w-px bg-gray-300"
          style={{ minHeight: '100%' }}
        ></div>

        {/* 콘텐츠 컨테이너 */}
        <div className="relative z-40 p-8 pl-20 min-h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-700">요약본</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="mb-6 pb-3 border-b border-gray-300">
            <h3 className="text-xl font-medium text-gray-800">
              {notebook.title || '제목 없음'}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {notebook.createdAt
                ? new Date(notebook.createdAt).toLocaleDateString()
                : '날짜 없음'}
            </p>
          </div>

          {/* 콘텐츠 표시 영역 - 문단 나누기 적용 */}
          <div className="space-y-6 pb-8">
            {notebook.content ? (
              notebook.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-gray-600 italic">내용이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookDetail;
