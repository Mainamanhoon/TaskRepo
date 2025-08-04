use crate::calculator::token::Token;

#[derive(Debug, PartialEq)]
pub(crate) enum AST {
    Num(f64),
    BinOp(Box<AST>, Operator, Box<AST>),
    UnaryOp(Operator, Box<AST>),
}

#[derive(Debug, PartialEq, Clone, Copy)]
pub(crate) enum Operator {
    Add,
    Sub,
    Mul,
    Div,
}