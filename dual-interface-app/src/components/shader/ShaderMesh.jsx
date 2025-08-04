import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './vertexShader.glsl?raw';
import fragmentShader from './fragmentShader.glsl?raw';

const ShaderMesh = ({ color, wireframe }) => {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    u_time: { value: 0.0 },
    u_color: { value: new THREE.Color(color) },
  }),);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.u_color.value.set(color);
    }
  }, [color]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.wireframe = wireframe;
    }
  }, [wireframe]);

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
        wireframe={wireframe}
      />
    </mesh>
  );
};

export default ShaderMesh;