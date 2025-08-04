import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ShaderMesh from '../components/shader/ShaderMesh';
import './ShaderPage.css';

const ShaderPage = () => {
  const [color, setColor] = useState('#ff6347'); // Initial color: Tomato
  const = useState(false);

  return (
    <div className="shader-page-container">
      <div className="shader-controls">
        <h3>Shader Controls</h3>
        <div className="control-item">
          <label htmlFor="color-picker">Color:</label>
          <input
            id="color-picker"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="control-item">
          <label htmlFor="wireframe-toggle">Wireframe:</label>
          <input
            id="wireframe-toggle"
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
          />
        </div>
      </div>
      <div className="canvas-container">
        <Canvas>
          <Suspense fallback={null}>
            <ShaderMesh color={color} wireframe={wireframe} />
          </Suspense>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} />
        </Canvas>
      </div>
    </div>
  );
};
export default ShaderPage;