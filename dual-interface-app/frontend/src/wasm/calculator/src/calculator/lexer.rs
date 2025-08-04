use crate::calculator::token::Token;
use crate::calculator::calculator::CalculatorError;

pub(crate) fn lex(input: &str) -> Result<Vec<Token>, CalculatorError> {
    let mut tokens = Vec::new();
    let mut chars = input.chars().peekable();
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
                        .map_err(|_| CalculatorError::ParseError("Invalid number format".to_string()))?;
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
            ' ' => {
                if !current_number.is_empty() {
                    let num: f64 = current_number.parse()
                        .map_err(|_| CalculatorError::ParseError("Invalid number format".to_string()))?;
                    tokens.push(Token::Number(num));
                    current_number.clear();
                }
                chars.next();
            }
            _ => {
                return Err(CalculatorError::UnexpectedToken);
            }
        }
    }

    if !current_number.is_empty() {
        let num: f64 = current_number.parse()
            .map_err(|_| CalculatorError::ParseError("Invalid number format".to_string()))?;
        tokens.push(Token::Number(num));
    }

    Ok(tokens)
}