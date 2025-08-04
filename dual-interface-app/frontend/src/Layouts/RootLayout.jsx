import { NavLink, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      {/* Simple nav bar */}
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <NavLink to="/" end>
          Calculator
        </NavLink>
        <NavLink to="/shader">Text-to-Shader</NavLink>
      </nav>

      {/* Child routes render here */}
      <Outlet />
    </>
  );
}
