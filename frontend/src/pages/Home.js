import { SiProbot } from 'react-icons/si';
import { FolderPlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import Modal from '../components/Modal';
import Folder from '../components/Folder';
import Notebook from '../components/Notebook';
import NotebookDetail from '../components/NotebookDetail';

export default function Home() {
  const navigate = useNavigate();
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]); // Combined array for folders and notebooks
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(); // Firebase 인증 토큰 가져오기
          const response = await axios.get('http://localhost:5000/api/notes', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setItems(response.data); // 가져온 노트 데이터로 상태 업데이트
        } catch (err) {
          console.error('노트 가져오기 실패:', err);
          setError('노트를 불러오는 데 실패했습니다.');
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
      navigate('/login');
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

  const handleCreateFolder = () => {
    if (folderName.trim() === '') {
      alert('폴더명을 입력해주세요!');
      return;
    }

    const newFolder = {
      type: 'folder',
      name: folderName,
    };

    // Add new folder to the beginning of the items array
    setItems([newFolder, ...items]);
    setIsOpen(false);
    setFolderName('');
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
          className="font-bold text-3xl flex items-center justify-center"
          onClick={() => navigate('/')}
        >
          EduBot
          <SiProbot className="ml-2 text-3xl inline-block" />
        </button>

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
            <button onClick={() => navigate('/login')}>로그인</button>
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

      {/* 학습 노트 및 폴더 목록 */}
      <div className="flex flex-col flex-1 pt-10 pb-10 mt-8 w-[1200px]">
        <h1 className="text-xl font-bold mb-6">학습 요약본</h1>
        <div className="grid grid-cols-5 gap-10">
          <button
            className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg border-2 border-dashed border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
            onClick={() => setIsOpen(true)}
          >
            <FolderPlusIcon className="h-10 w-10 text-[#1B3764]" />
            <span className="text-[#1B3764] text-md font-medium mt-4">
              폴더 생성하기
            </span>
          </button>

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

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="새 폴더 생성"
        content={
          <div className="flex flex-col gap-4">
            <p className="text-gray-600 text-sm">
              생성할 폴더 이름을 입력하세요.
            </p>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="input input-bordered w-full p-2 border rounded-md"
              placeholder="폴더 이름"
            />
          </div>
        }
        confirmText="확인"
        onConfirm={handleCreateFolder}
      />

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
