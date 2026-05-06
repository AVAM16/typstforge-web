use serde::Deserialize;
use typst_bake::{IntoDict, IntoValue};
use wasm_bindgen::prelude::*;

#[derive(Deserialize, IntoValue, IntoDict)]
struct Inputs {
    #[serde(default)]
    pub font: Option<String>,
    #[serde(default)]
    pub font_size: Option<i32>,
    pub title: String,
    pub date: String,
    pub sections: Vec<Section>,
}

#[derive(Deserialize, IntoValue, IntoDict)]
struct Section {
    pub title: String,
    pub content: String,
    #[serde(default)]
    pub image_data: Option<Vec<u8>>,
    #[serde(default)]
    pub image_width_percent: Option<i32>,
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!(
        "For writing italic put _ around the word, for writing bold put * around the word. Welcome {} user!",
        name
    ));
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
