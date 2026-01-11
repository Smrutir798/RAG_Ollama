import React, { useState } from 'react';
import EvidencePanel from './EvidencePanel';

const MessageBubble = ({ message }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const { role, content, isThinking } = message;

  // 1. User Message: Simple Right-Aligned Bubble
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-6 animate-slide-in">
        <div className="bg-slate-800 text-white px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
          <p className="text-lg">{content}</p>
        </div>
      </div>
    );
  }

  // 2. Loading State (Thinking Bubble)
  if (isThinking) {
    return (
      <div className="flex justify-start mb-6 animate-slide-in">
        <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-slate-400 text-sm font-medium ml-2">Analyzing medical evidence...</span>
        </div>
      </div>
    );
  }

  // 3. AI Message: Rich Display
  // The 'content' for AI is the full response object from backend
  const { answer, explanation, confidence, evidence, is_safe, refusal_reason, risk_level, disclaimer } = content || {};

  // HELPER: Confidence Colors
  const getConfidenceColor = (score) => {
    if (score === 'High') return 'bg-sky-50 text-sky-900 border-sky-100';
    if (score === 'Medium') return 'bg-amber-50 text-amber-900 border-amber-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  // 3A. Emergency Response
  if (risk_level === 'High') {
    return (
      <div className="flex justify-start mb-8 animate-slide-in">
        <div className="w-full max-w-4xl card border-l-8 border-red-600 bg-red-50 shadow-xl p-6 rounded-r-xl">
            <div className="flex items-start">
            <div className="flex-shrink-0 animate-pulse-emergency bg-red-100 p-3 rounded-full mr-4">
                <span className="text-4xl">🚨</span>
            </div>
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-700 mb-2 uppercase tracking-wider">Medical Emergency Suspected</h2>
                <div className="prose prose-red text-red-800 text-lg">
                    <p className="font-semibold">{refusal_reason}</p>
                    <div className="my-4 bg-white p-4 rounded-lg border border-red-200">
                        <p className="font-bold text-black mb-2">Recommended Actions:</p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-800">
                            <li>Call <strong>911</strong> or your local emergency number immediately.</li>
                            <li>Do not rely on this AI for critical medical aid.</li>
                            <li>Go to the nearest emergency room if safe to do so.</li>
                        </ul>
                    </div>
                    <p className="text-sm opacity-80">{disclaimer}</p>
                </div>
            </div>
            </div>
        </div>
      </div>
    );
  }

  // 3B. Standard Response
  return (
    <div className="flex justify-start mb-8 animate-slide-in w-full">
      <div className="w-full max-w-5xl">
         {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
             {/* Header */}
             <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">🩺</span>
                    <span className="font-semibold text-slate-700">Health Assistant</span>
                </div>
                {confidence && (
                     <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(confidence)}`}>
                        {confidence} Confidence
                     </span>
                )}
             </div>
             
             <div className="p-6">
                {!is_safe ? (
                    <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-md">
                         <h3 className="text-orange-800 font-bold mb-1">Caution</h3>
                         <p className="text-orange-800">{refusal_reason}</p>
                    </div>
                ) : (
                    <div className="prose prose-lg prose-slate max-w-none text-slate-800 leading-relaxed">
                        {answer}
                    </div>
                )}
             </div>

             {/* Footer Actions */}
             <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center space-x-4">
                {explanation && (
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="text-sm text-medical-primary hover:text-sky-700 font-medium flex items-center transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {showExplanation ? "Hide Reasoning" : "View Reasoning & Evidence"}
                    </button>
                )}
             </div>
        </div>

        {/* Expanded Details (Accordion) */}
        {showExplanation && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pl-4 border-l-2 border-slate-200 ml-4">
                {/* Reasoning */}
                <div className="lg:col-span-2 space-y-4">
                     <div className="bg-white rounded-lg p-5 border border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-2 text-sm uppercase">Logic & Reasoning</h4>
                        <p className="text-slate-600 text-sm whitespace-pre-wrap">{explanation}</p>
                     </div>
                </div>
                
                {/* Evidence & Disclaimer */}
                <div className="space-y-4">
                     {evidence && evidence.length > 0 && <EvidencePanel evidence={evidence} />}
                     
                    <div className={`rounded-xl border p-4 text-xs ${risk_level === 'Moderate' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                        <strong>Disclaimer:</strong> {disclaimer || "Not medical advice."}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
