import  { useState } from 'react';
import './App.css';

import FileUploader from './components/FileUploader';
import PdfViewer from './components/PdfViewer';
import DocEditor from './components/DocEditor';
import SpreadsheetViewer from './components/SpreadsheetViewer';
import ImageAnnotator from './components/ImageAnnotator';
import { getFileType, type  FileType } from './utils/fileHelpers';



function App() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>('UNKNOWN');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const type = getFileType(file.name);
    if (type === 'UNKNOWN') {
      setError(`File type not supported: ${file.name}`);
      return;
    }
    setError(null);
    setFileType(type);
    setCurrentFile(file);
  };

  const handleClear = () => {
    setCurrentFile(null);
    setFileType('UNKNOWN');
    setError(null);
  };

  const renderViewer = () => {
    if (!currentFile) return <FileUploader onFileSelect={handleFileSelect} />;

    switch (fileType) {
      case 'PDF':
        return <PdfViewer file={currentFile} />;
      case 'WORD':
        return <DocEditor file={currentFile} />;
      case 'EXCEL':
        return <SpreadsheetViewer file={currentFile} />;
      case 'IMAGE':
        return <ImageAnnotator file={currentFile} />;
      default:
        return <div>Unsupported File</div>;
    }
  };

  return (
    <div className="app-container">
      <header className="toolbar">
        <h2 style={{ margin: 0 }}>Fronthbooth Document Viewer</h2>
        <div>
          {currentFile && (
            <>
              <span style={{ marginRight: '15px', fontSize: '0.9rem' }}>
                Editing: <strong>{currentFile.name}</strong>
              </span>
              <button className="btn btn-secondary" onClick={handleClear}>
                Close / Upload New
              </button>
            </>
          )}
        </div>
      </header>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <main className="viewer-container">
        {renderViewer()}
      </main>
    </div>
  );
}

export default App;
