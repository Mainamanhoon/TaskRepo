import React from 'react';
import '../../../styles/Calculator.css';

const Button = ({ value, onClick, className }) => {
  // This handler calls the onClick function passed in from the parent
  const handleClick = () => {
    onClick(value);
  };

  return (
    <button className={`calc-button ${className || ''}`} onClick={handleClick}>
      {value}
    </button>
  );
};

export default Button;