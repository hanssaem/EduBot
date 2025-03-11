import { SiProbot } from 'react-icons/si';
import Notebook from '../components/Notebook';
import NotebookDetail from '../components/NotebookDetail';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const notebooks = [
    { date: '2025-03-07', topic: '리액트 기본' },
    { date: '2025-03-06', topic: 'State Management' },
    { date: '2025-03-05', topic: 'Tailwind Styling' },
    { date: '2025-03-04', topic: 'API Integration' },
    { date: '2025-03-04', topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ' },
    { date: '2025-03-04', topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ' },
    { date: '2025-03-04', topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ' },
    { date: '2025-03-04', topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ' },
    { date: '2025-03-04', topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ' },
    { date: '2025-03-04', topic: '이러나저라나 이러나 저러러나라날 ㅏ앙ㅇ' },
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
      <nav className="w-full p-5 bg-[#1B3764] text-white text-center font-bold text-3xl flex items-center justify-center">
        EduBot
        <SiProbot className="ml-2 text-3xl" />
      </nav>

      <div className="flex flex-col items-center justify-center w-full bg-[#1B3764] text-center py-20 gap-4 font-pretendard">
        <h1 className="text-4xl font-bold text-white">AI 학습 메이트</h1>
        <div className="w-16 h-1 bg-yellow-400 mx-auto my-4"></div>
        <p className="text-lg text-[#B4C7E7]">
          AI와 대화하며 배우고, 자동으로 요약된 학습 기록을 언제든지 확인하세요.
        </p>
        <button
          className="px-[50px] py-[20px] bg-yellow-400 rounded-3xl"
          onClick={() => navigate('/chatbot')}
        >
          에듀봇과 공부하기
        </button>
      </div>

      <div className="flex flex-col flex-1 pt-10 pb-10 mt-8 w-[1200px]">
        <h1 className="text-xl font-bold mb-6">학습 요약본</h1>

        <div className="grid grid-cols-5 gap-10">
          <button
            className="relative w-52 h-64 bg-gray-200 rounded-2xl shadow-md flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigate('/chatbot')}
          >
            <PlusIcon className="h-6 w-6 text-gray-500" />
            <span className="text-gray-500 text-md font-semibold mt-2">
              에듀봇과 공부하기
            </span>
          </button>

          {notebooks.map((notebook, index) => (
            <Notebook
              key={index}
              date={notebook.date}
              topic={notebook.topic}
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
