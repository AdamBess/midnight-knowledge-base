import { useState } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  async function handleSubmit() {
    setMessages([...messages, { role: 'user', content: userInput }]);
    setUserInput('');
    const response = await fetch('http://localhost:3000/chatbot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userInput }),
    });
    const data = await response.json();

    setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
  }

  return (
    <div className="container">
      <div className="chat-header"></div>
      {messages.map((msg, index) => (
        <div key={index}>{msg.content}
        </div>
      ))}
      <form
      className="chat-body"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }
      }>
        <input
          type="text"
          placeholder="Ask a question!"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></input>
        <button
          type='submit'
        ></button>
      </form>
    </div>
  );
}
