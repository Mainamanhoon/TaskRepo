import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ShaderMesh from '../components/shader/ShaderMesh';
import './ShaderPage.css';

const ShaderPage = () => {
  const [shaderDescription, setShaderDescription] = useState('');
  const [shaderCode, setShaderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const generateShader = async () => {
    if (!shaderDescription.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate_shader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: shaderDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate shader');
      }

      const data = await response.json();
      setShaderCode(data.shader_code || 'No shader code received');
    } catch (err) {
      setError(err.message);
      setShaderCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shader-page-container">
      <h2>Text-to-Shader Generator</h2>
      
      {/* Text input for shader description */}
      <div className="shader-input">
        <textarea
          value={shaderDescription}
          onChange={(e) => setShaderDescription(e.target.value)}
          placeholder="Describe the shader you want (e.g., 'A rotating cube with a gradient background')"
          className="shader-description-input"
          rows="4"
        />
        <button 
          onClick={generateShader}
          disabled={loading || !shaderDescription.trim()}
          className="generate-shader-button"
        >
          {loading ? 'Generating...' : 'Generate Shader'}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {/* Shader code display */}
      {shaderCode && (
        <div className="shader-code-section">
          <h3>Generated Shader Code:</h3>
          <pre className="shader-code-display">{shaderCode}</pre>
        </div>
      )}

      {/* WebGL Canvas */}
      <div className="canvas-container">
        <h3>Shader Preview:</h3>
        <Canvas>
          <Suspense fallback={<div>Loading...</div>}>
            <ShaderMesh shaderCode={shaderCode} />
          </Suspense>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} />
        </Canvas>
      </div>
    </div>
  );
};
export default ShaderPage;