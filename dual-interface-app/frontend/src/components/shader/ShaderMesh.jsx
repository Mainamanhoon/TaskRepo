import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './vertexShader.glsl?raw';
import fragmentShader from './fragmentShader.glsl?raw';

const ShaderMesh = ({ shaderCode }) => {
  const meshRef = useRef();

  // Default shader if no custom shader is provided
  const defaultVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const defaultFragmentShader = `
    uniform float u_time;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0,2,4));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Parse shader code if provided
  const { vertexShader, fragmentShader } = useMemo(() => {
    if (!shaderCode) {
      return {
        vertexShader: defaultVertexShader,
        fragmentShader: defaultFragmentShader
      };
    }

    // Try to parse the shader code - this is a simple implementation
    // In a real app, you'd want more sophisticated parsing
    const lines = shaderCode.split('\n');
    let vertexShader = defaultVertexShader;
    let fragmentShader = defaultFragmentShader;

    // Simple parsing - look for vertex and fragment shader sections
    let currentShader = '';
    for (const line of lines) {
      if (line.includes('vertex') || line.includes('VERTEX')) {
        currentShader = 'vertex';
        vertexShader = '';
      } else if (line.includes('fragment') || line.includes('FRAGMENT')) {
        currentShader = 'fragment';
        fragmentShader = '';
      } else if (currentShader === 'vertex') {
        vertexShader += line + '\n';
      } else if (currentShader === 'fragment') {
        fragmentShader += line + '\n';
      }
    }

    // If no specific sections found, treat the whole code as fragment shader
    if (vertexShader === defaultVertexShader && fragmentShader === defaultFragmentShader) {
      fragmentShader = shaderCode;
    }

    return { vertexShader, fragmentShader };
  }, [shaderCode]);

  const uniforms = useMemo(() => ({
    u_time: { value: 0.0 },
  }), []);

  // Update shader when shaderCode changes
  useEffect(() => {
    if (meshRef.current && shaderCode) {
      try {
        // Recreate the material with new shaders
        const newMaterial = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
        });
        meshRef.current.material = newMaterial;
      } catch (error) {
        console.error('Shader compilation error:', error);
      }
    }
  }, [shaderCode, vertexShader, fragmentShader, uniforms]);

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      meshRef.current.material.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={2.0}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        key={vertexShader + fragmentShader}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default ShaderMesh;