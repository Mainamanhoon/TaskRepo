const ShaderDisplay = ({ shaderCode, error }) => {
  return (
    <>
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
    </>
  );
};

export default ShaderDisplay; 