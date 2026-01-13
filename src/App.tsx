// import { useState } from 'react';
// import './App.css';
// import FileUploader from './components/FileUploader';
// import FileList from './components/FileList'; 

// // Viewers
// import PdfViewer from './components/PdfViewer';
// import DocEditor from './components/DocEditor';
// import SpreadsheetViewer from './components/SpreadsheetViewer';
// import ImageAnnotator from './components/ImageAnnotator';
// import PptViewer from './components/PptViewer'; 
// import MediaPlayer from './components/MediaPlayer'; 

// import { getFileType } from './utils/fileHelpers';

// function App() {
//   // STATE 1: List of all files
//   const [files, setFiles] = useState<File[]>([]);
  
//   // STATE 2: The single file currently being viewed (if any)
//   const [activeFile, setActiveFile] = useState<File | null>(null);

//   // 1. Handle adding new files to the list
//   const handleFilesSelected = (newFiles: File[]) => {
//     // Append new files to existing list
//     setFiles((prev) => [...prev, ...newFiles]);
//   };

//   // 2. Handle removing a file from the list
//   const handleRemoveFile = (indexToRemove: number) => {
//     setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
//     // If we removed the currently open file, close the viewer
//     if (activeFile === files[indexToRemove]) {
//       setActiveFile(null);
//     }
//   };

//   // 3. Render the correct viewer based on activeFile type
//   const renderViewer = () => {
//     if (!activeFile) return null;

//     const type = getFileType(activeFile.name);

//     switch (type) {
//       case 'PDF': return <PdfViewer file={activeFile} />;
//       case 'WORD': return <DocEditor file={activeFile} />;
//       case 'EXCEL': return <SpreadsheetViewer file={activeFile} />;
//       case 'IMAGE': return <ImageAnnotator file={activeFile} />;
//       case 'POWERPOINT': return <PptViewer file={activeFile} />;
//       case 'VIDEO': return <MediaPlayer file={activeFile} type="VIDEO" />;
//       case 'AUDIO': return <MediaPlayer file={activeFile} type="AUDIO" />;
//       default: return <div className="p-4 text-center">Unsupported File Type</div>;
//     }
//   };

//   return (
//     <div className="app-container">
      
//       <header className="toolbar">
//         <h2 style={{ margin: 0, color:'#004F77' }}>Frontbooth Document Manager</h2>
        
//         {activeFile && (
//           <button 
//             className="btn btn-secondary" 
//              style={{ backgroundColor: '#FFC106', color: '#004F77' }}
//             onClick={() => setActiveFile(null)} // Close viewer logic
//           >
//             ← Back to File List
//           </button>
//         )}
//       </header>

      
//       <main className="viewer-container" style={{ padding: '20px', overflowY: 'auto' }}>
        
//         {/* VIEW 1: If NO file is active, show Uploader + List */}
//         {!activeFile ? (
//           <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//             <FileUploader onFilesSelected={handleFilesSelected} />
//             <FileList 
//               files={files} 
//               onView={(file) => setActiveFile(file)} 
//               onRemove={handleRemoveFile} 
//             />
//           </div>
//         ) : (
//           /* VIEW 2: If a file IS active, show the Viewer component */
//           <div style={{ height: '100%' }}>
//              {renderViewer()}
//           </div>
//         )}

//       </main>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList'; 
import { storeFile, getFileFromDB } from './utils/db'; // Import DB helpers

// Viewers (Keep existing imports)
import PdfViewer from './components/PdfViewer';
import DocEditor from './components/DocEditor';
import SpreadsheetViewer from './components/SpreadsheetViewer';
import ImageAnnotator from './components/ImageAnnotator';
import PptViewer from './components/PptViewer'; 
import MediaPlayer from './components/MediaPlayer'; 
import { getFileType } from './utils/fileHelpers';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  
  // Viewer Mode State
  const [isViewerMode, setIsViewerMode] = useState(false);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. INITIALIZATION
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const fileId = params.get('fileId'); // We now look for an ID, not a URL

    if (mode === 'view' && fileId) {
      setIsViewerMode(true);
      setLoading(true);

      // Load from IndexedDB
      getFileFromDB(fileId)
        .then((file) => {
          if (file) {
            setViewerFile(file);
          } else {
            setError("File not found or expired.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load file database.");
          setLoading(false);
        });
    }
  }, []);

  // 2. ACTION: Store File & Open New Tab
  const handleOpenFile = async (file: File) => {
    try {
      // Save file to IndexedDB first
      const fileId = await storeFile(file);
      
      // Open new tab with the ID
      const newTabUrl = `${window.location.origin}/?mode=view&fileId=${fileId}`;
      window.open(newTabUrl, '_blank');
    } catch (err) {
      alert("Failed to prepare file for viewing.");
    }
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 3. RENDER VIEWER (Keep existing logic)
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

  // --- BRANCH 1: VIEWER MODE ---
//   if (isViewerMode) {
//     if (loading) return <div className="flex h-screen items-center justify-center">Loading Document from Database...</div>;
    
//     if (error || !viewerFile) return <div className="p-10 text-red-600 font-bold">{error || "File not found"}</div>;

//     return (
//       <div className="h-screen flex flex-col">
//         <header style={{  padding: '10px 20px', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
//           <h3 style={{ margin: 0, color: '#004F77' }}>Viewing: {viewerFile.name}</h3>
//         </header>
//         <div style={{ flex: 1, overflow: 'hidden' }}>
//           {renderViewer(viewerFile)}
//         </div>
//       </div>
//     );
//   }

//   // --- BRANCH 2: DASHBOARD MODE ---
//   return (
//     <div className="app-container">
//       <header className="toolbar">
//         <h2 style={{ margin: 0, color:'#004F77' }}>Frontbooth Document Manager</h2>
//       </header>

//       <main className="viewer-container" style={{ padding: '20px', overflowY: 'auto' }}>
//         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//           <FileUploader onFilesSelected={handleFilesSelected} />
          
//           <FileList 
//             files={files} 
//             onView={handleOpenFile} 
//             onRemove={handleRemoveFile} 
//           />
//         </div>
//       </main>
//     </div>
//   );
// }
// --- BRANCH 1: VIEWER MODE (New Tab) ---
  if (isViewerMode) {
    if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Document...</div>;
    if (error || !viewerFile) return <div style={{padding: '20px', color: 'red', fontWeight: 'bold'}}>{error || "File not found"}</div>;

    return (
      // FIX 1: Apply 'height: 100vh' and 'flex-column' to the root div of the new tab
      // This forces the app to take the exact size of the browser window.
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: 0 }}>
        
        {/* Header - Fixed Height */}
        <header style={{ 
          padding: '10px 20px', background: '#f8f9fa', borderBottom: '1px solid #ddd', 
          flexShrink: 0 // Prevent header from squishing
        }}>
          <h3 style={{ margin: 0, color: '#004F77' }}>Viewing: {viewerFile.name}</h3>
        </header>
        
        {/* Viewer Container - Takes Remaining Space */}
        {/* FIX 2: 'flex: 1' pushes this div to fill all remaining vertical space */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {renderViewer(viewerFile)}
        </div>
      </div>
    );
  }

  // --- BRANCH 2: DASHBOARD MODE ---
  return (
    // Ensure Dashboard also uses full height
    <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="toolbar">
        <h2 style={{ margin: 0, color:'#004F77' }}>Frontbooth Document Manager</h2>
      </header>

      <main className="viewer-container" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FileUploader onFilesSelected={handleFilesSelected} />
          <FileList 
            files={files} 
            onView={handleOpenFile} 
            onRemove={handleRemoveFile} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;