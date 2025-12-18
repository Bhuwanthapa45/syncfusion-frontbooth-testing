import React, { useRef, useEffect } from 'react';
import { 
  PdfViewerComponent, Toolbar, Magnification, Navigation, 
  LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, 
  TextSearch, Annotation, FormFields, FormDesigner, Inject 
} from '@syncfusion/ej2-react-pdfviewer';

const RESOURCE_URL = 'https://cdn.syncfusion.com/ej2/32.1.19/dist/ej2-pdfviewer-lib';


interface PdfViewerProps {
  file: File;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const viewerRef = useRef<PdfViewerComponent>(null);

  useEffect(() => {
    if (viewerRef.current && file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        
        setTimeout(() => {
          if (viewerRef.current) {
             viewerRef.current.load(base64, "");
          }
      }, 200);
      };
    }
  }, [file]);

  const handleDownload = () => {
    viewerRef.current?.download();
  };

  return (
    <div style={{ height: '100%' }}>
      <div style={{ padding: '10px', background: '#eee' }}>
         <button className="btn btn-primary" onClick={handleDownload}>Save/Download PDF</button>
      </div>
      <PdfViewerComponent
        ref={viewerRef}
        id="container"
        resourceUrl={RESOURCE_URL}
        style={{ height: 'calc(100% - 50px)' }}
        enableToolbar={true}
        enableAnnotation={true}
        enableFormDesigner={true}
      >
        <Inject services={[
          Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, 
          ThumbnailView, Print, TextSelection, TextSearch, Annotation, 
          FormFields, FormDesigner
        ]} />
      </PdfViewerComponent>
    </div>
  );
};

export default PdfViewer;



