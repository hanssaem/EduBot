import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "나", text: input };
    setMessages(prev => [userMessage, ...prev]);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();

      const botMessage = { sender: "챗봇", text: data.reply };
      setMessages(prev => [botMessage, ...prev]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className="flex flex-col w-96 h-[600px] border p-4">
      <div className="flex-1 overflow-y-auto flex flex-col-reverse border-b p-2">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border-t">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex p-2">
        <input
          type="text"
          className="flex-1 p-2 border"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="ml-2 p-2 bg-blue-500 text-white" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}
