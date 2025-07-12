'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface InviteCodeProps {
  port: number | null;
}

export default function InviteCode({ port }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);
  
  if (!port) return null;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(port.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="mt-6 p-4 bg-[#0F828C]/90 border border-[#78B9B5] rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-white drop-shadow">File Ready to Share!</h3>
      <p className="text-sm text-[#DCD0A8] mb-3 font-medium">
        Share this invite code with anyone you want to share the file with:
      </p>
      
      <div className="flex items-center">
        <div className="flex-1 bg-[#DCD0A8]/80 p-3 rounded-l-md border border-r-0 border-[#78B9B5] font-mono text-lg text-[#0F828C]">
          {port}
        </div>
        <button
          onClick={copyToClipboard}
          className="p-3 bg-[#78B9B5] hover:bg-[#0F828C] text-white rounded-r-md transition-colors font-bold"
          aria-label="Copy invite code"
        >
          {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
        </button>
      </div>
      
      <p className="mt-3 text-xs text-[#78B9B5]">
        This code will be valid as long as your file sharing session is active.
      </p>
    </div>
  );
}
