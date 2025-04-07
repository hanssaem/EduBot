import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';

const NotebookDetail = ({ isOpen, onClose, notebook, userToken }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotebook, setEditedNotebook] = useState({
    title: '',
    content: '',
  });

  const updateNote = async (noteId, newTitle, newContent, userToken) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`, // 🔐 인증 토큰 포함
          },
          body: JSON.stringify({ title: newTitle, content: newContent }), // 📝 수정할 데이터
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('노트 수정 실패:', error);
    }
  };

  const deleteNote = async (noteId, userToken) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('노트 삭제 실패:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setEditedNotebook({
        title: notebook?.title || '',
        content: notebook?.content || '',
      });
    }
  }, [isOpen, notebook]);

  const toggleEditMode = () => {
    if (isEditing) {
      // 편집 모드 종료 시 원상태로 복구
      setEditedNotebook({
        title: notebook?.title || '',
        content: notebook?.content || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updateNote(
      notebook._id,
      editedNotebook.title,
      editedNotebook.content,
      userToken
    );
    setIsEditing(false);
    notebook.title = editedNotebook.title;
    notebook.content = editedNotebook.content;
  };

  // 삭제 확인
  const handleDelete = () => {
    if (window.confirm('정말로 이 노트를 삭제하시겠습니까?')) {
      deleteNote(notebook._id, userToken);
      onClose();
    }
  };

  // 입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNotebook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  {/* 저장 버튼 */}
                  <button
                    onClick={handleSave}
                    className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                  {/* 취소 버튼 */}
                  <button
                    onClick={toggleEditMode}
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  {/* 편집 버튼 */}
                  <button
                    onClick={toggleEditMode}
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </>
              )}
              {/* 닫기 버튼 */}
              {!isEditing && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-6 pb-3 border-b border-gray-300">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editedNotebook.title}
                onChange={handleChange}
                className="w-full text-xl font-medium text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none py-1"
                placeholder="제목을 입력하세요"
              />
            ) : (
              <h3 className="text-xl font-medium text-gray-800">
                {notebook.title || '제목 없음'}
              </h3>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {notebook.createdAt
                ? new Date(notebook.createdAt).toLocaleDateString()
                : '날짜 없음'}
            </p>
          </div>

          {/* 콘텐츠 표시 영역 */}
          <div className="space-y-6 pb-8">
            {isEditing ? (
              <textarea
                name="content"
                value={editedNotebook.content}
                onChange={handleChange}
                className="w-full h-96 bg-transparent border border-gray-300 rounded p-3 focus:border-blue-500 focus:outline-none text-gray-600 leading-relaxed resize-none"
                placeholder="내용을 입력하세요"
                style={{
                  backgroundImage: `linear-gradient(transparent, transparent calc(1.5em - 1px), #e6e6e6 0px)`,
                  backgroundSize: '100% 1.5em',
                  lineHeight: '1.5em',
                }}
              />
            ) : (
              <>
                {notebook.content ? (
                  notebook.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 italic">내용이 없습니다.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookDetail;
