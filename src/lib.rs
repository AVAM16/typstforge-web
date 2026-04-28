use serde::Deserialize;
use typst_bake::{IntoDict, IntoValue};
use wasm_bindgen::prelude::*;

#[derive(Deserialize, IntoValue, IntoDict)]
struct Inputs {
    pub font: String,
    pub font_size: i32,
    pub title: String,
    pub date: String,
    pub sections: Vec<Section>,
}

#[derive(Deserialize, IntoValue, IntoDict)]
struct Section {
    pub title: String,
    pub content: String,
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
