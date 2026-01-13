import React from 'react';
import { getFileType } from '../utils/fileHelpers';

interface FileListProps {
  files: File[];
  onView: (file: File) => void;
  onRemove: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onView, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        Uploaded Documents ({files.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`} 
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 15px', background: 'white', 
              border: '1px solid #eee', borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Simple File Icon based on type */}
              <span style={{ 
                fontWeight: 'bold', fontSize: '0.8rem', padding: '4px 8px', 
                borderRadius: '4px', background: '#e3f2fd', color: '#0288d1' 
              }}>
                {getFileType(file.name)}
              </span>
              <span style={{ fontWeight: 500 }}>{file.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => onView(file)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '5px 12px', backgroundColor: '#FFC106', color: '#004F77' }}
              >
                 View File
              </button>
              <button 
                onClick={() => onRemove(index)}
                style={{ 
                  background: 'transparent', border: '1px solid #ffcdd2', 
                  color: '#c62828', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' 
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
