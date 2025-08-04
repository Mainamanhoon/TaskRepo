use crate::calculator::ast::{AST, Operator};
use crate::calculator::calculator::CalculatorError;

pub(crate) fn evaluate(ast: &AST) -> Result<f64, CalculatorError> {
    match ast {
        AST::Num(n) => Ok(*n),
        AST::BinOp(lhs, op, rhs) => {
            let lhs_val = evaluate(lhs)?;
            let rhs_val = evaluate(rhs)?;
            match op {
                Operator::Add => Ok(lhs_val + rhs_val),
                Operator::Sub => Ok(lhs_val - rhs_val),
                Operator::Mul => Ok(lhs_val * rhs_val),
                Operator::Div => {
                    if rhs_val == 0.0 {
                        return Err(CalculatorError::DivisionByZero);
                    }
                    Ok(lhs_val / rhs_val)
                }
            }
        },
        AST::UnaryOp(op, rhs) => {
            let rhs_val = evaluate(rhs)?;
            match op {
                Operator::Sub => Ok(-rhs_val),
                _ => Err(CalculatorError::InvalidExpression)
            }
        }
    }
}