import { useEffect, useRef, useState } from 'react';
import { compileAndRender } from '../../utils/shaderRunner';

const ShaderRenderer = ({ shaderCode, canvasId = 'webgl-canvas' }) => {
  const canvasRef = useRef(null);
  const renderRef = useRef(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [webglSupported, setWebglSupported] = useState(null);

  // Test WebGL support on mount
  useEffect(() => {
    const testWebGL = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const supported = !!gl;
      console.log('WebGL support test:', supported);
      setWebglSupported(supported);
      return supported;
    };
    
    testWebGL();
  }, []);

  useEffect(() => {
    console.log('ShaderRenderer received shaderCode:', shaderCode);
    console.log('ShaderCode length:', shaderCode ? shaderCode.length : 0);
    console.log('ShaderCode trimmed:', shaderCode ? shaderCode.trim() : '');
    console.log('WebGL supported:', webglSupported);
    
    if (!shaderCode || !shaderCode.trim()) {
      console.log('No shader code available, skipping render');
      setPreviewFailed(false); // Clear error when no shader code
      return;
    }

    if (webglSupported === false) {
      console.error('WebGL not supported in this browser');
      setPreviewFailed(true);
      return;
    }

    const renderShader = async () => {
      try {
        // Stop any existing render loop
        if (renderRef.current) {
          renderRef.current = false;
        }

        // Start new render loop
        renderRef.current = true;
        setPreviewFailed(false);
        
        console.log('Rendering shader with code:', shaderCode);
        await compileAndRender(shaderCode, canvasId);
      } catch (error) {
        console.error('Shader render error:', error);
        setPreviewFailed(true);
      }
    };

    // Add a small delay to ensure everything is properly initialized
    const timer = setTimeout(renderShader, 50);
    
    return () => {
      clearTimeout(timer);
      renderRef.current = false;
    };
  }, [shaderCode, canvasId, webglSupported]);

  const handleCloseError = () => {
    setPreviewFailed(false);
  };

  return (
    <>
      {previewFailed && shaderCode && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '80vw',
          maxHeight: '80vh',
          overflow: 'auto',
          zIndex: 1000,
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          border: '1px solid #333',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            borderBottom: '1px solid #333',
            paddingBottom: '10px'
          }}>
            <h3 style={{ margin: 0, color: '#ff6b6b' }}>
              {webglSupported === false ? 'WebGL Not Supported' : 'Shader Preview Failed'}
            </h3>
            <button
              onClick={handleCloseError}
              style={{
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.target.style.background = '#ff5252'}
              onMouseOut={(e) => e.target.style.background = '#ff6b6b'}
            >
              ✕ Close
            </button>
          </div>
          <div style={{ 
            border: '1px solid #333', 
            padding: '15px', 
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.3)',
            maxHeight: '60vh',
            overflow: 'auto'
          }}>
            {shaderCode}
          </div>
          <div style={{
            marginTop: '15px',
            fontSize: '11px',
            color: '#aaa',
            textAlign: 'center'
          }}>
            Click "Close" to dismiss this error and try generating a new shader
          </div>
        </div>
      )}
    </>
  );
};

export default ShaderRenderer; 