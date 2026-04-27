import init, { generate_pdf } from "./pkg/typstforge_web.js";

const sectionsContainer = document.getElementById("sections-container");
const btnAddSection = document.getElementById("btn-add-section");
const btnGenerate = document.getElementById("btn-generate");
const btnDownload = document.getElementById("btn-download");
const fontSelect = document.getElementById("font-select");
const btnThemeToggle = document.getElementById("btn-theme-toggle");

let currentPdfUrl = null;

// Function to add a new section input box to the HTML
function createSectionBox(title = "", content = "") {
  const div = document.createElement("div");
  div.className = "section-box";

  // Use textContent for values to avoid HTML injection when possible
  const titleLabel = document.createElement("div");
  titleLabel.className = "form-group";
  titleLabel.innerHTML = `
        <label>Section Title</label>
        <input type="text" class="sec-title">
    `;
  titleLabel.querySelector(".sec-title").value = title;

  const contentLabel = document.createElement("div");
  contentLabel.className = "form-group";
  contentLabel.innerHTML = `
        <label>Content</label>
        <textarea class="sec-content" rows="3"></textarea>
    `;
  contentLabel.querySelector(".sec-content").value = content;

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn-remove-section";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => div.remove());

  div.appendChild(titleLabel);
  div.appendChild(contentLabel);
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
  btnGenerate.addEventListener("click", () => {
    // 1. Gather all data from the HTML inputs
    const selectedFont = fontSelect.value || "FreeSans";
    const title = document.getElementById("doc-title").value;
    const date = document.getElementById("doc-date").value;

    const sections = [];
    const sectionBoxes = document.querySelectorAll(".section-box");

    sectionBoxes.forEach((box) => {
      sections.push({
        title: box.querySelector(".sec-title").value,
        content: box.querySelector(".sec-content").value,
      });
    });

    // 2. Create the exact Javascript object that matches your Rust Inputs struct
    const inputData = {
      font: selectedFont,
      title: title,
      date: date,
      sections: sections,
    };

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

  // Automatically generate PDF on first load
  btnGenerate.click();
});
