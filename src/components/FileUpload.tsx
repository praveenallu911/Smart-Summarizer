import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import type { SummaryResponse } from '../types/summary';

const FileUpload: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    try {
      const res = await axios.post<SummaryResponse>(
        'http://localhost:5000/api/summarize',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (res.data.success) {
        navigate('/summary', { state: { summary: res.data.summary } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading the file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Smart Summarizer</h2>
          <p className="mt-2 text-sm text-gray-600">Upload your PDF document for a quick summary</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                {pdfFile ? pdfFile.name : 'Select a PDF file'}
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!pdfFile || isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Upload & Summarize'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;