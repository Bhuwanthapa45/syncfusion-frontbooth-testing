import React, { useRef, useEffect } from 'react';
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';

// Public Service URL for import/export capabilities
const SERVICE_URL = 'https://services.syncfusion.com/react/production/api/spreadsheet';

interface SpreadsheetProps {
  file: File;
}

const SpreadsheetViewer: React.FC<SpreadsheetProps> = ({ file }) => {
  const spreadsheetRef = useRef<SpreadsheetComponent>(null);

  useEffect(() => {
    if (spreadsheetRef.current && file) {
        // Syncfusion Spreadsheet open method accepts { file: File }
        spreadsheetRef.current.open({ file: file });
    }
  }, [file]);

  const handleSave = () => {
    spreadsheetRef.current?.save({ 
        url: `${SERVICE_URL}/save`,
        fileName: file.name || 'spreadsheet',
        saveType: 'Xlsx'
    });
  };

  return (
    <div style={{ height: '100%' }}>
      <div style={{ padding: '10px', background: '#eee' }}>
         <button className="btn btn-primary" onClick={handleSave}>Download Excel</button>
      </div>
      <SpreadsheetComponent
        ref={spreadsheetRef}
        openUrl={`${SERVICE_URL}/open`}
        saveUrl={`${SERVICE_URL}/save`}
        style={{ height: 'calc(100% - 50px)' }}
      />
    </div>
  );
};

export default SpreadsheetViewer;
