mod calculator;

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use calculator::process_expression;

#[derive(Serialize, Deserialize)]
pub struct CalculatorResult {
    pub result: f64,
    pub error: Option<String>,
}

#[wasm_bindgen]
pub fn evaluate_expression(expression: &str) -> JsValue {
    match process_expression(expression) {
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
                error: Some(error_msg.to_string()),
            };
            serde_wasm_bindgen::to_value(&calc_result).unwrap()
        }
    }
}