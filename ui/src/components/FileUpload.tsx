'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all
        ${dragActive 
          ? 'border-[#0F828C] bg-[#78B9B5]/20' 
          : 'border-[#78B9B5] hover:border-[#0F828C] hover:bg-[#DCD0A8]/20'
        }
        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="p-3 bg-[#DCD0A8]/60 rounded-full">
          <FiUpload className="w-6 h-6 text-[#0F828C]" />
        </div>
        <p className="text-lg font-medium text-[#0F828C]">Drag & drop a file here, or click to select</p>
        <p className="text-sm text-[#78B9B5]">
          Share any file with your peers securely
        </p>
      </div>
    </div>
  );
}
