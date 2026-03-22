import { useEffect, useRef, useState } from 'react';
import './Chat.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const threadId = useRef(crypto.randomUUID())

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  async function handleSubmit() {
    if (!userInput.trim() || isLoading) return;

    const question = userInput;
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput, threadId: threadId.current }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'ai', content: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'The connection was lost in the void...' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-icon" />
        <h1>Midnight Knowledge Base</h1>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">&#9789;</div>
            <p>Ask anything about the Midnight expansion</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message message-${msg.role}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          ))
        )}

        {isLoading && (
          <div className="message message-ai">
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            placeholder="Ask about Midnight..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
          ></input>
          <button
            type="submit"
            disabled={!userInput.trim() || isLoading}
          >Send</button>
        </form>
      </div>
    </div>
  );
}
