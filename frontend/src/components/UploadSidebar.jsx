import React, { useState, useRef } from 'react';

const UploadSidebar = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadStatus('success');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-72 p-4 z-30 hidden xl:flex flex-col border-r border-white/30"
         style={{
           background: 'rgba(255, 255, 255, 0.35)',
           backdropFilter: 'blur(40px)',
           WebkitBackdropFilter: 'blur(40px)',
         }}>
      <div className="mb-6">
        <div className="flex items-center space-x-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-white text-sm">📁</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Knowledge Base</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 ml-[42px]">Upload reports to analyze.</p>
      </div>

      {/* Drop zone */}
      <div className="glass-card border-2 border-dashed border-white/40 p-4 text-center hover:border-sky-300/50 transition-all cursor-pointer group">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt"
          className="hidden"
        />
        
        {!file ? (
          <div onClick={() => fileInputRef.current.click()} className="py-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-sky-400/10 to-indigo-400/10 flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-xs font-semibold text-slate-600">Click to upload PDF/TXT</p>
            <p className="text-[10px] text-slate-400 mt-1">Drag & drop or click to browse</p>
          </div>
        ) : (
          <div className="py-3">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <span className="text-lg">📎</span>
            </div>
            <p className="text-sm font-medium text-slate-700 truncate px-2">{file.name}</p>
            <button 
              onClick={() => setFile(null)}
              className="text-xs text-red-500 hover:text-red-600 font-medium mt-1.5 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full mt-4 py-2.5 text-sm font-semibold rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        style={{
          background: !file || isUploading
            ? 'rgba(148, 163, 184, 0.4)'
            : 'linear-gradient(135deg, #334155, #1e293b)',
          boxShadow: !file || isUploading
            ? 'none'
            : '0 4px 14px rgba(30, 41, 59, 0.3)',
        }}
      >
        {isUploading ? 'Uploading...' : 'Upload & Index'}
      </button>

      {uploadStatus === 'success' && (
        <div className="mt-4 glass-card p-3 text-xs text-emerald-700 border-emerald-200/50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs">✓</span>
            </div>
            <span>File indexed successfully! Ask questions about it.</span>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-4 glass-card p-3 text-xs text-red-700 border-red-200/50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs">✕</span>
            </div>
            <span>Upload failed. Please try again.</span>
          </div>
        </div>
      )}
      
      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
          <span className="font-medium">Supported:</span>
          <span className="px-2 py-0.5 rounded-md bg-white/30 border border-white/20 text-slate-500">PDF</span>
          <span className="px-2 py-0.5 rounded-md bg-white/30 border border-white/20 text-slate-500">TXT</span>
        </div>
      </div>
    </div>
  );
};

export default UploadSidebar;
