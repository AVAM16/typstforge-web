import init, { generate_pdf, greet } from "../pkg/typstforge_web.js";

const sectionsContainer = document.getElementById("sections-container");
const btnAddSection = document.getElementById("btn-add-section");
const btnGenerate = document.getElementById("btn-generate");
const btnDownload = document.getElementById("btn-download");
const btnHelp = document.getElementById("btn-help");
const fontSelect = document.getElementById("font-select");
const btnThemeToggle = document.getElementById("btn-theme-toggle");
const fontSizeInput = document.getElementById("font-size");
const fontSizeValue = document.getElementById("font-size-value");

const syncFontSizeLabel = () => {
  if (!fontSizeInput || !fontSizeValue) {
    return;
  }
  fontSizeValue.textContent = fontSizeInput.value;
};

syncFontSizeLabel();
fontSizeInput?.addEventListener("input", syncFontSizeLabel);
fontSizeInput?.addEventListener("change", syncFontSizeLabel);

let currentPdfUrl = null;

// Function to add a new section input box to the HTML
function createSectionBox(title = "", content = "") {
  const div = document.createElement("div");
  div.className = "section-box";

  // Section title
  const titleLabel = document.createElement("div");
  titleLabel.className = "form-group";
  titleLabel.innerHTML = `
        <label>Section Title</label>
        <input type="text" class="sec-title">
    `;
  titleLabel.querySelector(".sec-title").value = title;

  // Section content
  const contentLabel = document.createElement("div");
  contentLabel.className = "form-group";
  contentLabel.innerHTML = `
        <label>Content</label>
        <textarea class="sec-content" rows="3"></textarea>
    `;
  contentLabel.querySelector(".sec-content").value = content;

  // Image upload
  const imageLabel = document.createElement("div");
  imageLabel.className = "form-group";
  imageLabel.innerHTML = `
        <label>Image (Optional)</label>
        <input type="file" class="sec-image" accept="image/*">
        <div style="margin-top: 10px;">
          <label>Image Width: <span class="sec-image-width-value">40</span>%</label>
          <input type="range" class="sec-image-width" min="10" max="100" step="1" value="40" oninput="this.previousElementSibling.querySelector('.sec-image-width-value').textContent = this.value">
        </div>
    `;

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.className = "btn-remove-section";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => div.remove());

  div.appendChild(titleLabel);
  div.appendChild(contentLabel);
  div.appendChild(imageLabel);
  div.appendChild(removeBtn);

  sectionsContainer.appendChild(div);
}

init().then(() => {
  // Initialize with one default section
  createSectionBox("Introduction", "This is the introduction.");

  // When user clicks "Add Section"
  btnAddSection.addEventListener("click", () => {
    createSectionBox();
  });

  // When user clicks "Generate PDF"
  btnGenerate.addEventListener("click", async () => {
    // 1. Gather all data from the HTML inputs
    const selectedFont = fontSelect.value || "FreeSans";
    const selectedFontSize = (() => {
      const v = parseInt(fontSizeInput.value, 10);
      return Number.isInteger(v) ? v : 11;
    })();
    const title = document.getElementById("doc-title").value;
    const date = document.getElementById("doc-date").value;

    const sections = [];
    const sectionBoxes = document.querySelectorAll(".section-box");

    for (const box of sectionBoxes) {
      let imageData = null;
      const fileInput = box.querySelector(".sec-image");
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const arrayBuffer = await file.arrayBuffer();
        imageData = Array.from(new Uint8Array(arrayBuffer));
      }

      const widthInput = box.querySelector(".sec-image-width");
      const imageWidthPercent = widthInput
        ? parseInt(widthInput.value, 10)
        : 40;

      sections.push({
        title: box.querySelector(".sec-title").value,
        content: box.querySelector(".sec-content").value,
        image_data: imageData,
        image_width_percent: imageWidthPercent,
      });
    }

    // 2. Create the exact Javascript object that matches your Rust Inputs struct
    const inputData = {
      title: title,
      date: date,
      sections: sections,
    };

    if (selectedFont && selectedFont !== "default") {
      inputData.font = selectedFont;
    }
    // We only send font_size if it's explicitly set by the user or if we want to force it
    // But since it's an Option, let's always send the value of the slider
    if (selectedFontSize) {
      inputData.font_size = selectedFontSize;
    }

    // 3. Send the Javascript object to Rust!
    try {
      const pdfBytes = generate_pdf(inputData);
      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });

      // Clean up the old URL to prevent memory leaks
      if (currentPdfUrl) {
        URL.revokeObjectURL(currentPdfUrl);
      }

      currentPdfUrl = URL.createObjectURL(blob);
      document.getElementById("pdf-viewer").src = currentPdfUrl;
    } catch (error) {
      console.error("Typst generation failed:", error);
      alert("Typst error: " + error);
    }
  });

  // When user clicks "Download PDF"
  btnDownload.addEventListener("click", () => {
    if (!currentPdfUrl) {
      alert("Please generate the PDF first.");
      return;
    }

    // Create a temporary anchor tag to trigger the download
    const title = document.getElementById("doc-title").value || "document";
    const a = document.createElement("a");
    a.href = currentPdfUrl;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Theme toggle logic
  btnThemeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Help button logic
  btnHelp?.addEventListener("click", () => {
    // Detect browser name roughly
    const userAgent = navigator.userAgent;
    let browserName = "Web";

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge";
    }

    greet(browserName);
  });

  // Automatically generate PDF on first load
  btnGenerate.click();
});
