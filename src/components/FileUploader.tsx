import React, { useRef } from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void; 
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Convert FileList to Array
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
  };

  return (
    <div 
      className="uploader-wrapper"
      style={{
        border: '2px dashed #ccc', borderRadius: '8px', padding: '20px',
        backgroundColor: '#fafafa', textAlign: 'center', cursor: 'pointer'
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <h3 style={{ color: '#004F77' }}>Drag & Drop or Click to Upload</h3>
      <p style={{ color: '#004F77' }}>Upload multiple files.</p>
      
      <input 
        type="file" 
        multiple
        ref={inputRef} 
        style={{ display: 'none' }} 
        onChange={handleChange} 
        accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.ppt,.pptx,.mp4,.webm,.mp3"
      />
    </div>
  );
};

export default FileUploader;