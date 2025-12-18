// import React, { useRef, useEffect } from 'react';
// import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';

// // Public Service URL for import/export capabilities
// const SERVICE_URL = 'https://services.syncfusion.com/react/production/api/spreadsheet';

// interface SpreadsheetProps {
//   file: File;
// }

// const SpreadsheetViewer: React.FC<SpreadsheetProps> = ({ file }) => {
//   const spreadsheetRef = useRef<SpreadsheetComponent>(null);

//   useEffect(() => {
//     if (spreadsheetRef.current && file) {
       
//         setTimeout(() => {
            
//             if (spreadsheetRef.current) {
//                 spreadsheetRef.current.open({ file: file });
//             }
//         }, 500); 
//     }
//   }, [file]);

//   const handleSave = () => {
//     spreadsheetRef.current?.save({ 
//         url: `${SERVICE_URL}/save`,
//         fileName: file.name || 'spreadsheet',
//         saveType: 'Xlsx'
//     });
//   };

//   return (
//     <div style={{ height: '100%' }}>
//       <div style={{ padding: '10px', background: '#eee' }}>
//          <button className="btn btn-primary" onClick={handleSave}>Download Excel</button>
//       </div>
//       <SpreadsheetComponent
//         ref={spreadsheetRef}
//         openUrl={`${SERVICE_URL}/open`}
//         saveUrl={`${SERVICE_URL}/save`}
//         style={{ height: 'calc(100% - 50px)' }}
//       />
//     </div>
//   );
// };

// export default SpreadsheetViewer;

import React, { useRef, useEffect } from 'react';
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';


const OPEN_URL = 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/open';
const SAVE_URL = 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/save';

interface SpreadsheetProps {
  file: File;
}

const SpreadsheetViewer: React.FC<SpreadsheetProps> = ({ file }) => {
  const spreadsheetRef = useRef<SpreadsheetComponent>(null);

  useEffect(() => {
    if (spreadsheetRef.current && file) {
       
        setTimeout(() => {
            if (spreadsheetRef.current) {
               
                spreadsheetRef.current.open({ file: file });
            }
        }, 200);
    }
  }, [file]);

  const handleSave = () => {
    spreadsheetRef.current?.save({ 
        url: SAVE_URL,
        fileName: file.name || 'Sample',
        saveType: 'Xlsx'
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#eee', display: 'flex', gap: '10px' }}>
         <button className="btn btn-primary" onClick={handleSave}>Download/Save Excel</button>
      </div>
      
      <div style={{ flex: 1, minHeight: 0 }}>
        <SpreadsheetComponent
          ref={spreadsheetRef}
          allowOpen={true} 
          allowSave={true} 
          openUrl={OPEN_URL}
          saveUrl={SAVE_URL}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default SpreadsheetViewer;
