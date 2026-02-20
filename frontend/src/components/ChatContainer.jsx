import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatContainer = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.isThinking]);

  return (
    <div className="flex-grow overflow-y-auto chat-scroll p-4 pb-36">
       <div className="max-w-5xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center mt-24">
               <div className="glass-card p-10 text-center animate-float">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-400/20 flex items-center justify-center border border-white/40">
                    <span className="text-4xl">💬</span>
                  </div>
                  <p className="text-lg font-medium text-slate-500">Start a conversation with your Health Assistant</p>
                  <p className="text-sm text-slate-400 mt-2">Ask about symptoms, conditions, or general health topics</p>
               </div>
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
