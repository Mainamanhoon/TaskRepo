const ShaderInput = ({ 
  shaderDescription, 
  setShaderDescription, 
  onGenerate, 
  loading, 
  disabled 
}) => {
  return (
    <div className="shader-input" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%',
      maxWidth: '600px'
    }}>
      <textarea
        value={shaderDescription}
        onChange={(e) => setShaderDescription(e.target.value)}
        placeholder="Describe the shader you want (e.g., 'A rotating cube with a gradient background')"
        className="shader-description-input"
        rows="3"
        disabled={disabled}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontSize: '16px',
          fontFamily: 'monospace',
          resize: 'vertical',
          backdropFilter: 'blur(10px)',
          outline: 'none'
        }}
      />
      <button 
        onClick={onGenerate}
        disabled={loading || disabled || !shaderDescription.trim()}
        className="generate-shader-button"
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {loading ? 'Generating...' : 'Generate Shader'}
      </button>
    </div>
  );
};

export default ShaderInput; 