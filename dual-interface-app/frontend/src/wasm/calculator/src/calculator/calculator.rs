use crate::calculator::lexer::lex;
use crate::calculator::evaluator::evaluate;
use crate::calculator::parser::parse;

#[derive(Debug, PartialEq)]
pub enum CalculatorError {
    DivisionByZero,
    ParseError(String),
    UnexpectedToken,
    InvalidExpression,
    EmptyExpression,
    ExtraTokensDetected,
    UnmatchedRightParenthesis,
    UnmatchedLeftParenthesis,
}

impl std::fmt::Display for CalculatorError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            CalculatorError::DivisionByZero => write!(f, "Division by zero"),
            CalculatorError::ParseError(s) => write!(f, "Parse error: {}", s),
            CalculatorError::UnexpectedToken => write!(f, "Unexpected token"),
            CalculatorError::InvalidExpression => write!(f, "Invalid expression"),
            CalculatorError::EmptyExpression => write!(f, "Empty expression"),
            CalculatorError::ExtraTokensDetected => write!(f, "Extra tokens detected"),
            CalculatorError::UnmatchedRightParenthesis => write!(f, "Unmatched right parenthesis"),
            CalculatorError::UnmatchedLeftParenthesis => write!(f, "Unmatched left parenthesis"),
        }
    }
}


pub(crate) fn process_expression(input: &str) -> Result<f64, CalculatorError> {
    let tokens = lex(input)?;
    if tokens.is_empty() {
        return Err(CalculatorError::EmptyExpression);
    }
    let (ast, rest) = parse(&tokens)?;
    if !rest.is_empty() {
        return Err(CalculatorError::ExtraTokensDetected);
    }
    evaluate(&ast)
}