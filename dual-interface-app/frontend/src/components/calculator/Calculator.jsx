import React, { useState, useEffect } from 'react';
import Display from './Display';
import Button from './Button';
import '../../pages/CalculatorPage.css';

// Import the WASM module
let wasmModule = null;

// Initialize WASM module
const initWasm = async () => {
  try {
    console.log('Loading WASM module...');
    const wasm = await import('../../wasm/calculator/pkg');
    console.log('WASM module imported, initializing...');
    await wasm.default(); // Initialize the WASM module
    wasmModule = wasm;
    console.log('WASM module loaded successfully');
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    throw error; // Re-throw to handle in component
  }
};

// Evaluate expression using Rust WASM only
const evaluateExpression = (expression) => {
  if (!wasmModule) {
    return Promise.reject(new Error('WASM module not loaded. Please wait for initialization or refresh the page.'));
  }

  try {
    const result = wasmModule.evaluate_expression(expression);
    console.log('WASM result:', result);
    
    if (result.error) {
      return Promise.reject(new Error(result.error));
    }
    return Promise.resolve(result.result);
  } catch (error) {
    console.error('WASM evaluation error:', error);
    return Promise.reject(new Error('WASM evaluation failed: ' + error.message));
  }
};


const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [wasmError, setWasmError] = useState('');

  // Initialize WASM on component mount
  useEffect(() => {
    console.log('Initializing WASM module...');
    initWasm()
      .then(() => {
        setWasmLoaded(true);
        setWasmError('');
        console.log('WASM module ready for calculations');
      })
      .catch((error) => {
        setWasmError('Failed to load WASM module: ' + error.message);
        console.error('WASM initialization failed:', error);
      });
  }, []);

  const handleButtonClick = (value) => {
    if (value === 'AC') {
      // All Clear
      setInput('');
      setResult('');
    } else if (value === 'C') {
      // Clear last character
      setInput((prevInput) => prevInput.slice(0, -1));
      setResult('');
    } else if (value === '=') {
      // Equals
      if (input === '' || !wasmLoaded) return;
      
      console.log('Evaluating expression:', input.trim());
      
      // Show loading state
      setResult('Calculating...');
      
      // Evaluate using WASM only
      evaluateExpression(input.trim()).then((evalResult) => {
        console.log('Evaluation result:', evalResult);
        setResult(evalResult.toString());
        setInput(evalResult.toString());
      }).catch((error) => {
        console.error('Evaluation error:', error);
        setResult(`Error: ${error.message}`);
      });
    } else {
      // Any other button
      if (result !== '' && !['+', '-', '*', '/', '(', ')'].includes(value)) {
        // Start a new calculation after a result is shown
        setInput(value);
        setResult('');
      } else {
        setInput((prevInput) => prevInput + value);
      }
    }
  };

  return (
    <div className="calculator-page-container">
      <div className="calculator-frame">
        <h2>Rust Calculator (WASM)</h2>
        
        {/* WASM Status */}
        {!wasmLoaded && !wasmError && (
          <div className="wasm-status loading">
            Loading WASM module...
          </div>
        )}
        
        {wasmError && (
          <div className="wasm-status error">
            {wasmError}
          </div>
        )}
        
        {wasmLoaded && (
          <div className="wasm-status ready">
            ✓ WASM module loaded and ready
          </div>
        )}
        
        {/* Text input for mathematical expression */}
        <div className="expression-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter expression (e.g., 2+2, 3*4, (5+7)/2)"
            className="expression-text-input"
            disabled={!wasmLoaded}
          />
          <button 
            onClick={() => {
              if (input.trim() && wasmLoaded) {
                console.log('Text input evaluating:', input.trim());
                setResult('Calculating...');
                evaluateExpression(input.trim())
                  .then((result) => {
                    console.log('Text input result:', result);
                    setResult(result.toString());
                  })
                  .catch((error) => {
                    console.error('Text input error:', error);
                    setResult(`Error: ${error.message}`);
                  });
              }
            }}
            className="calculate-button"
            disabled={!wasmLoaded || !input.trim()}
          >
            Calculate
          </button>
        </div>

        {/* Display result */}
        <div className="result-display">
          <h3>Result:</h3>
          <div className="result-value">
            {!wasmLoaded ? 'Waiting for WASM module...' : (result || 'Enter an expression above')}
          </div>
        </div>

        {/* Calculator buttons for convenience */}
        <div className="button-grid">
          {/* Row 1 - Brackets and Clear */}
          <Button value="AC" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />
          <Button value="(" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />
          <Button value=")" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />
          <Button value="C" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />

          {/* Row 2 - Operations */}
          <Button value="7" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="8" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="9" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="/" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />

          {/* Row 3 - Numbers and Operations */}
          <Button value="4" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="5" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="6" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="*" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />

          {/* Row 4 - Numbers and Operations */}
          <Button value="1" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="2" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="3" onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="-" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />

          {/* Row 5 - Zero, Decimal, and Equals */}
          <Button value="0" onClick={handleButtonClick} className="zero" disabled={!wasmLoaded} />
          <Button value="." onClick={handleButtonClick} disabled={!wasmLoaded} />
          <Button value="+" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />
          <Button value="=" onClick={handleButtonClick} className="operator" disabled={!wasmLoaded} />
        </div>
      </div>
    </div>
  );
};

export default Calculator;