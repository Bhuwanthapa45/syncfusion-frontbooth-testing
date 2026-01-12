import React, { useEffect, useState } from 'react';
import PdfViewer from './PdfViewer';

interface PptViewerProps {
  file: File;
}

const PptViewer: React.FC<PptViewerProps> = ({ file }) => {
  const [convertedPdf, setConvertedPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  

    const simulateBackendConversion = async () => {
      setLoading(true);
      
      // MOCK: In a real app, fetch from your API here.
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/ppt-to-pdf', { method: 'POST', body: formData });
      // const blob = await response.blob();
      
      console.log("Simulating backend conversion for:", file.name);

      // For this demo, we can't actually convert client-side. 
      // We will stop loading to show the UI state.
      setTimeout(() => {
        setLoading(false);
        // If you have a real backend, setConvertedPdf(blob) here.
      }, 1500);
    };

    simulateBackendConversion();
  }, [file]);

  if (loading) {
    return (
      <div style={{ 
        height: '100%', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', color: '#666' 
      }}>
        <div className="spinner" style={{ marginBottom: '10px' }}>🔄</div>
        <h3>Converting PowerPoint to PDF...</h3>
        <p>This requires a backend service.</p>
      </div>
    );
  }

  if (!convertedPdf) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <h3>Architecture Limitation</h3>
        <p>Syncfusion does not support direct client-side PowerPoint viewing.</p>
        <p><strong>To make this work:</strong></p>
        <ul style={{ display: 'inline-block', textAlign: 'left' }}>
          <li>Send <code>{file.name}</code> to your .NET/Node.js backend.</li>
          <li>Use <code>Syncfusion.PresentationRenderer</code> to convert PPTX → PDF.</li>
          <li>Return the PDF stream to this component.</li>
        </ul>
        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
             No real backend detected in this demo environment.
        </div>
      </div>
    );
  }

 
  return <PdfViewer file={convertedPdf} />;
};

export default PptViewer;