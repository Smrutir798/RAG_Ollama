import React, { useState, useRef, useEffect } from 'react';

const QueryInput = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, [query]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
      setQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about symptoms, conditions, or health topics..."
          disabled={isLoading}
          rows={1}
          className="w-full resize-none pl-4 pr-4 py-3 text-[15px] leading-relaxed rounded-xl border-none bg-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400 text-slate-700"
          style={{ maxHeight: '200px' }}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all transform active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
        style={{
          background: isLoading || !query.trim()
            ? 'rgba(148, 163, 184, 0.3)'
            : '#1e293b',
          boxShadow: isLoading || !query.trim()
            ? 'none'
            : '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14V2M8 2L3 7M8 2L13 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </form>
  );
};

export default QueryInput;
