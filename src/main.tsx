import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { registerLicense } from '@syncfusion/ej2-base';



const licenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY;
if(licenseKey) {
  registerLicense(licenseKey);
}
else{
  console.error('Syncfusion license key not found in .env file or invalid licesnse key')
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)