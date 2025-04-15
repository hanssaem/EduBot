import React, { useState, useEffect, useRef } from "react";
import Message from "../components/Message";
import Input from "../components/Input";
import { SiProbot } from "react-icons/si";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // 대화 히스토리 저장
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const addMessage = (sender, message) => {
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

  const handleSendMessage = async (message) => {
    const userMessage = { sender: "User", message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      const botMessage = { sender: "Chatbot", message: data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSummarize = async () => {
    if (messages.length === 0) {
      alert("대화 내용이 없습니다.");
      return;
    }

    const summaryPrompt = "지금까지의 대화를 최대한 상세하고 길게 요약해줘. 학습노트처럼 정리해줘.";
    setIsLoading(true); // ✅ 로딩 시작

    try {
      const response = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages, prompt: summaryPrompt, email: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        // alert(`✅ 요약 저장 완료!\n\n📌 제목: ${data.title}\n📝 요약: ${data.summary}`);
        navigate("/");
      } else {
        alert("요약 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("요약 중 오류:", error);
      alert("요약 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setIsInitialized(true);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <div className={`p-5 flex-1 overflow-y-auto space-y-3 transition-all ${isInitialized ? "pt-10" : ""}`}>

          {/* ✅ 요약 로딩 */}
          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-50 flex flex-col items-center justify-center">
              <div className="flex items-center bg-white px-6 py-4 rounded-xl shadow-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-blue-800 text-lg font-semibold">요약 생성 중입니다. 잠시만 기다려주세요...</span>
              </div>
            </div>
          )}


          {/* 초기 메시지 */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 text-2xl mb-10">
              궁금한 것을 무엇이든 물어보세요!
            </div>
          )}

          {/* 대화 메시지 출력 */}
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} message={msg.message} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <Input messages={messages} onSendMessage={handleSendMessage} onSummarize={handleSummarize} />
      </div>
    </div>
  );
};

export default Chatbot;
