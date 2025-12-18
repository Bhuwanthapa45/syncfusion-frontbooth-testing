import React, { useRef, useEffect, useState } from 'react';

interface ImageAnnotatorProps {
  file: File;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({ file }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Load Image
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Fit canvas to image but limit max width for UI
      const maxWidth = 1000;
      const scale = Math.min(maxWidth / img.width, 1);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        // Setup drawing style
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4 / scale; // Adjust width based on scale
        contextRef.current = ctx;
        // Reset scale for drawing
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Redraw at canvas size
        
        // Re-apply styles after reset
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
      }
    };
  }, [file]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `annotated_${file.name}`;
      link.href = canvas.toDataURL('image/jpeg', 0.8);
      link.click();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
        <span>Freehand Drawing (Red Pen)</span>
        <button className="btn btn-primary" onClick={handleDownload}>Download Image</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', background: '#333', padding: '20px' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          style={{ cursor: 'crosshair', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
        />
      </div>
    </div>
  );
};

export default ImageAnnotator;

