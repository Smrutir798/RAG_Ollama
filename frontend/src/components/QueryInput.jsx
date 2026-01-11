import React, { useState } from 'react';

const QueryInput = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const exampleQueries = [
    "I have fever and headline",
    "Chest pain when breathing",
    "Sore throat and cough",
    "Skin rash with itching"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your symptoms (e.g., fever, cough, sore throat)..."
            disabled={isLoading}
            className="w-full pl-6 pr-32 py-5 text-lg rounded-2xl border-2 border-slate-200 shadow-sm focus:outline-none focus:border-medical-primary focus:ring-4 focus:ring-medical-primary/10 transition-all disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 px-8 bg-medical-primary hover:bg-sky-600 text-white rounded-xl font-semibold shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition-all transform active:scale-95 uppercase tracking-wide text-sm"
          >
            {isLoading ? '...' : 'Analyze'}
          </button>
        </div>
      </form>
      
      {/* Example Chips */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 py-1.5">Try asking:</span>
        {exampleQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setQuery(q)}
            disabled={isLoading}
            className="text-sm px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-medical-primary hover:text-medical-primary transition-colors cursor-pointer shadow-sm hover:shadow"
          >
            {q}
          </button>
        ))}
      </div>
     
      <p className="mt-6 text-center text-xs text-slate-400 max-w-xl mx-auto">
        By using this tool, you acknowledge that AI responses can be inaccurate. 
        <span className="block mt-1">Always consult a doctor for serious concerns.</span>
      </p>
    </div>
  );
};

export default QueryInput;
