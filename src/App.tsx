import { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList'; 

// Viewers
import PdfViewer from './components/PdfViewer';
import DocEditor from './components/DocEditor';
import SpreadsheetViewer from './components/SpreadsheetViewer';
import ImageAnnotator from './components/ImageAnnotator';
import PptViewer from './components/PptViewer'; 
import MediaPlayer from './components/MediaPlayer'; 

import { getFileType } from './utils/fileHelpers';

function App() {
  // STATE 1: List of all files
  const [files, setFiles] = useState<File[]>([]);
  
  // STATE 2: The single file currently being viewed (if any)
  const [activeFile, setActiveFile] = useState<File | null>(null);

  // 1. Handle adding new files to the list
  const handleFilesSelected = (newFiles: File[]) => {
    // Append new files to existing list
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // 2. Handle removing a file from the list
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    // If we removed the currently open file, close the viewer
    if (activeFile === files[indexToRemove]) {
      setActiveFile(null);
    }
  };

  // 3. Render the correct viewer based on activeFile type
  const renderViewer = () => {
    if (!activeFile) return null;

    const type = getFileType(activeFile.name);

    switch (type) {
      case 'PDF': return <PdfViewer file={activeFile} />;
      case 'WORD': return <DocEditor file={activeFile} />;
      case 'EXCEL': return <SpreadsheetViewer file={activeFile} />;
      case 'IMAGE': return <ImageAnnotator file={activeFile} />;
      case 'POWERPOINT': return <PptViewer file={activeFile} />;
      case 'VIDEO': return <MediaPlayer file={activeFile} type="VIDEO" />;
      case 'AUDIO': return <MediaPlayer file={activeFile} type="AUDIO" />;
      default: return <div className="p-4 text-center">Unsupported File Type</div>;
    }
  };

  return (
    <div className="app-container">
      
      <header className="toolbar">
        <h2 style={{ margin: 0, color:'#004F77' }}>Frontbooth Document Manager</h2>
        
        {activeFile && (
          <button 
            className="btn btn-secondary" 
             style={{ backgroundColor: '#FFC106', color: '#004F77' }}
            onClick={() => setActiveFile(null)} // Close viewer logic
          >
            ← Back to File List
          </button>
        )}
      </header>

      
      <main className="viewer-container" style={{ padding: '20px', overflowY: 'auto' }}>
        
        {/* VIEW 1: If NO file is active, show Uploader + List */}
        {!activeFile ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <FileUploader onFilesSelected={handleFilesSelected} />
            <FileList 
              files={files} 
              onView={(file) => setActiveFile(file)} 
              onRemove={handleRemoveFile} 
            />
          </div>
        ) : (
          /* VIEW 2: If a file IS active, show the Viewer component */
          <div style={{ height: '100%' }}>
             {renderViewer()}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;