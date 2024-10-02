import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Upload, X } from 'lucide-react';

export default function FileUpload({ onFileUpload, onClose }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
      onClose();
    }
  };

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Upload File</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-2"
      />
      <Button onClick={handleUpload} disabled={!file}>
        <Upload className="h-4 w-4 mr-1" /> Upload
      </Button>
    </div>
  );
}
