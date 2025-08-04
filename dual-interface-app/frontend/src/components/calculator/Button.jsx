import React from 'react';
import '../../pages/CalculatorPage.css';

const Button = ({ value, onClick, className, disabled }) => {
  // This handler calls the onClick function passed in from the parent
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  return (
    <button 
      className={`calculator-button ${className || ''} ${disabled ? 'disabled' : ''}`} 
      onClick={handleClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default Button;