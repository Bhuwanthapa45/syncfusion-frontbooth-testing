// import React, { useRef, useEffect } from 'react';
// import { 
//   DocumentEditorContainerComponent, Toolbar, Inject 
// } from '@syncfusion/ej2-react-documenteditor';

// // Public Service URL required to parse .docx files on the fly
// const SERVICE_URL = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

// interface DocEditorProps {
//   file: File;
// }

// const DocEditor: React.FC<DocEditorProps> = ({ file }) => {
//   const containerRef = useRef<DocumentEditorContainerComponent>(null);

//   useEffect(() => {
//     if (containerRef.current && file) {
      
//       const reader = new FileReader();
//       reader.readAsDataURL(file); 
     
//       setTimeout(() => {
//           containerRef.current?.documentEditor.open(file);
//       }, 500);
//     }
//   }, [file]);

//   const handleDownload = () => {
//     // Saves as Dotx by default, can be changed to Docx
//     containerRef.current?.documentEditor.save(file.name || 'document', 'Docx');
//   };

//   return (
//     <div style={{ height: '100%' }}>
//       <div style={{ padding: '10px', background: '#eee', display: 'flex', gap: '10px' }}>
//         <button className="btn btn-primary" onClick={handleDownload}>Download .DOCX</button>
//       </div>
//       <DocumentEditorContainerComponent
//         ref={containerRef}
//         id="doc-editor"
//         // style={{ height: 'calc(100% - 50px)' }}
//         style={{ height: '100%' }}
//         serviceUrl={SERVICE_URL}
//         enableToolbar={true}
//       >
//         <Inject services={[Toolbar]} />
//       </DocumentEditorContainerComponent>
//     </div>
//   );
// };

// export default DocEditor;
import React, { useRef, useEffect } from 'react';
import { 
  DocumentEditorContainerComponent, Toolbar, Inject 
} from '@syncfusion/ej2-react-documenteditor';

// This is the standard production demo service
const SERVICE_URL = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';

interface DocEditorProps {
  file: File;
}

const DocEditor: React.FC<DocEditorProps> = ({ file }) => {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);

  useEffect(() => {
    // Open the file when the component mounts or file changes
    if (containerRef.current && file) {
      // Small timeout to ensure the component is rendered before opening
      setTimeout(() => {
          containerRef.current?.documentEditor.open(file);
      }, 100);
    }
  }, [file]);

  const handleDownload = () => {
    containerRef.current?.documentEditor.save(file.name || 'document', 'Docx');
  };

  return (
    // 1. FLEX CONTAINER: Forces the layout to fill 100% of the parent
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* 2. HEADER: Takes up only the space it needs */}
      <div style={{ padding: '10px', background: '#eee', flexShrink: 0 }}>
        <button className="btn btn-primary" onClick={handleDownload}>
            Download .DOCX
        </button>
      </div>

      {/* 3. EDITOR WRAPPER: 'flex: 1' makes it expand to fill all remaining space */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <DocumentEditorContainerComponent
          ref={containerRef}
          id="doc-editor"
          height="100%"    // Important: Tell the component to fill the wrapper
          width="100%"     // Important: Tell the component to fill the width
          serviceUrl={SERVICE_URL}
          enableToolbar={true}
        >
          <Inject services={[Toolbar]} />
        </DocumentEditorContainerComponent>
      </div>
    </div>
  );
};

export default DocEditor;
