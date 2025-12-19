

import React, { useRef, useEffect } from 'react';
import { ImageEditorComponent } from '@syncfusion/ej2-react-image-editor';
import type { ZoomSettingsModel } from '@syncfusion/ej2-react-image-editor';

interface ImageAnnotatorProps {
  file: File;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({ file }) => {
  const imgEditorRef = useRef<ImageEditorComponent>(null);

  useEffect(() => {
    if (file && imgEditorRef.current) {
      const reader = new FileReader();
      
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        const base64String = reader.result as string;
        setTimeout(() => {
            if (imgEditorRef.current) {
                imgEditorRef.current.open(base64String);
            }
        }, 300); 
      };
    }
  }, [file]);

  const handleDownload = () => {
    if (imgEditorRef.current) {
      
      const fileType = file.type.split('/')[1] || 'png';
      
      
      imgEditorRef.current.export(file.name, fileType as any);
    }
  };


  const zoomSettings: ZoomSettingsModel = {
    maxZoomFactor: 30,
    minZoomFactor: 0.1,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
     
      <div style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>Frontbooths Image Annotator</span>
        <button className="btn btn-primary" onClick={handleDownload}>
          Download / Save Image
        </button>
      </div>

      {/* Editor Container */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <ImageEditorComponent 
          ref={imgEditorRef}
          height="100%"
          width="100%"
          zoomSettings={zoomSettings}
      
          toolbar={[
            'Annotate', 'Pen', 'Text', 'Rectangle', 'Circle', 'Arrow', 'Line', 'Path', 
            'ZoomIn', 'ZoomOut', 'Pan', 'Reset', 
            'Crop', 'Rotate', 'Flip', 
            'Undo', 'Redo', 'Save' 
          ]}
        />
      </div>
    </div>
  );
};

export default ImageAnnotator;
