const Display = ({ input, result }) => {
  return (
    <div className="calculator-display">
      {result || input || '0'}
    </div>
  );
};
export default Display;