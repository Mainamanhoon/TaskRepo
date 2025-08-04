defmodule ShaderBackendWeb.ShaderController do
  use ShaderBackendWeb, :controller

  def create(conn, %{"description" => description}) do
    case generate_shader_code(description) do
      {:ok, shader_code} ->
        json(conn, %{shader_code: shader_code})
      {:error, reason} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: reason})
    end
  end

  def create(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Description parameter is required"})
  end

  # Generate shader code using LLM
  defp generate_shader_code(description) do
    # For now, we'll use a simple template-based approach
    # In production, you'd integrate with an actual LLM API
    case call_llm_api(description) do
      {:ok, response} ->
        {:ok, extract_shader_code(response)}
      {:error, reason} ->
        {:error, reason}
    end
  end

  # Simulate LLM API call - replace with actual LLM integration
  defp call_llm_api(description) do
    # This is a mock implementation
    # In production, you'd make actual API calls to GPT, Gemini, etc.
    
    # Simulate API delay
    :timer.sleep(1000)
    
    # Generate shader based on description keywords
    shader_code = generate_shader_from_description(description)
    {:ok, shader_code}
  end

  defp generate_shader_from_description(description) do
    description_lower = String.downcase(description)
    
    cond do
      String.contains?(description_lower, "rotating") and String.contains?(description_lower, "cube") ->
        """
        // Vertex Shader
        varying vec2 vUv;
        uniform float u_time;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Add rotation
          float angle = u_time * 0.5;
          mat3 rotation = mat3(
            cos(angle), -sin(angle), 0.0,
            sin(angle), cos(angle), 0.0,
            0.0, 0.0, 1.0
          );
          pos = rotation * pos;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
        
        // Fragment Shader
        varying vec2 vUv;
        uniform float u_time;
        
        void main() {
          vec2 uv = vUv;
          vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0,2,4));
          gl_FragColor = vec4(color, 1.0);
        }
        """
      
      String.contains?(description_lower, "gradient") ->
        """
        // Vertex Shader
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        
        // Fragment Shader
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), uv.x);
          gl_FragColor = vec4(color, 1.0);
        }
        """
      
      String.contains?(description_lower, "wave") or String.contains?(description_lower, "wave") ->
        """
        // Vertex Shader
        varying vec2 vUv;
        uniform float u_time;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Add wave effect
          float wave = sin(pos.x * 3.0 + u_time) * 0.1;
          pos.y += wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
        
        // Fragment Shader
        varying vec2 vUv;
        uniform float u_time;
        
        void main() {
          vec2 uv = vUv;
          float wave = sin(uv.x * 10.0 + u_time) * 0.5 + 0.5;
          vec3 color = vec3(wave, 0.5, 1.0 - wave);
          gl_FragColor = vec4(color, 1.0);
        }
        """
      
      true ->
        # Default shader
        """
        // Vertex Shader
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        
        // Fragment Shader
        varying vec2 vUv;
        uniform float u_time;
        
        void main() {
          vec2 uv = vUv;
          vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0,2,4));
          gl_FragColor = vec4(color, 1.0);
        }
        """
    end
  end

  defp extract_shader_code(response) do
    # In a real implementation, you'd parse the LLM response
    # to extract the shader code
    response
  end
end 