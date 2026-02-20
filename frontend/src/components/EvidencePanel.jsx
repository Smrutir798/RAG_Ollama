import React from 'react';

const EvidencePanel = ({ evidence }) => {
  if (!evidence || evidence.length === 0) return null;

  const getRelevanceStyle = (score, relevance) => {
    const rel = relevance || (score >= 0.6 ? 'High' : score >= 0.35 ? 'Medium' : 'Low');
    if (rel === 'High') return {
      label: 'High',
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      bar: 'from-emerald-400 to-teal-500'
    };
    if (rel === 'Medium') return {
      label: 'Medium',
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      bar: 'from-amber-400 to-orange-500'
    };
    return {
      label: 'Low',
      color: 'text-slate-500',
      bg: 'bg-slate-500/10',
      bar: 'from-slate-400 to-slate-500'
    };
  };

  return (
    <div className="mt-2">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        Supporting Evidence
      </h3>
      <div className="space-y-3">
        {evidence.map((item, index) => {
          const scoreNum = typeof item.score === 'number' ? item.score : 0;
          const scorePercent = Math.round(scoreNum * 100);
          const style = getRelevanceStyle(scoreNum, item.relevance);

          return (
            <div key={index} className="glass-card p-4 group hover:border-sky-200/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 bg-white/50 px-2.5 py-1 rounded-lg border border-white/40">
                  Ref {index + 1}
                </span>
                <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full ${style.bg}`}>
                  <span className={`text-xs font-semibold ${style.color}`}>
                    {style.label} Relevance
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm leading-snug mb-3 line-clamp-3 italic">
                "{item.content}"
              </p>
              
              {/* Score Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Match Score</span>
                  <span className={`text-[10px] font-bold ${style.color}`}>{scorePercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200/50 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${style.bar} score-bar-fill`}
                    style={{ '--score-width': `${scorePercent}%`, width: `${scorePercent}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]" title={item.source}>
                  {item.source}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidencePanel;
