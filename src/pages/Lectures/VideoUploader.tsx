import React, { useState, ChangeEvent } from 'react';

const VideoUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/upload', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        alert('Upload complete');
      } else {
        alert('Upload failed');
      }
    };

    xhr.send(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Video Uploader
        </h2>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        {file && (
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{file.name}</span>
              <span className="text-gray-600">
                {uploadProgress.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        <button
          onClick={handleUpload}
          type="button"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default VideoUploader;
