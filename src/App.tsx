import { useState, useEffect } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList'; 
import { storeFile, getFileFromDB } from './utils/db';
// Viewers
import PdfViewer from './components/PdfViewer';
import DocEditor from './components/DocEditor';
import SpreadsheetViewer from './components/SpreadsheetViewer';
import ImageAnnotator from './components/ImageAnnotator';
import PptViewer from './components/PptViewer'; 
import MediaPlayer from './components/MediaPlayer'; 
import { getFileType } from './utils/fileHelpers';

// Interface to track ID along with the File
interface AppFile {
  id: string;
  file: File;
}

function App() {
  const [files, setFiles] = useState<AppFile[]>([]);
  
  // Viewer Mode State
  const [isViewerMode, setIsViewerMode] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. INITIALIZATION
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const fileId = params.get('fileId');

    if (mode === 'view' && fileId) {
      setIsViewerMode(true);
      setActiveFileId(fileId);

      const storedPlaylist = localStorage.getItem('doc_playlist');
      if (storedPlaylist) {
        setPlaylist(JSON.parse(storedPlaylist));
      }
    }
  }, []);

  // Effect to load file whenever activeFileId changes
  useEffect(() => {
    if (isViewerMode && activeFileId) {
      setLoading(true);
      getFileFromDB(activeFileId)
        .then((file) => {
          if (file) {
            setViewerFile(file);
            setError(null);
          } else {
            setError("File not found in database.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load file.");
          setLoading(false);
        });
    }
  }, [activeFileId, isViewerMode]);


  // 2. ACTION: Prepare Data & Open New Window
  const handleOpenFile = async (selectedFileObj: AppFile) => {
    try {
      // A. Store ALL files to IndexedDB (Batch Save)
      const savePromises = files.map(f => storeFile(f.file, f.id));
      await Promise.all(savePromises);

      // B. Save the order (Playlist) to LocalStorage
      const idList = files.map(f => f.id);
      localStorage.setItem('doc_playlist', JSON.stringify(idList));
      
      // C. Construct URL
      const newTabUrl = `${window.location.origin}/?mode=view&fileId=${selectedFileObj.id}`;

      // --- CHANGE START: STRONGEST "FORCE WINDOW" LOGIC ---
      
      // 1. Calculate Dimensions (85% of screen to ensure it fits and triggers popup logic)
      const w = Math.floor(window.screen.availWidth * 0.85);
      const h = Math.floor(window.screen.availHeight * 0.85);
      
      // 2. Calculate Center Position
      const left = Math.floor((window.screen.availWidth - w) / 2);
      const top = Math.floor((window.screen.availHeight - h) / 2);

      // 3. Define Window Features
      // We combine 'popup=yes' (Chrome/Edge) with explicit dimensions and '0' for UI elements
      const features = [
        'popup=yes',
        `width=${w}`,
        `height=${h}`,
        `top=${top}`,
        `left=${left}`,
        'toolbar=0',
        'location=0',
        'status=0',
        'menubar=0',
        'scrollbars=1',
        'resizable=1'
      ].join(',');

      // 4. Open Window
      const newWindow = window.open(newTabUrl, '_blank', features);
      // const newWindow = window.open(newTabUrl, "_blank", "width=900,height=600,resizable=yes,scrollbars=yes")
      
      // Fallback: If browser blocked the popup or forced a tab, focus it
      if (newWindow) {
        newWindow.focus();
      }
      
     

    } catch (err) {
      console.error(err);
      alert("Failed to prepare files for viewing.");
    }
  };

  const handleFilesSelected = (newFiles: File[]) => {
    const newAppFiles = newFiles.map(f => ({
      id: crypto.randomUUID(),
      file: f
    }));
    setFiles((prev) => [...prev, ...newAppFiles]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleNext = () => {
    if (!activeFileId) return;
    const currentIndex = playlist.indexOf(activeFileId);
    if (currentIndex < playlist.length - 1) {
      setActiveFileId(playlist[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!activeFileId) return;
    const currentIndex = playlist.indexOf(activeFileId);
    if (currentIndex > 0) {
      setActiveFileId(playlist[currentIndex - 1]);
    }
  };

  const renderViewer = (file: File) => {
    const type = getFileType(file.name);
    switch (type) {
      case 'PDF': return <PdfViewer file={file} />;
      case 'WORD': return <DocEditor file={file} />;
      case 'EXCEL': return <SpreadsheetViewer file={file} />;
      case 'IMAGE': return <ImageAnnotator file={file} />;
      case 'POWERPOINT': return <PptViewer file={file} />;
      case 'VIDEO': return <MediaPlayer file={file} type="VIDEO" />;
      case 'AUDIO': return <MediaPlayer file={file} type="AUDIO" />;
      default: return <div className="p-4 text-center">Unsupported File Type</div>;
    }
  };

  // --- BRANCH 1: VIEWER MODE (New Window) ---
  if (isViewerMode) {
    const currentIndex = activeFileId ? playlist.indexOf(activeFileId) : -1;
    const totalFiles = playlist.length;

    if (loading && !viewerFile) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Document...</div>;
    if (error) return <div style={{padding: '20px', color: 'red', fontWeight: 'bold'}}>{error}</div>;

    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: 0 }}>
        
        <header style={{ 
          padding: '10px 20px', background: '#f8f9fa', borderBottom: '1px solid #ddd', 
          flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#004F77', fontSize: '1.1rem' }}>
            {viewerFile ? viewerFile.name : 'Document Viewer'}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              className="btn btn-secondary"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              style={{ opacity: currentIndex <= 0 ? 0.5 : 1 ,
                backgroundColor: '#FFC106', color: '#004F77'
              }}
            >
              ← Previous
            </button>

            <span style={{ fontWeight: 'bold', color: '#004F77' }}>
              {currentIndex + 1} / {totalFiles}
            </span>

            <button 
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={currentIndex >= totalFiles - 1}
              style={{ opacity: currentIndex >= totalFiles - 1 ? 0.5 : 1 ,
                backgroundColor: '#FFC106', color: '#004F77'
              }}
            >
              Next →
            </button>
          </div>
        </header>
        
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {viewerFile && renderViewer(viewerFile)}
        </div>
      </div>
    );
  }

  // --- BRANCH 2: DASHBOARD MODE ---
  return (
    <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="toolbar">
        <h2 style={{ margin: 0, color:'#004F77' }}>Frontbooth Document Manager</h2>
      </header>

      <main className="viewer-container" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FileUploader onFilesSelected={handleFilesSelected} />
          
          <FileList 
            files={files.map(f => f.file)} 
            onView={(file) => {
              const appFile = files.find(f => f.file === file);
              if (appFile) handleOpenFile(appFile);
            }} 
            onRemove={handleRemoveFile} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;



