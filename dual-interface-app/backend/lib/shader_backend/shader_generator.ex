defmodule ShaderBackend.ShaderGenerator do
  @moduledoc "Fetches GLSL fragment shaders from Google Gemini API."
  require Logger

  @url   "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

  @spec generate(String.t()) :: {:ok, String.t()} | {:error, String.t()}
  def generate(description) when is_binary(description) do
    key = System.get_env("GEMINI_API_KEY") ||
            raise "Set GEMINI_API_KEY env var"

    prompt = "Write a standalone WebGL1-compatible fragment shader for: " <> description <> ". Only use u_time and u_resolution as uniforms. Do NOT use 3D geometry, camera, or lighting. Do NOT use any other uniforms. The shader should be a 2D effect only."

    body =
      %{
        contents: [
          %{
            parts: [
              %{
                text: "You are a GLSL shader expert. Return ONLY GLSL code (no markdown). Only use u_time and u_resolution as uniforms. Do NOT use 3D geometry, camera, or lighting. Do NOT use any other uniforms. The shader should be a 2D effect only."
              },
              %{
                text: prompt
              }
            ]
          }
        ],
        generationConfig: %{
          maxOutputTokens: 800,
          temperature: 0.7
        }
      }
      |> Jason.encode!()

    headers = [
      {"content-type", "application/json"}
    ]

    url = @url <> "?key=" <> key

    Logger.debug("▶️  Calling Gemini API with prompt: #{inspect(description)}")

    with {:ok, %Finch.Response{status: 200, body: r}} <-
           Finch.build(:post, url, headers, body)
           |> Finch.request(ShaderBackend.Finch),
         {:ok, %{"candidates" => [%{"content" => %{"parts" => [%{"text" => code} | _]}} | _]}} <-
           Jason.decode(r)
    do
      Logger.debug("✅ Got #{byte_size(code)}-byte shader")
      {:ok, String.trim(code)}
    else
      {:ok, %Finch.Response{status: s, body: b}} ->
        Logger.error("Gemini API HTTP #{s}: #{b}"); {:error, "HTTP #{s}"}
      err ->
        Logger.error("Gemini API error: #{inspect(err)}"); {:error, "API failure"}
    end
  end
end
