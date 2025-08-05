import { useState } from 'react';
import ShaderInput from '../components/shader/ShaderInput';
import './ShaderPage.css';

const ShaderPage = ({ generateShader, loading, error, setError }) => {
  const [shaderDescription, setShaderDescription] = useState('');

  const handleGenerateShader = async () => {
    try {
      await generateShader(shaderDescription);
    } catch (renderError) {
      setError(`Shader render error: ${renderError.message}`);
    }
  };

  return (
    <div className="shader-page-container">
      <h2>Text-to-Shader Generator</h2>
      
      {/* Shader Input Component */}
      <ShaderInput
        shaderDescription={shaderDescription}
        setShaderDescription={setShaderDescription}
        onGenerate={handleGenerateShader}
        loading={loading}
        disabled={false}
      />

      {/* Error display */}
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default ShaderPage;