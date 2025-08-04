import React, { useState } from 'react';
import Display from './Display';
import Button from './Button';
import '../../../styles/Calculator.css';

// A safer alternative to the built-in eval() to prevent security risks.
// This function will only handle basic arithmetic.
const safeEvaluate = (expression) => {
  // Remove any characters that are not digits, operators, or decimal points
  const sanitized = expression.replace(/[^0-9+\-*/.]/g, '');

  try {
    // eslint-disable-next-line no-new-func
    return new Function('return ' + sanitized)();
  } catch (error) {
    return 'Error';
  }
};


const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    if (value === 'AC') {
      // All Clear
      setInput('');
      setResult('');
    } else if (value === '=') {
      // Equals
      if (input === '') return;
      try {
        const evalResult = safeEvaluate(input);
        setResult(evalResult.toString());
        setInput(evalResult.toString());
      } catch (error) {
        setResult('Error');
      }
    } else {
      // Any other button
      if (result !== '' && !['+', '-', '*', '/'].includes(value)) {
        // Start a new calculation after a result is shown
        setInput(value);
        setResult('');
      } else {
        setInput((prevInput) => prevInput + value);
      }
    }
  };

  return (
    <div className="calculator-container">
      <h2 className="page-title">React Calculator</h2>
      <div className="calculator">
        <Display input={input} result={result} />
        <div className="button-grid">
          {/* Row 1 */}
          <Button value="AC" onClick={handleButtonClick} className="operator" />
          <Button value="/" onClick={handleButtonClick} className="operator" />
          <Button value="*" onClick={handleButtonClick} className="operator" />
          <Button value="-" onClick={handleButtonClick} className="operator" />

          {/* Row 2 */}
          <Button value="7" onClick={handleButtonClick} />
          <Button value="8" onClick={handleButtonClick} />
          <Button value="9" onClick={handleButtonClick} />
          <Button value="+" onClick={handleButtonClick} className="operator row-span-2" />
          
          {/* Row 3 */}
          <Button value="4" onClick={handleButtonClick} />
          <Button value="5" onClick={handleButtonClick} />
          <Button value="6" onClick={handleButtonClick} />

          {/* Row 4 */}
          <Button value="1" onClick={handleButtonClick} />
          <Button value="2" onClick={handleButtonClick} />
          <Button value="3" onClick={handleButtonClick} />
          <Button value="=" onClick={handleButtonClick} className="operator row-span-2" />

          {/* Row 5 */}
          <Button value="0" onClick={handleButtonClick} className="col-span-2" />
          <Button value="." onClick={handleButtonClick} />
        </div>
      </div>
    </div>
  );
};

export default Calculator;