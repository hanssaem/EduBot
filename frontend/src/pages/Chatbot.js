import React, { useState, useEffect, useRef } from 'react';
import Message from '../components/Message';
import Input from '../components/Input';
import { SiProbot } from 'react-icons/si';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // 대화 히스토리 저장
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Firebase 인증 객체 가져오기
  const auth = getAuth();

  // 🔥 로그인 상태 감지하여 사용자 정보 업데이트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // ✅ 로그인한 사용자를 상태에 저장
    });

    return () => unsubscribe(); // 🔄 구독 해제 (메모리 누수 방지)
  }, []);

  const addMessage = (sender, message) => {
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

  // 메시지 전송 핸들러 (대화 히스토리 포함)
  const handleSendMessage = async (message) => {
    const userMessage = { sender: 'User', message };
    const updatedMessages = [...messages, userMessage]; // 새로운 대화 히스토리

    setMessages(updatedMessages); // 상태 업데이트

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }), // 🔥 대화 히스토리 전달
      });

      const data = await response.json();
      const botMessage = { sender: 'Chatbot', message: data.reply };

      setMessages((prevMessages) => [...prevMessages, botMessage]); // 응답 추가
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (messages.length === 0) {
      alert('대화 내용이 없습니다.');
      return;
    }

    const summaryPrompt =
      '지금까지의 대화를 최대한 상세하고 길게 요약해줘. 학습노트처럼 정리해줘.';

    const response = await fetch('http://localhost:5000/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        prompt: summaryPrompt,
        email: user.email,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(
        `✅ 요약 저장 완료!\n\n📌 제목: ${data.title}\n📝 요약: ${data.summary}`
      );
    } else {
      alert('요약 저장에 실패했습니다.');
    }
  };

  // isInitialized 설정 (대화가 추가되면 true로 변경)
  useEffect(() => {
    if (messages.length > 0) {
      setIsInitialized(true);
    }
  }, [messages]);

  // 새로운 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex items-center justify-center min-h-screen flex-col font-pretendard">
      {/* 헤더 */}
      <div className="w-full p-5 bg-[#1B3764] text-white text-center font-bold text-3xl fixed top-0 left-0 z-10 flex items-center justify-center">
        EduBot
        <SiProbot className="ml-2 text-3xl" />
      </div>

      {/* 채팅 UI */}
      <div className="w-[1000px] bg-white rounded-lg flex flex-col mt-16">
        <div
          className={`p-5 flex-1 overflow-y-auto space-y-3 transition-all ${
            isInitialized ? 'pt-10' : ''
          }`}
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-2xl mb-10">
              궁금한 것을 무엇이든 물어보세요!
            </div>
          )}
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} message={msg.message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mt-4 mb-10">
              <div className="bg-gray-100 text-gray-900 p-4 rounded-lg rounded-bl-none max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <Input
          messages={messages}
          onSendMessage={handleSendMessage}
          onSummarize={handleSummarize}
        />
      </div>
    </div>
  );
};

export default Chatbot;
