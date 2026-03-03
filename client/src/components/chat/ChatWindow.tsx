import { useRef, useEffect, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  otherUserId: string;
  otherUserName: string;
  otherUserModel: 'User' | 'Owner';
  propertyId: string;
  propertyTitle: string;
  role: 'user' | 'owner';
}

export const ChatWindow = ({ otherUserId, otherUserName, otherUserModel, propertyId, propertyTitle, role }: Props) => {
  const { userData } = useAuthStore();
  const { messages, messageLoading, sendMessage, handleTyping, isOtherUserTyping, isOtherUserOnline } = useChat({
    otherUserId,
    otherUserModel,
    propertyId,
    role,
  });

  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const myId = (userData as any)?._id || (userData as any)?.id;

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
            {/* {otherUserName[0]?.toUpperCase()} */}
            {otherUserName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          {isOtherUserOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">{otherUserName}</p>
          <p className="text-xs text-gray-500">{propertyTitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messageLoading && <p className="text-center text-gray-400 text-sm">Loading...</p>}
        {/* {messages.map((msg) => { */}
        {/* {messages?.map((msg) => { */}
        {(messages || []).map((msg) => {
          const isMine = msg.sender === myId;
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                  isMine ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}
              >
                {msg.image && <img src={msg.image} alt="attachment" className="rounded mb-1 max-w-full" />}
                {msg.content && <p>{msg.content}</p>}
                <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMine && <span className="ml-1">{msg.isRead ? '✓✓' : '✓'}</span>}
                </p>
              </div>
            </div>
          );
        })}
        {isOtherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-none shadow text-gray-400 text-sm italic">
              typing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white rounded-full px-4 py-2 text-sm hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};