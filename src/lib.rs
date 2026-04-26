use serde::Deserialize;
use typst_bake::{IntoDict, IntoValue};
use wasm_bindgen::prelude::*;

#[derive(IntoValue, IntoDict, Deserialize)]
struct Inputs {
    title: String,
    date: String,
    sections: Vec<Section>,
}

#[derive(IntoValue, IntoDict, Deserialize)]
struct Section {
    title: String,
    content: String,
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn generate_pdf(val: JsValue) -> Result<js_sys::Uint8Array, JsValue> {
    let inputs: Inputs =
        serde_wasm_bindgen::from_value(val).map_err(|e| JsValue::from_str(&e.to_string()))?;

    let pdf = typst_bake::document!("template.typ")
        .with_inputs(inputs)
        .to_pdf()
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    Ok(js_sys::Uint8Array::from(&pdf[..]))
}
