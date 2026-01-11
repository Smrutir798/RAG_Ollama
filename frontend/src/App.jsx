import React, { useState } from 'react';
import QueryInput from './components/QueryInput';
import ChatContainer from './components/ChatContainer';
import UploadSidebar from './components/UploadSidebar';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query) => {
    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    // 2. Add Thinking Message
    const thinkingMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { id: thinkingMsgId, role: 'ai', isThinking: true }]);

    try {
      const res = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });

      if (!res.ok) throw new Error('Failed to fetch response');
      const data = await res.json();

      // 3. Replace Thinking with AI Response
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMsgId 
          ? { id: thinkingMsgId, role: 'ai', content: data, isThinking: false }
          : msg
      ));

    } catch (err) {
      // Handle Error
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMsgId 
          ? { 
              id: thinkingMsgId, 
              role: 'ai', 
              content: { 
                  answer: "I apologize, but I encountered an error connecting to the server.", 
                  is_safe: true, 
                  confidence: "Low",
                  evidence: []
              }, 
              isThinking: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex font-sans overflow-hidden">
      <UploadSidebar />

      <div className="flex-1 flex flex-col xl:pl-64 transition-all h-full relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 py-4 shadow-sm z-10">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🩺</span>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                <span className="text-medical-primary">Explainable</span> Health Assistant
              </h1>
            </div>
          </div>
        </header>
        

        {/* Chat Area - flex-1 ensuring it takes available space */}
        <ChatContainer messages={messages} />

        {/* Input Area (Docked Bottom) */}
        <div className="bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 absolute bottom-0 left-0 right-0 xl:left-64">
           <div className="max-w-4xl mx-auto">
             <QueryInput onSearch={handleSearch} isLoading={isLoading} />
           </div>
        </div>
      </div>
    </div>
  );
}

export default App;
