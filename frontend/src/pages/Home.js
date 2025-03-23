import { SiProbot } from 'react-icons/si';
import Notebook from '../components/Notebook';
import NotebookDetail from '../components/NotebookDetail';
import { BookOpenIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
  const navigate = useNavigate();
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [user, setUser] = useState(null); // 🔥 로그인한 유저 정보 저장

  // Firebase 인증 객체 가져오기
  const auth = getAuth();

  // 🔥 로그인 상태 감지하여 사용자 정보 업데이트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  // 🔥 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const notebooks = [
    { date: '2025-03-07', topic: '리액트 기본', category: 'art' },
    { date: '2025-03-06', topic: 'State Management', category: 'language' },
    { date: '2025-03-05', topic: 'Tailwind Styling', category: 'history' },
    { date: '2025-03-04', topic: 'API Integration', category: 'programming' }, {
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
      {/* 🔥 네비게이션 바 */}
      <nav className="w-full p-5 bg-[#1B3764] text-white flex items-center justify-between">
        {/* 로고 */}
        <button
          className="font-bold text-3xl flex-1 text-center ml-[62px] flex justify-center items-center"
          onClick={() => navigate('/')}
        >
          EduBot
          <SiProbot className="ml-2 text-3xl inline-block" />
        </button>

        {/* 🔥 로그인 여부에 따라 표시 */}
        <div className="pr-5 flex items-center gap-4">
          {user ? (
            <>
              {/* 로그인한 경우 사용자 이메일 표시 */}
              <span className="text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}>로그인</button>
          )}
        </div>
      </nav>

      {/* 🔥 학습 메이트 안내 섹션 */}
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

      {/* 🔥 학습 노트 목록 */}
      <div className="flex flex-col flex-1 pt-10 pb-10 mt-8 w-[1200px]">
        <h1 className="text-xl font-bold mb-6">학습 요약본</h1>
        <div className="grid grid-cols-5 gap-10">
          <button
            className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg border-2 border-dashed border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
            onClick={() => navigate('/chatbot')}
          >
            <div className="relative w-16 h-20 rounded shadow-md mb-3 flex items-center justify-center">
              <BookOpenIcon className="h-10 w-10 text-blue-700 opacity-50" />
              <div className="absolute w-8 h-8 rounded-full bg-blue-100 -bottom-4 -right-4 flex items-center justify-center">
                <PlusIcon className="h-5 w-5 text-blue-700" />
              </div>
            </div>
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
