import React, { useEffect, useRef, useState } from 'react';

interface MediaPlayerProps {
  file: File;
  type: 'VIDEO' | 'AUDIO';
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ file, type }) => {
  const mediaRef = useRef<HTMLMediaElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
    
      const url = URL.createObjectURL(file);
      setObjectUrl(url);

      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (!objectUrl) return null;

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#FFFFFF' 
    }}>
      
     
      <div style={{ 
        width: '100%', padding: '10px', background: '#004F77', color: '#FFFFFF', 
        display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box'
      }}>
        <span>Now Playing: {file.name}</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{type} Player</span>
      </div>

      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        
        {type === 'VIDEO' ? (
          <video 
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={objectUrl} 
            controls 
            autoPlay 
            style={{ maxWidth: '100%', maxHeight: '80vh', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div style={{ 
            padding: '40px', background: '#222', borderRadius: '10px', 
            textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
          }}>
            {/* Visual Icon for Audio */}
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎵</div>
            <audio 
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              src={objectUrl} 
              controls 
              autoPlay
              style={{ width: '300px' }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

      </div>
    </div>
  );
};

export default MediaPlayer;
