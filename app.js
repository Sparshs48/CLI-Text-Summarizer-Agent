// DOM Elements
const apiKeyInput = document.getElementById("apiKey");
const textInput = document.getElementById("textInput");
const urlInput = document.getElementById("urlInput");
const textInputGroup = document.getElementById("textInputGroup");
const urlInputGroup = document.getElementById("urlInputGroup");
const textToggleBtn = document.querySelector('[data-type="text"]');
const urlToggleBtn = document.querySelector('[data-type="url"]');
const summarizeBtn = document.getElementById("summarizeBtn");
const clearBtn = document.getElementById("clearBtn");
const statusMessage = document.getElementById("statusMessage");
const summaryContent = document.getElementById("summaryContent");
const copyBtn = document.getElementById("copyBtn");

// Load API key from localStorage
const savedApiKey = localStorage.getItem("gemini_api_key");
if (savedApiKey) {
  apiKeyInput.value = savedApiKey;
}

// Save API key to localStorage
apiKeyInput.addEventListener("input", () => {
  localStorage.setItem("gemini_api_key", apiKeyInput.value);
});

// Toggle between text and URL input
textToggleBtn.addEventListener("click", () => {
  textToggleBtn.classList.add("active");
  urlToggleBtn.classList.remove("active");
  textInputGroup.classList.remove("hidden");
  urlInputGroup.classList.add("hidden");
});

urlToggleBtn.addEventListener("click", () => {
  urlToggleBtn.classList.add("active");
  textToggleBtn.classList.remove("active");
  textInputGroup.classList.add("hidden");
  urlInputGroup.classList.remove("hidden");
});

// Clear inputs
clearBtn.addEventListener("click", () => {
  textInput.value = "";
  urlInput.value = "";
  hideStatusMessage();
  showEmptyState();
});

// Show status message
function showStatusMessage(message, type = "success") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.classList.remove("hidden");

  if (type === "success") {
    setTimeout(() => {
      hideStatusMessage();
    }, 3000);
  }
}

function hideStatusMessage() {
  statusMessage.classList.add("hidden");
}

// Show empty state
function showEmptyState() {
  summaryContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">✨</div>
      <h3>Ready to Summarize</h3>
      <p>Enter your text or URL in the sidebar and click "Generate Summary"</p>
    </div>
  `;
}

// Show loading state
function showLoadingState() {
  summaryContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon loading">⏳</div>
      <h3>Generating Summary...</h3>
      <p>Please wait while we process your content</p>
    </div>
  `;
}

// Format and display summary
function displaySummary(summaryText) {
  // Parse the summary text
  const summaryMatch = summaryText.match(
    /SUMMARY:\s*(.+?)(?=KEY TAKEAWAYS:|$)/is,
  );
  const takeawaysMatch = summaryText.match(
    /KEY TAKEAWAYS:\s*((?:•[^\n]+\n?)+)/is,
  );

  let summary = summaryMatch ? summaryMatch[1].trim() : "";
  let takeaways = [];

  if (takeawaysMatch) {
    takeaways = takeawaysMatch[1]
      .split("•")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  // If parsing failed, show raw text
  if (!summary && !takeaways.length) {
    summary = summaryText;
  }

  let html = '<div class="summary-content">';

  if (summary) {
    html += `
      <div class="summary-section">
        <h3>📄 Summary</h3>
        <p>${escapeHtml(summary)}</p>
      </div>
    `;
  }

  if (takeaways.length > 0) {
    html += `
      <div class="summary-section">
        <h3>🎯 Key Takeaways</h3>
        <ul class="takeaways-list">
          ${
      takeaways.map((takeaway) => `<li>${escapeHtml(takeaway)}</li>`).join("")
    }
        </ul>
      </div>
    `;
  }

  html += "</div>";

  summaryContent.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Copy to clipboard
copyBtn.addEventListener("click", async () => {
  const text = summaryContent.innerText;
  if (!text || text.includes("Ready to Summarize")) {
    showStatusMessage("No summary to copy", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showStatusMessage("Copied to clipboard!", "success");
  } catch (err) {
    showStatusMessage("Failed to copy", "error");
  }
});

// Summarize
summarizeBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    showStatusMessage("Please enter your Gemini API key", "error");
    return;
  }

  const isUrlMode = urlToggleBtn.classList.contains("active");
  const text = textInput.value.trim();
  const url = urlInput.value.trim();

  if (isUrlMode && !url) {
    showStatusMessage("Please enter a URL", "error");
    return;
  }

  if (!isUrlMode && !text) {
    showStatusMessage("Please enter some text", "error");
    return;
  }

  // Disable button and show loading
  summarizeBtn.disabled = true;
  summarizeBtn.classList.add("loading");
  showLoadingState();
  hideStatusMessage();

  try {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: isUrlMode ? null : text,
        url: isUrlMode ? url : null,
        apiKey: apiKey,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate summary");
    }

    displaySummary(data.summary);
    showStatusMessage("Summary generated successfully!", "success");
  } catch (error) {
    console.error("Error:", error);
    showStatusMessage(error.message || "An error occurred", "error");
    showEmptyState();
  } finally {
    summarizeBtn.disabled = false;
    summarizeBtn.classList.remove("loading");
  }
});

// Allow Enter key to submit (Ctrl+Enter for textarea)
textInput.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    summarizeBtn.click();
  }
});

urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    summarizeBtn.click();
  }
});
