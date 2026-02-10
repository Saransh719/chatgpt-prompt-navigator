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



function createPromptPanel(anchorBtn) {
if (!anchorBtn) return;

const rect = anchorBtn.getBoundingClientRect();
const panelWidth = 400;
const spacing = 8;

let left = rect.left + window.scrollX;
let top = rect.bottom + window.scrollY + spacing;
const viewportWidth = window.innerWidth;

if (left + panelWidth > viewportWidth - spacing) {
  left = Math.max(spacing, rect.right + window.scrollX - panelWidth);
}

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
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  z-index: 9999;
  font-family: system-ui;
  font-size: 13px;
`;

const header = document.createElement("div");
header.style.cssText = `
  padding: 8px 12px;
  font-weight: 600;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1a1a;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const titleText = document.createElement("span");
titleText.innerText = "Your Prompts";

const expandAllBtn = document.createElement("button");
expandAllBtn.textContent = "Expand All";
expandAllBtn.style.cssText = `
  background: #333;
  border: none;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
`;

header.appendChild(titleText);
header.appendChild(expandAllBtn);
panel.appendChild(header);

const list = document.createElement("div");

const promptItems = [];

extractPrompts().forEach((prompt, idx) => {
  const item = document.createElement("div");
  item.style.cssText = `
    padding: 6px 12px;
    border-bottom: 1px solid #222;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    word-break: break-word;
  `;

  // Header: index + expand button
  const title = document.createElement("div");
  title.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  `;

  const indexSpan = document.createElement("span");
  indexSpan.textContent = `${idx + 1}`;
  indexSpan.style.fontWeight = "500";
  indexSpan.style.flexShrink = "0";

  const separator = document.createElement("span");
  separator.style.cssText = `
    display: inline-block;
    width: 1px;
    height: 16px;
    background: #555;
    margin: 0 6px;
    flex-shrink: 0;
  `;

  const summary = document.createElement("span");
  summary.textContent = prompt.text.slice(0, 50) || "(empty)";
  summary.style.flexGrow = "1";
  summary.style.overflow = "hidden";
  summary.style.textOverflow = "ellipsis";
  summary.style.whiteSpace = "nowrap";

  const expandBtn = document.createElement("button");
  expandBtn.textContent = "Expand";
  expandBtn.style.cssText = `
    background: #333;
    border: none;
    color: #fff;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    flex-shrink: 0;
  `;

  const fullText = document.createElement("div");
  fullText.innerText = prompt.text || "(empty)";
  fullText.style.display = "none";
  fullText.style.whiteSpace = "pre-wrap";
  fullText.style.marginTop = "4px";

  expandBtn.onclick = (e) => {
    e.stopPropagation();
    if (fullText.style.display === "none") {
      fullText.style.display = "block";
      expandBtn.textContent = "Collapse";
    } else {
      fullText.style.display = "none";
      expandBtn.textContent = "Expand";
    }
  };

  title.appendChild(indexSpan);
  title.appendChild(separator);
  title.appendChild(summary);
  title.appendChild(expandBtn);

  item.appendChild(title);
  item.appendChild(fullText);

  item.onclick = () => navigateToPrompt(prompt);
  item.onmouseenter = () => item.style.background = "#222";
  item.onmouseleave = () => item.style.background = "transparent";

  list.appendChild(item);
  promptItems.push({ item, expandBtn, fullText });  //for expand all functionality

  panel.appendChild(list);
  let allExpanded = false;

expandAllBtn.onclick = (e) => {
    e.stopPropagation();
    allExpanded = !allExpanded;
    promptItems.forEach(({ expandBtn, fullText }) => {
        if (allExpanded) {
            fullText.style.display = "block";
            expandBtn.textContent = "Collapse";
        } else {
            fullText.style.display = "none";
            expandBtn.textContent = "Expand";
        }
        expandAllBtn.textContent = allExpanded ? "Collapse All" : "Expand All";
    });
}

  document.body.appendChild(panel);
});
}




// Temporary: print prompts to console
setTimeout(() => {
    const prompts = extractPrompts();
    createPromptButton();
  console.log("Extracted prompts:", prompts);
}, 10000); // Delay to allow page content to load
