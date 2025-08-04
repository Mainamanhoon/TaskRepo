import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const activeStyle = {
    textDecoration: 'underline',
    color: '#535bf2',
    backgroundColor: '#2c2c3e'
  };

  return (
    <nav>
      <NavLink to="/" style={({ isActive }) => (isActive? activeStyle : undefined)} end>
        Home
      </NavLink>
      <NavLink to="/calculator" style={({ isActive }) => (isActive? activeStyle : undefined)}>
        Calculator
      </NavLink>
      <NavLink to="/shader" style={({ isActive }) => (isActive? activeStyle : undefined)}>
        Shader Editor
      </NavLink>
    </nav>
  );
};

export default Navigation;