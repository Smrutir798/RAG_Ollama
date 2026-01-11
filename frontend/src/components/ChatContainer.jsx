import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatContainer = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.isThinking]);

  return (
    <div className="flex-grow overflow-y-auto chat-scroll p-4 pb-32">
       <div className="max-w-5xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 mt-20">
               <span className="text-6xl mb-4">💬</span>
               <p className="text-lg">Start a conversation with your Health Assistant.</p>
            </div>
          ) : (
            messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          <div ref={bottomRef} />
       </div>
    </div>
  );
};

export default ChatContainer;
