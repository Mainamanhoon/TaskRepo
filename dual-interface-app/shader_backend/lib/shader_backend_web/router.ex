defmodule ShaderBackendWeb.Router do
  use ShaderBackendWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {ShaderBackendWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ShaderBackendWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  scope "/api", ShaderBackendWeb do
    pipe_through :api
    post "/generate_shader", ShaderController, :create
    post "/evaluate_expression", CalculatorController, :evaluate
  end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:shader_backend, :dev_routes) do

    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
