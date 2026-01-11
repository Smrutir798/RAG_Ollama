import React, { useState } from 'react';
import EvidencePanel from './EvidencePanel';

const AnswerDisplay = ({ response }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!response) return null;

  const { answer, explanation, confidence, evidence, is_safe, refusal_reason, risk_level, disclaimer } = response;

  // EMERGENCY RESPONSES (High Risk)
  if (risk_level === 'High') {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 card border-l-8 border-red-600 bg-red-50 shadow-xl animate-fade-in">
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
    );
  }

  // STANDARD REFUSALS
  if (!is_safe) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-orange-50 border-l-4 border-orange-500 rounded-r-md shadow-sm">
        <h3 className="text-orange-800 font-bold text-lg mb-2">Query Handled with Caution</h3>
        <div className="prose prose-orange text-orange-800" dangerouslySetInnerHTML={{ __html: refusal_reason.replace(/\n/g, '<br />') }} />
        <p className="mt-4 text-xs text-orange-600 italic border-t border-orange-200 pt-2">{disclaimer}</p>
      </div>
    );
  }

  const getConfidenceColor = (score) => {
    if (score === 'High') return 'bg-sky-50 text-sky-900 border-sky-100';
    if (score === 'Medium') return 'bg-amber-50 text-amber-900 border-amber-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  return (
    <div className="w-full mt-8 animate-fade-in">
      {/* 2-Column Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Answer & Explanation (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center">
              <span className="text-2xl mr-3">🩺</span>
              <h2 className="text-lg font-semibold text-slate-800">Analysis Result</h2>
            </div>
            <div className="p-6">
              <div className="prose prose-lg prose-slate max-w-none text-slate-800 leading-relaxed">
                {answer}
              </div>
            </div>
          </div>

          {/* Explanation Accordion */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center text-medical-primary font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why did the AI say this?
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-slate-400 transform transition-transform ${showExplanation ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showExplanation && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                <h4 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">Logic & Reasoning</h4>
                <div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                  {explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Confidence, Safety, Evidence (1/3 width) */}
        <div className="space-y-6">
          
          {/* Confidence Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Confidence Level</h3>
            <div className={`p-4 rounded-lg flex items-start ${getConfidenceColor(confidence)}`}>
              <div className="flex-shrink-0 mt-0.5">
                {confidence === 'High' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="font-bold">{confidence} Confidence</p>
                <p className="text-xs mt-1 opacity-80">
                  Based on symptom overlap with medical patterns and {evidence.length} evidence sources.
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Panel */}
          <EvidencePanel evidence={evidence} />

          {/* Contextual Safety Note */}
          <div className={`rounded-xl border p-4 text-xs ${risk_level === 'Moderate' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <strong>Disclaimer:</strong> {disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerDisplay;
