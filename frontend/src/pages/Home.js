import { SiProbot } from 'react-icons/si';
import {
  BellIcon,
  FolderPlusIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import Folder from '../components/Folder';
import Notebook from '../components/Notebook';
import NotebookDetail from '../components/NotebookDetail';
import ReminderCard from '../components/ReminderCard';
import CreateFolder from '../components/CreateFolder';

export default function Home() {
  const navigate = useNavigate();
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [items, setItems] = useState([]); // Combined array for folders and notebooks
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  const fetchNotes = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error('노트 가져오기 실패: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(); // Firebase 인증 토큰 가져오기
          setUserToken(token);
          fetchNotes(token);
        } catch (error) {
          console.error('노트 가져오기 실패:', error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // 🔥 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserToken(null);
      setItems([]);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleStartClick = () => {
    if (user) {
      navigate('/chatbot');
    } else {
      // 로그인 후 돌아올 페이지 정보를 state로 전달
      navigate('/login', { state: { from: '/chatbot' } });
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      console.log('Folder clicked:', item.name);
    } else {
      setSelectedNotebook(item);
      setDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white items-center">
      <nav className="w-full p-5 bg-[rgb(27,55,100)] text-white flex items-center">
        <div className="flex-1"></div>

        <button
          className="font-bold text-3xl flex items-start justify-center"
          onClick={() => navigate('/')}
        >
          EduBot
          <SiProbot className="ml-2 text-3xl inline-block" />
        </button>

        {/* <BellIcon className="h-5 w-5" />
        <Squares2X2Icon className="h-5 w-5" /> */}

        <div className="flex-1 flex justify-end pr-5 items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white text-md px-3 py-1 rounded"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login', { state: { from: '/' } })}
            >
              로그인
            </button>
          )}
        </div>
      </nav>

      {/* 학습 메이트 안내 섹션 */}
      <div className="flex flex-col items-center justify-center w-full bg-[#1B3764] text-center py-20 gap-4 font-pretendard">
        <h1 className="text-4xl font-bold text-white">AI 학습 메이트</h1>
        <div className="w-16 h-1 bg-yellow-400 mx-auto my-4"></div>
        <p className="text-lg text-[#B4C7E7]">
          AI와 대화하며 배우고, 자동으로 요약된 학습 기록을 언제든지 확인하세요.
        </p>
        <button
          className="px-[40px] py-[18px] bg-yellow-400 rounded-3xl"
          onClick={handleStartClick}
        >
          {user ? '에듀봇과 공부하기' : '로그인하고 시작하기'}
        </button>
      </div>

      <ReminderCard
        userToken={userToken}
        onNoteClick={(note) => {
          setSelectedNotebook(note);
          setDetailOpen(true);
        }}
      />

      {/* 학습 노트 및 폴더 목록 */}
      <div className="flex flex-col flex-1 pb-10 mt-12 w-[1200px]">
        <h1 className="text-xl font-bold mb-6">학습 요약본</h1>
        <div className="grid grid-cols-5 gap-10">
          <CreateFolder userToken={userToken} />

          {items.map((item, index) =>
            item.type === 'folder' ? (
              <Folder
                key={`folder-${index}`}
                name={item.name}
                onClick={() => handleItemClick(item)}
              />
            ) : (
              <Notebook
                key={item._id || index}
                createdAt={item.createdAt}
                title={item.title}
                category={item.category}
                onClick={() => handleItemClick(item)}
              />
            )
          )}
        </div>
      </div>

      {/* Notebook Detail Panel */}
      <NotebookDetail
        isOpen={detailOpen}
        onClose={handleCloseDetail}
        notebook={selectedNotebook || {}}
        userToken={userToken}
        onDeleteSuccess={() => fetchNotes(userToken)}
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
