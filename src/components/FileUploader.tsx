import React, { useRef } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className="uploader-wrapper"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%',
        border: '2px dashed #ccc', borderRadius: '8px', margin: '20px', backgroundColor: '#fafafa'
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div style={{ textAlign: 'center' }}>
        <h3>Drag & Drop files here</h3>
        <p>Supports PDF, Word, Excel, Images, PPT, Audio, Video</p>
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>
          Browse Files
        </button>
        <input 
          type="file" 
          ref={inputRef} 
          style={{ display: 'none' }} 
          onChange={handleChange} 
          accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.ppt,.pptx,.potx,.mp4,.webm,.mp3,.wav"
        />
      </div>
    </div>
  );
};

export default FileUploader;
