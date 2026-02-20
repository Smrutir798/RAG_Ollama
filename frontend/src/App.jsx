import React, { useState } from 'react';
import QueryInput from './components/QueryInput';
import ChatContainer from './components/ChatContainer';
import UploadSidebar from './components/UploadSidebar';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query) => {
    const userMsg = { id: Date.now(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    const thinkingMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { id: thinkingMsgId, role: 'ai', isThinking: true }]);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Backend error:', res.status, errText);
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      console.log('Backend response:', data);

      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMsgId 
          ? { id: thinkingMsgId, role: 'ai', content: data, isThinking: false }
          : msg
      ));

    } catch (err) {
      console.error('Query error:', err);
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMsgId 
          ? { 
              id: thinkingMsgId, 
              role: 'ai', 
              content: { 
                  answer: "I apologize, but I encountered an error connecting to the server. Check console for details.", 
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
    <div className="h-screen flex overflow-hidden relative">
      {/* Decorative blurred orbs for depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-sky-200/30 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-200/25 blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-teal-200/20 blur-3xl"></div>
      </div>

      <UploadSidebar />

      <div className="flex-1 flex flex-col xl:pl-72 transition-all h-full relative z-10">
        {/* Glass Header */}
        <header className="glass-strong py-4 border-b border-white/30 z-20">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <span className="text-white text-lg">🩺</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Explainable</span>
                <span className="text-slate-700 ml-1.5">Health Assistant</span>
              </h1>
            </div>
          </div>
        </header>

        <ChatContainer messages={messages} />

        {/* Floating ChatGPT-style Input Bar */}
        <div className="absolute bottom-5 left-4 right-4 xl:left-76 z-20 flex justify-center pointer-events-none">
          <div className="w-full max-w-3xl pointer-events-auto px-4 py-2 rounded-2xl border border-slate-200/60"
               style={{
                 background: 'rgba(255, 255, 255, 0.85)',
                 backdropFilter: 'blur(40px)',
                 WebkitBackdropFilter: 'blur(40px)',
                 boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.04)',
               }}>
             <QueryInput onSearch={handleSearch} isLoading={isLoading} />
           </div>
        </div>
      </div>
    </div>
  );
}

export default App;
