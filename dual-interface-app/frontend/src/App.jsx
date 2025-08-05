import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Calculator from './pages/CalculatorPage';
import ShaderPage from './pages/ShaderPage';
import ShaderRenderer from './components/shader/ShaderRenderer';
import { useShaderGenerator } from './hooks/useShaderGenerator';
import './App.css';

function App() {
  const { shaderCode, loading, error, generateShader, setError } = useShaderGenerator();

  return (
    <Router>
      <div className="App">
        {/* Full-screen shader background */}
        <ShaderRenderer shaderCode={shaderCode} />
        
        {/* Navigation */}
        <nav className="nav-bar">
          <Link to="/" className="nav-link">Calculator</Link>
          <Link to="/shader" className="nav-link">Text-to-Shader</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/shader" element={
            <ShaderPage 
              generateShader={generateShader}
              loading={loading}
              error={error}
              setError={setError}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;