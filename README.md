# TypstForge Web

Fully browser-based pdf generator using Rust, WebAssembly and Typst.
All thanks to [TypstBake](https://github.com/elgar328/typst-bake).

## Prerequisites

To run this project, you need to have the following installed on your system:

- Rust and Cargo: `https://rust-lang.org/tools/install/`
- wasm-pack: `cargo install wasm-pack`
- Python 3: `https://www.python.org/downloads/`

## Running locally

To run the project locally, you can use the following commands in your terminal:

```bash
# build the project (add the --dev flag for faster builds)
wasm-pack build --target web --out-dir web/pkg

# serve the project
python3 -m http.server --directory web
```

Go to `http://localhost:8000` in your browser to see the project in action.
