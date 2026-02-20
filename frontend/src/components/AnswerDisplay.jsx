import React, { useState } from 'react';
import EvidencePanel from './EvidencePanel';

const AnswerDisplay = ({ response }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!response) return null;

  const { answer, explanation, confidence, evidence, is_safe, refusal_reason, risk_level, disclaimer } = response;

  // EMERGENCY
  if (risk_level === 'High') {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 rounded-2xl overflow-hidden border border-red-200/50 shadow-xl shadow-red-500/10 animate-fade-in"
           style={{ background: 'rgba(254, 242, 242, 0.7)', backdropFilter: 'blur(20px)' }}>
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 animate-pulse-emergency p-3 rounded-2xl mr-4">
              <span className="text-4xl">🚨</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-red-700 mb-2 uppercase tracking-wider">Medical Emergency Suspected</h2>
              <p className="text-red-700 font-semibold text-lg">{refusal_reason}</p>
              <div className="my-4 glass-card p-4 border-red-200/30">
                <p className="font-bold text-slate-800 mb-2">Recommended Actions:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Call <strong>911</strong> or your local emergency number immediately.</li>
                  <li>Do not rely on this AI for critical medical aid.</li>
                  <li>Go to the nearest emergency room if safe to do so.</li>
                </ul>
              </div>
              <p className="text-sm text-red-600/70">{disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REFUSAL
  if (!is_safe) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 glass-card p-6 border-l-4 border-orange-500/60 animate-fade-in">
        <h3 className="text-orange-800 font-bold text-lg mb-2">Query Handled with Caution</h3>
        <div className="text-orange-800" dangerouslySetInnerHTML={{ __html: refusal_reason.replace(/\n/g, '<br />') }} />
        <p className="mt-4 text-xs text-orange-600/70 italic border-t border-white/20 pt-2">{disclaimer}</p>
      </div>
    );
  }

  const getConfidenceStyle = (score) => {
    if (score === 'High') return {
      bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500/20',
      dot: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-500', barWidth: '90%'
    };
    if (score === 'Medium') return {
      bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-500/20',
      dot: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500', barWidth: '55%'
    };
    return {
      bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/20',
      dot: 'bg-slate-400', gradient: 'from-slate-400 to-slate-500', barWidth: '25%'
    };
  };

  const conf = getConfidenceStyle(confidence);

  return (
    <div className="w-full mt-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Answer & Explanation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/20 flex items-center" style={{ background: 'rgba(255,255,255,0.3)' }}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-sm mr-3">
                <span className="text-white text-sm">🩺</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-700">Analysis Result</h2>
            </div>
            <div className="p-6 text-slate-700 text-[16px] leading-relaxed">
              {answer}
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center font-medium bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why did the AI say this?
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transform transition-transform ${showExplanation ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showExplanation && (
              <div className="px-6 pb-6 pt-2 border-t border-white/20" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <h4 className="font-semibold text-slate-600 mb-2 text-xs uppercase tracking-widest">Logic & Reasoning</h4>
                <div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                  {explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Confidence, Evidence */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Confidence Level</h3>
            <div className={`p-4 rounded-xl flex items-start ${conf.bg} border ${conf.border}`}>
              <div className={`w-3 h-3 rounded-full ${conf.dot} mt-0.5 flex-shrink-0`}></div>
              <div className="ml-3">
                <p className={`font-bold ${conf.text}`}>{confidence} Confidence</p>
                <p className="text-xs mt-1 text-slate-500">
                  Based on {evidence.length} evidence source{evidence.length !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
            {/* Score Bar */}
            <div className="mt-3">
              <div className="w-full h-2 rounded-full bg-slate-200/50 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${conf.gradient} score-bar-fill`}
                  style={{ '--score-width': conf.barWidth, width: conf.barWidth }}
                ></div>
              </div>
            </div>
          </div>

          <EvidencePanel evidence={evidence} />

          <div className={`glass-card p-4 text-xs ${risk_level === 'Moderate' ? 'border-amber-200/50' : ''}`}>
            <strong className="text-slate-600">Disclaimer:</strong>
            <span className="text-slate-500 ml-1">{disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerDisplay;
