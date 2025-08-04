use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CalculatorResult {
    pub result: f64,
    pub error: Option<String>,
}

#[wasm_bindgen]
pub fn evaluate_expression(expression: &str) -> JsValue {
    match evaluate_math_expression(expression) {
        Ok(result) => {
            let calc_result = CalculatorResult {
                result,
                error: None,
            };
            serde_wasm_bindgen::to_value(&calc_result).unwrap()
        }
        Err(error_msg) => {
            let calc_result = CalculatorResult {
                result: 0.0,
                error: Some(error_msg),
            };
            serde_wasm_bindgen::to_value(&calc_result).unwrap()
        }
    }
}

fn evaluate_math_expression(expression: &str) -> Result<f64, String> {
    // Clean the expression - only allow digits, operators, decimal points, and brackets
    let cleaned: String = expression
        .chars()
        .filter(|c| c.is_ascii_digit() || "+-*/.()".contains(*c))
        .collect();

    if cleaned.is_empty() {
        return Err("Empty expression".to_string());
    }

    // Simple recursive descent parser for arithmetic expressions
    let mut tokens = tokenize(&cleaned)?;
    let result = parse_expression(&mut tokens)?;
    
    if !tokens.is_empty() {
        return Err("Unexpected tokens at end of expression".to_string());
    }
    
    Ok(result)
}

#[derive(Debug, Clone)]
enum Token {
    Number(f64),
    Plus,
    Minus,
    Multiply,
    Divide,
    LeftParen,
    RightParen,
}

fn tokenize(expression: &str) -> Result<Vec<Token>, String> {
    let mut tokens = Vec::new();
    let mut chars = expression.chars().peekable();
    let mut current_number = String::new();

    while let Some(&ch) = chars.peek() {
        match ch {
            '0'..='9' | '.' => {
                current_number.push(ch);
                chars.next();
            }
            '+' | '-' | '*' | '/' | '(' | ')' => {
                if !current_number.is_empty() {
                    let num: f64 = current_number.parse()
                        .map_err(|_| "Invalid number format".to_string())?;
                    tokens.push(Token::Number(num));
                    current_number.clear();
                }
                
                let token = match ch {
                    '+' => Token::Plus,
                    '-' => Token::Minus,
                    '*' => Token::Multiply,
                    '/' => Token::Divide,
                    '(' => Token::LeftParen,
                    ')' => Token::RightParen,
                    _ => unreachable!(),
                };
                tokens.push(token);
                chars.next();
            }
            _ => {
                chars.next(); // Skip whitespace and other characters
            }
        }
    }

    if !current_number.is_empty() {
        let num: f64 = current_number.parse()
            .map_err(|_| "Invalid number format".to_string())?;
        tokens.push(Token::Number(num));
    }

    Ok(tokens)
}

fn parse_expression(tokens: &mut Vec<Token>) -> Result<f64, String> {
    let mut left = parse_term(tokens)?;

    while let Some(token) = tokens.first() {
        match token {
            Token::Plus => {
                tokens.remove(0);
                let right = parse_term(tokens)?;
                left += right;
            }
            Token::Minus => {
                tokens.remove(0);
                let right = parse_term(tokens)?;
                left -= right;
            }
            _ => break,
        }
    }

    Ok(left)
}

fn parse_term(tokens: &mut Vec<Token>) -> Result<f64, String> {
    let mut left = parse_factor(tokens)?;

    while let Some(token) = tokens.first() {
        match token {
            Token::Multiply => {
                tokens.remove(0);
                let right = parse_factor(tokens)?;
                left *= right;
            }
            Token::Divide => {
                tokens.remove(0);
                let right = parse_factor(tokens)?;
                if right == 0.0 {
                    return Err("Division by zero".to_string());
                }
                left /= right;
            }
            _ => break,
        }
    }

    Ok(left)
}

fn parse_factor(tokens: &mut Vec<Token>) -> Result<f64, String> {
    if tokens.is_empty() {
        return Err("Unexpected end of expression".to_string());
    }

    match tokens.remove(0) {
        Token::Number(n) => Ok(n),
        Token::LeftParen => {
            let result = parse_expression(tokens)?;
            if tokens.is_empty() || !matches!(tokens[0], Token::RightParen) {
                return Err("Missing closing parenthesis".to_string());
            }
            tokens.remove(0); // Remove right parenthesis
            Ok(result)
        }
        Token::Minus => {
            let factor = parse_factor(tokens)?;
            Ok(-factor)
        }
        _ => Err("Unexpected token".to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_addition() {
        assert_eq!(evaluate_math_expression("2+3").unwrap(), 5.0);
    }

    #[test]
    fn test_multiplication() {
        assert_eq!(evaluate_math_expression("3*4").unwrap(), 12.0);
    }

    #[test]
    fn test_division() {
        assert_eq!(evaluate_math_expression("10/2").unwrap(), 5.0);
    }

    #[test]
    fn test_complex_expression() {
        assert_eq!(evaluate_math_expression("(3+2)*(8/4)").unwrap(), 10.0);
    }

    #[test]
    fn test_division_by_zero() {
        assert!(evaluate_math_expression("5/0").is_err());
    }
} 