import { useState } from 'react';

export const useShaderGenerator = () => {
  const [shaderCode, setShaderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateShader = async (description) => {
    if (!description.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const requestBody = { description };
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
      console.log('Setting shader code:', cleanedCode);
      setShaderCode(cleanedCode);
      
      return cleanedCode;
    } catch (err) {
      console.error('Request error:', err);
      setError(err.message);
      setShaderCode('');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    shaderCode,
    loading,
    error,
    generateShader,
    setError
  };
}; 