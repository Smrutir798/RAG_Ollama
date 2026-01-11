import React from 'react';

const EvidencePanel = ({ evidence }) => {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="mt-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
        Supporting Evidence
      </h3>
      <div className="space-y-3">
        {evidence.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                Ref {index + 1}
              </span>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-medical-primary font-medium hover:underline flex items-center">
                View Source 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <p className="text-slate-600 text-sm leading-snug mb-3 line-clamp-3 italic">
              "{item.content}"
            </p>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
               <span className="text-xs text-slate-400 font-medium truncate max-w-[120px]" title={item.source}>
                {item.source}
              </span>
              {item.score && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  High Relevance
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidencePanel;
