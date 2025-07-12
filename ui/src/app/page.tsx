'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import InviteCode from '@/components/InviteCode';
import axios from 'axios';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [port, setPort] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setPort(response.data.port);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDownload = async (port: number) => {
    setIsDownloading(true);
    
    try {
      // Request download from Java backend
      const response = await axios.get(`/api/download/${port}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Try to get filename from response headers
      // Axios normalizes headers to lowercase, but we need to handle different cases
      const headers = response.headers;
      let contentDisposition = '';
      
      // Look for content-disposition header regardless of case
      for (const key in headers) {
        if (key.toLowerCase() === 'content-disposition') {
          contentDisposition = headers[key];
          break;
        }
      }
      
      let filename = 'downloaded-file';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please check the invite code and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#0F828C] mb-2 drop-shadow-lg">SnapSend</h1>
        <p className="text-xl text-[#0F828C] font-semibold">Secure File Sharing</p>
      </header>
      
      <div className="bg-[#0F828C]/10 rounded-lg shadow-lg p-6 border border-[#78B9B5]">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium transition-colors duration-150 ${
              activeTab === 'upload'
                ? 'text-[#0F828C] border-b-2 border-[#0F828C] bg-[#DCD0A8]/40'
                : 'text-[#78B9B5] hover:text-[#0F828C]'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Share a File
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors duration-150 ${
              activeTab === 'download'
                ? 'text-[#0F828C] border-b-2 border-[#0F828C] bg-[#DCD0A8]/40'
                : 'text-[#78B9B5] hover:text-[#0F828C]'
            }`}
            onClick={() => setActiveTab('download')}
          >
            Receive a File
          </button>
        </div>
        
        {activeTab === 'upload' ? (
          <div>
            <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
            
            {uploadedFile && !isUploading && (
              <div className="mt-4 p-3 bg-[#DCD0A8]/30 rounded-md">
                <p className="text-sm text-[#0F828C]">
                  Selected file: <span className="font-medium">{uploadedFile.name}</span> ({Math.round(uploadedFile.size / 1024)} KB)
                </p>
              </div>
            )}
            
            {isUploading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0F828C] border-t-transparent"></div>
                <p className="mt-2 text-[#78B9B5]">Uploading file...</p>
              </div>
            )}
            
            <InviteCode port={port} />
          </div>
        ) : (
          <div>
            <FileDownload onDownload={handleDownload} isDownloading={isDownloading} />
            
            {isDownloading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0F828C] border-t-transparent"></div>
                <p className="mt-2 text-[#78B9B5]">Downloading file...</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-center text-[#0F828C] text-sm">
        <p>SnapSend &copy; {new Date().getFullYear()} - Secure File Sharing</p>
      </footer>
    </div>
  );
}
