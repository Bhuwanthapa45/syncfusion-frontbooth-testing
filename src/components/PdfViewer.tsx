import React, { useRef, useEffect } from 'react';
import { 
  PdfViewerComponent, Toolbar, Magnification, Navigation, 
  LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, 
  TextSearch, Annotation, FormFields, FormDesigner, Inject 
} from '@syncfusion/ej2-react-pdfviewer';

import type { ToolbarSettingsModel } from '@syncfusion/ej2-react-pdfviewer';

const RESOURCE_URL = 'https://cdn.syncfusion.com/ej2/32.1.19/dist/ej2-pdfviewer-lib';

interface PdfViewerProps {
  file: File;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const viewerRef = useRef<PdfViewerComponent>(null);

  const toolbarSettings: ToolbarSettingsModel = {
    toolbarItems: [
      'OpenOption',
      'PageNavigationTool',
      'MagnificationTool',
      'PanTool',
      'SelectionTool',
      'SearchOption',
      'PrintOption',
      'DownloadOption',
      'UndoRedoTool',
      'AnnotationEditTool',
      'FormDesignerEditTool',
      'CommentTool',
      'SubmitForm',
      'RedactionEditTool' 
    ]
  };

  useEffect(() => {
    if (viewerRef.current && file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        
        setTimeout(() => {
          if (viewerRef.current) {
             viewerRef.current.load(base64, "");
             
             // Set default settings for new redactions
             viewerRef.current.redactionSettings = {
                fillColor: '#000000',
                overlayText: 'CONFIDENTIAL',
                fontColor: '#FFFFFF',
                fontSize: 10,
                markerBorderColor: 'red',
             };
          }
      }, 200);
      };
    }
  }, [file]);

  const handleAddRedaction = () => {
    if (viewerRef.current) {
      // Adds a specific box annotation programmatically
      viewerRef.current.annotation.addAnnotation('Redaction', {
        bound: { x: 100, y: 100, width: 200, height: 50 },
        pageNumber: 1,
        overlayText: 'SENSITIVE DATA',
        fillColor: '#000000',
        fontColor: '#FFFFFF',
        author: 'System', 
        subject: 'Redaction'
      } as any); 
    }
  };

  const handleApplyRedaction = () => {
    if (viewerRef.current) {
      // Permanently burns the redaction into the PDF
      viewerRef.current.annotation.redact();
    }
  };

  const handleDownload = () => {
    viewerRef.current?.download();
  };

  return (
    <div style={{ height: '100%', display:'flex', flexDirection:'column' }}>
      
      <div style={{ padding: '10px', background: '#f4f4f4', display:'flex', gap:'10px', flexWrap:'wrap', borderBottom:'1px solid #ddd' }}>
         <button className="btn btn-primary" onClick={handleDownload}>
            Download PDF
         </button>
         
         <div style={{width:'1px', background:'#ccc', margin:'0 10px'}}></div>
         
         <span style={{alignSelf:'center', fontWeight:'bold', fontSize:'0.8rem'}}>Redaction Controls:</span>
         
         {/* Button to programmatically add a specific box */}
         <button className="btn btn-secondary" style={{fontSize:'0.8rem'}} onClick={handleAddRedaction}>
            + Add Box (100,100)
         </button>
         
         {/* 'Apply' button to finalize redactions */}
         <button 
            className="btn btn-primary" 
            style={{backgroundColor: '#d32f2f', color:'white'}} 
            onClick={handleApplyRedaction}
         >
            ⚠️ Apply (Burn)
         </button>
      </div>

      <div style={{ flex: 1, overflow:'hidden' }}>
        <PdfViewerComponent
          ref={viewerRef}
          id="container"
          resourceUrl={RESOURCE_URL}
          style={{ height: '100%' }}
          enableToolbar={true}
          toolbarSettings={toolbarSettings} 
          enableAnnotation={true}
          enableFormDesigner={true}
          enableTextSearch={true}
          enableTextSelection={true}
        >
          <Inject services={[
            Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, 
            ThumbnailView, Print, TextSelection, TextSearch, Annotation, 
            FormFields, FormDesigner
          ]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
};

export default PdfViewer;