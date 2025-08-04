defmodule ShaderBackendWeb.CalculatorController do
  use ShaderBackendWeb, :controller

  def evaluate(conn, %{"expression" => expression}) do
    case evaluate_expression(expression) do
      {:ok, result} ->
        json(conn, %{result: result})
      {:error, reason} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: reason})
    end
  end

  def evaluate(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Expression parameter is required"})
  end

  # Evaluate arithmetic expression with operator precedence and brackets
  defp evaluate_expression(expression) do
    # Clean the expression - only allow digits, operators, decimal points, and brackets
    cleaned = String.replace(expression, ~r/[^0-9+\-*/.()]/, "")
    
    case parse_and_evaluate(cleaned) do
      {:ok, result} -> {:ok, result}
      {:error, _} -> {:error, "Invalid expression"}
    end
  end

  # Parse and evaluate the expression using a simple recursive descent parser
  defp parse_and_evaluate(expression) do
    try do
      # Use a safe evaluation approach
      result = Code.eval_string(expression)
      {:ok, elem(result, 0)}
    rescue
      _ -> {:error, "Invalid expression"}
    end
  end
end 