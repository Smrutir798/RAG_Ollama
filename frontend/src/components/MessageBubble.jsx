import React, { useState } from 'react';
import EvidencePanel from './EvidencePanel';

const MessageBubble = ({ message }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const { role, content, isThinking } = message;

  // 1. User Message — glass pill, right-aligned
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-6 animate-slide-in">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg shadow-slate-900/20">
          <p className="text-lg leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  // 2. Thinking — glass shimmer
  if (isThinking) {
    return (
      <div className="flex justify-start mb-6 animate-slide-in">
        <div className="glass-card px-6 py-4 rounded-2xl rounded-tl-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-slate-400 text-sm font-medium ml-2">Analyzing medical evidence...</span>
        </div>
      </div>
    );
  }

  // 3. AI Message
  const { answer, explanation, confidence, evidence, is_safe, refusal_reason, risk_level, disclaimer } = content || {};

  // Confidence styling
  const getConfidenceStyle = (score) => {
    if (score === 'High') return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-500',
      barWidth: '90%'
    };
    if (score === 'Medium') return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700',
      border: 'border-amber-500/20',
      dot: 'bg-amber-500',
      gradient: 'from-amber-500 to-orange-500',
      barWidth: '55%'
    };
    return {
      bg: 'bg-slate-500/10',
      text: 'text-slate-600',
      border: 'border-slate-500/20',
      dot: 'bg-slate-400',
      gradient: 'from-slate-400 to-slate-500',
      barWidth: '25%'
    };
  };

  // 3A. Emergency
  if (risk_level === 'High') {
    return (
      <div className="flex justify-start mb-8 animate-slide-in">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-red-200/50 shadow-xl shadow-red-500/10"
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
      </div>
    );
  }

  const conf = getConfidenceStyle(confidence);

  // 3B. Standard Response — Glass Card
  return (
    <div className="flex justify-start mb-8 animate-slide-in w-full">
      <div className="w-full max-w-5xl">
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className="px-6 py-3.5 border-b border-white/20 flex items-center justify-between"
               style={{ background: 'rgba(255,255,255,0.3)' }}>
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm">🩺</span>
              </div>
              <span className="font-semibold text-slate-700 text-sm">Health Assistant</span>
            </div>
            {confidence && (
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${conf.bg} border ${conf.border}`}>
                <div className={`w-2 h-2 rounded-full ${conf.dot}`}></div>
                <span className={`text-xs font-semibold ${conf.text}`}>{confidence} Confidence</span>
              </div>
            )}
          </div>
             
          {/* Body */}
          <div className="p-6">
            {!is_safe ? (
              <div className="p-4 rounded-xl border border-orange-200/50"
                   style={{ background: 'rgba(255, 237, 213, 0.5)', backdropFilter: 'blur(10px)' }}>
                <h3 className="text-orange-800 font-bold mb-1">Caution</h3>
                <p className="text-orange-800">{refusal_reason}</p>
              </div>
            ) : (
              <div className="text-slate-700 text-[16px] leading-relaxed">
                {answer}
              </div>
            )}

            {/* Confidence Score Bar */}
            {confidence && is_safe && (
              <div className="mt-5 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confidence Score</span>
                  <span className={`text-xs font-bold ${conf.text}`}>{confidence}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200/50 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${conf.gradient} score-bar-fill`}
                    style={{ '--score-width': conf.barWidth, width: conf.barWidth }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/20 flex items-center space-x-4"
               style={{ background: 'rgba(255,255,255,0.2)' }}>
            {explanation && (
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-sm font-medium flex items-center transition-all hover:opacity-80 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showExplanation ? "Hide Reasoning" : "View Reasoning & Evidence"}
              </button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showExplanation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 animate-fade-in pl-4 border-l-2 border-sky-500/20 ml-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card p-5">
                <h4 className="font-semibold text-slate-600 mb-2 text-xs uppercase tracking-widest">Logic & Reasoning</h4>
                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{explanation}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {evidence && evidence.length > 0 && <EvidencePanel evidence={evidence} />}
              
              <div className={`glass-card p-4 text-xs ${risk_level === 'Moderate' ? 'border-amber-200/50' : ''}`}>
                <strong className="text-slate-600">Disclaimer:</strong>
                <span className="text-slate-500 ml-1">{disclaimer || "Not medical advice."}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
