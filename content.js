console.log("ChatGPT Prompt Navigator loaded");

function extractPrompts() {
  const prompts = [];
  const userMessages = document.querySelectorAll(
    'div[data-message-author-role="user"]'
  );

  userMessages.forEach((msg, index) => {
    const Outertext = msg.querySelector('.whitespace-pre-wrap');
    const text = Outertext ? Outertext.innerText.trim() : '';

    prompts.push({ index, text, element: msg });
  });

  return prompts;
}

function navigateToPrompt(prompt) {
  if (!prompt?.element) return;

  prompt.element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });

}

function createPromptButton() {
  if (document.getElementById("prompt-toggle-btn")) return;

  const shareButton = document.querySelector('[aria-label="Share"]'); 
  if (!shareButton) return;


  //creating the button element
  const btn = document.createElement("button");
  btn.id = "prompt-toggle-btn";
  btn.textContent = "🕒 History";
  btn.style.cssText = `
    margin-right: 8px;
    padding: 6px 8px;
    border-radius: 8px;
    background: #222;
    color: #fff;
    border: 1px solid #333;
    cursor: pointer;
  `;

  btn.onclick = () => togglePromptPanel(btn);

  shareButton.parentElement.insertBefore(btn, shareButton);
}

function togglePromptPanel(button) {
    const existing = document.getElementById("prompt-navigator");
    if (existing) {
        existing.remove();  //close panel if already open
        return;
    }

    createPromptPanel(button);
}



function createPromptPanel(button) {
    const rect = button.getBoundingClientRect();
    const panelWidth = 300; // same as CSS width
    const spacing = 8;      // space between button and panel

    // Default position: below and aligned left
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + spacing;
    
    // If it goes past the right edge, move it left
    const viewportWidth = window.innerWidth;
    if (left + panelWidth > viewportWidth - spacing) {
      left = Math.max(spacing, rect.right + window.scrollX - panelWidth); 
    }

    if (document.getElementById("prompt-navigator")) return;

    const panel = document.createElement("div");
    panel.id = "prompt-navigator";
    panel.style.cssText = `
        position: absolute;
        top: ${top}px;
        left: ${left}px;
        width: ${panelWidth}px;
        max-height: 60vh;
        overflow-y: auto;
        background: #111;
        color: #fff;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        z-index: 9999;
        font-family: system-ui;
    `;

    const header = document.createElement("div");
    header.innerText = "Your Prompts";
    header.style.cssText = `
      padding: 12px;
      font-weight: 600;
      border-bottom: 1px solid #333;
    `;

    const list = document.createElement("div");

    extractPrompts().forEach(prompt => {
      const item = document.createElement("div");
      item.innerText = prompt.text.slice(0, 80) || "(empty)";
      item.style.cssText = `
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid #222;
        font-size: 13px;
      `;

      item.onmouseenter = () => item.style.background = "#222";
      item.onmouseleave = () => item.style.background = "transparent";

      item.onclick = () => navigateToPrompt(prompt);

      list.appendChild(item);
    });

    panel.appendChild(header);
    panel.appendChild(list);
    document.body.appendChild(panel);
}



// Temporary: print prompts to console
setTimeout(() => {
    const prompts = extractPrompts();
    createPromptButton();
  console.log("Extracted prompts:", prompts);
}, 10000); // Delay to allow page content to load
