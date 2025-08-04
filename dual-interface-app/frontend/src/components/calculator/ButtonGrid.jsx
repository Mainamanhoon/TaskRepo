import Button from './Button';

const ButtonGrid = ({ onButtonClick }) => {
  const buttons = [
    'AC', '+/-', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  const isOperator = (val) => ['/', '*', '-', '+', '='].includes(val);
  const isZero = (val) => val === '0';

  return (
    <div className="button-grid">
      {buttons.map((btn) => (
        <Button
          key={btn}
          label={btn}
          onClick={onButtonClick}
          className={`${isOperator(btn)? 'operator' : ''} ${isZero(btn)? 'zero' : ''}`}
        />
      ))}
    </div>
  );
};
export default ButtonGrid;