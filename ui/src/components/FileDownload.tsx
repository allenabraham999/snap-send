'use client';

import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

interface FileDownloadProps {
  onDownload: (port: number) => Promise<void>;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const port = parseInt(inviteCode.trim(), 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      setError('Please enter a valid port number (1-65535)');
      return;
    }
    
    try {
      await onDownload(port);
    } catch (err) {
      setError('Failed to download the file. Please check the invite code and try again.');
    }
  };
  
  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-[#0F828C] p-6 rounded-2xl border border-[#78B9B5] shadow-xl shadow-[#78B9B5]/30 w-full max-w-md relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#78B9B5]/30 rounded-full blur-2xl z-0" />
        <h3 className="text-2xl font-extrabold text-white mb-2 z-10 relative drop-shadow-lg">Receive a File</h3>
        <p className="text-base text-white mb-0 z-10 relative font-medium">
          Enter the invite code shared with you to download the file.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md bg-white/80 rounded-xl p-6 shadow-lg border border-teal-500 backdrop-blur-md">
        <div>
          <label htmlFor="inviteCode" className="block text-base font-semibold text-teal-700 mb-3">
            Invite Code
          </label>
          <input
            type="text"
            id="inviteCode"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter the invite code (port number)"
            className="input-field w-full px-4 py-2 rounded-lg border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 bg-teal-50/60 text-teal-900 placeholder-te-400 font-medium shadow-sm transition-all duration-200 disabled:bg-teal-100/60 disabled:opacity-70"
            disabled={isDownloading}
            required
          />
          {error && <p className="mt-2 text-sm text-red-600 font-semibold animate-pulse">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="btn-primary flex items-center justify-center w-full py-2 px-4 rounded-lg bg-[#0F828C] text-white font-bold text-lg shadow-md hover:scale-105 active:scale-100 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <span className="animate-pulse">Downloading...</span>
          ) : (
            <>
              <FiDownload className="mr-3 text-xl" />
              <span>Download File</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
