import { useState, Suspense } from 'react';
import { compileAndRender } from '../utils/shaderRunner';
import './ShaderPage.css';

const ShaderPage = () => {
  const [shaderDescription, setShaderDescription] = useState('solid red color'); // Try a simple prompt first
  const [shaderCode, setShaderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateShader = async () => {
    if (!shaderDescription.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const requestBody = { description: shaderDescription };
      console.log('Sending request:', requestBody);
      
      const response = await fetch('/api/generate_shader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate shader: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      const cleanedCode = data.shader_code || 'No shader code received';
      setShaderCode(cleanedCode);
      
      // Render the shader using WebGL
      try {
        await compileAndRender(cleanedCode, 'shader-canvas');
      } catch (renderError) {
        console.error('Shader render error:', renderError);
        setError(`Shader render error: ${renderError.message}`);
      }
    } catch (err) {
      console.error('Request error:', err);
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
        <canvas id="shader-canvas" width="600" height="600" style={{ border: '1px solid #ccc' }}></canvas>
      </div>
    </div>
  );
};

export default ShaderPage;