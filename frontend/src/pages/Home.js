import { SiProbot } from 'react-icons/si';
import Notebook from '../components/Notebook';
import NotebookDetail from '../components/NotebookDetail';
import { BookOpenIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const notebooks = [
    { date: '2025-03-07', topic: '리액트 기본', category: 'art' },
    { date: '2025-03-06', topic: 'State Management', category: 'language' },
    { date: '2025-03-05', topic: 'Tailwind Styling', category: 'history' },
    { date: '2025-03-04', topic: 'API Integration', category: 'programming' },
    {
      date: '2025-03-04',
      topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ',
      category: 'science',
    },
    {
      date: '2025-03-04',
      topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ',
      category: 'math',
    },
    {
      date: '2025-03-04',
      topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ',
      category: 'social',
    },
    {
      date: '2025-03-04',
      topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ',
      category: 'math',
    },
    {
      date: '2025-03-04',
      topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ',
      category: 'math',
    },
    {
      date: '2025-03-04',
      topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ',
      category: 'math',
    },
  ];

  const handleNotebookClick = (notebook) => {
    setSelectedNotebook(notebook);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white items-center">
      <nav className="w-full p-5 bg-[#1B3764] text-white flex items-center justify-between">
        {/* 로고를 가운데 정렬 */}
        <button
          className="font-bold text-3xl flex-1 text-center ml-[62px] flex justify-center items-center"
          onClick={() => navigate('/')}
        >
          EduBot
          <SiProbot className="ml-2 text-3xl inline-block" />
        </button>

        {/* 로그인 버튼을 오른쪽으로 배치 */}
        <button className="pr-5" onClick={() => navigate('/login')}>
          로그인
        </button>
      </nav>

      <div className="flex flex-col items-center justify-center w-full bg-[#1B3764] text-center py-20 gap-4 font-pretendard">
        <h1 className="text-4xl font-bold text-white">AI 학습 메이트</h1>
        <div className="w-16 h-1 bg-yellow-400 mx-auto my-4"></div>
        <p className="text-lg text-[#B4C7E7]">
          AI와 대화하며 배우고, 자동으로 요약된 학습 기록을 언제든지 확인하세요.
        </p>
        <button
          className="px-[40px] py-[18px] bg-yellow-400 rounded-3xl"
          onClick={() => navigate('/chatbot')}
        >
          시작하기
        </button>
      </div>

      <div className="flex flex-col flex-1 pt-10 pb-10 mt-8 w-[1200px]">
        <h1 className="text-xl font-bold mb-6">학습 요약본</h1>

        <div className="grid grid-cols-5 gap-10">
          <button
            className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg border-2 border-dashed border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
            onClick={() => navigate('/chatbot')}
          >
            {/* 노트북 아이콘 */}
            <div className="relative w-16 h-20 rounded shadow-md mb-3 flex items-center justify-center">
              <BookOpenIcon className="h-10 w-10 text-blue-700 opacity-50" />
              <div className="absolute w-8 h-8 rounded-full bg-blue-100 -bottom-4 -right-4 flex items-center justify-center">
                <PlusIcon className="h-5 w-5 text-blue-700" />
              </div>
            </div>

            {/* 텍스트 */}
            <span className="text-blue-700 text-md font-medium mt-4">
              에듀봇과 공부하기
            </span>
          </button>

          {notebooks.map((notebook, index) => (
            <Notebook
              key={index}
              date={notebook.date}
              topic={notebook.topic}
              category={notebook.category}
              onClick={handleNotebookClick}
            />
          ))}
        </div>
      </div>

      {/* Notebook Detail Panel */}
      <NotebookDetail
        isOpen={detailOpen}
        onClose={handleCloseDetail}
        notebook={selectedNotebook || {}}
      />

      {/* Semi-transparent overlay when detail is open */}
      {detailOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-10"
          onClick={handleCloseDetail}
        />
      )}
    </div>
  );
}
