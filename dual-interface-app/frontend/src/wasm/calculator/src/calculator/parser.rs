use crate::calculator::token::Token;
use crate::calculator::ast::{AST, Operator};
use crate::calculator::calculator::CalculatorError;

pub(crate) fn parse(tokens: &[Token]) -> Result<(AST, &[Token]), CalculatorError> {
    parse_expression(tokens)
}

fn parse_expression(tokens: &[Token]) -> Result<(AST, &[Token]), CalculatorError> {
    let (mut lhs, mut rest) = parse_term(tokens)?;
    while let Some(token) = rest.first() {
        match token {
            Token::Plus | Token::Minus => {
                let (rhs, next_tokens) = parse_term(&rest[1..])?;
                let op = if matches!(token, Token::Plus) { Operator::Add } else { Operator::Sub };
                lhs = AST::BinOp(Box::new(lhs), op, Box::new(rhs));
                rest = next_tokens;
            },
            _ => break,
        }
    }
    Ok((lhs, rest))
}

fn parse_term(tokens: &[Token]) -> Result<(AST, &[Token]), CalculatorError> {
    let (mut lhs, mut rest) = parse_factor(tokens)?;
    while let Some(token) = rest.first() {
        match token {
            Token::Multiply | Token::Divide => {
                let (rhs, next_tokens) = parse_factor(&rest[1..])?;
                let op = if matches!(token, Token::Multiply) { Operator::Mul } else { Operator::Div };
                lhs = AST::BinOp(Box::new(lhs), op, Box::new(rhs));
                rest = next_tokens;
            },
            _ => break,
        }
    }
    Ok((lhs, rest))
}

fn parse_factor(tokens: &[Token]) -> Result<(AST, &[Token]), CalculatorError> {
    if tokens.is_empty() {
        return Err(CalculatorError::InvalidExpression);
    }
    match tokens.first().unwrap() {
        Token::Number(n) => Ok((AST::Num(*n), &tokens[1..])),
        Token::LeftParen => {
            let (expr, rest) = parse_expression(&tokens[1..])?;
            if rest.is_empty() || !matches!(rest[0], Token::RightParen) {
                return Err(CalculatorError::UnmatchedLeftParenthesis);
            }
            Ok((expr, &rest[1..]))
        },
        Token::Minus => {
            let (factor, rest) = parse_factor(&tokens[1..])?;
            Ok((AST::UnaryOp(Operator::Sub, Box::new(factor)), rest))
        }
        _ => Err(CalculatorError::UnexpectedToken),
    }
}