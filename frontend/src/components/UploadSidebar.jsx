import React, { useState, useRef } from 'react';

const UploadSidebar = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
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
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadStatus('success');
      setFile(null); // Reset file after success
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 p-4 shadow-sm z-10 hidden xl:block">
       <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center">
          <span className="mr-2">📁</span> Knowledge Base
        </h2>
        <p className="text-xs text-slate-500 mt-1">Upload reports to analyze.</p>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt"
          className="hidden"
        />
        
        {!file ? (
          <div 
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer py-4"
          >
            <div className="text-2xl mb-2">📄</div>
            <p className="text-xs font-semibold text-slate-600">Click to upload PDF/TXT</p>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-sm font-medium text-slate-700 truncate px-2">{file.name}</p>
            <button 
              onClick={() => setFile(null)}
              className="text-xs text-red-500 hover:underline mt-1"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full mt-4 bg-slate-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? 'Uploading...' : 'Upload & Index'}
      </button>

      {uploadStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200">
          ✅ File indexed successfully! You can now ask questions about it.
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          ❌ Upload failed. Please try again.
        </div>
      )}
      
      <div className="mt-auto pt-8 border-t border-slate-100 absolute bottom-4 left-4 right-4">
        <div className="text-xs text-slate-400">
            <strong>Supported:</strong> PDF, TXT
        </div>
      </div>
    </div>
  );
};

export default UploadSidebar;
