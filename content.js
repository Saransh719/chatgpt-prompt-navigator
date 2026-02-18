// console.log("ChatGPT Prompt Navigator loaded");

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
  btn.onmouseenter = () => btn.style.background = "#333";
  btn.onmouseleave = () => btn.style.background = "transparent";

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

  setTimeout(() => {
    document.addEventListener("click", handleOutsideClick);
  }, 0);
});
}

function handleOutsideClick(e) {
  const panel = document.getElementById("prompt-navigator");
  const button = document.getElementById("prompt-toggle-btn");

  if (!panel) {
    document.removeEventListener("click", handleOutsideClick);
    return;
  }

  if (
    panel.contains(e.target) ||
    button?.contains(e.target)
  ) {
    return; // click inside → ignore
  }

  panel.remove();
  document.removeEventListener("click", handleOutsideClick);
}


function waitForHeader() {
  return new Promise(resolve => {
    if (document.querySelector("header")) return resolve();

    const obs = new MutationObserver(() => {
      if (document.querySelector("header")) {
        obs.disconnect();
        resolve();
      }
    });

    obs.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
}


function waitForFirstUserMessage() {
  return new Promise(resolve => {
    if (
      document.querySelector(
        'div[data-message-author-role="user"]'
      )
    ) return resolve();

    const obs = new MutationObserver(() => {
      if (
        document.querySelector(
          'div[data-message-author-role="user"]'
        )
      ) {
        obs.disconnect();
        resolve();
      }
    });

    obs.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

if (!window.lastUrl) {
  window.lastUrl = location.href;
}

function watchChatNavigation() {
  const obs = new MutationObserver(() => {
    if (location.href !== window.lastUrl) {
      window.lastUrl = location.href;
      initPromptNavigator();
    }
  });

  obs.observe(document.body, {
    childList: true,
    subtree: true
  });
}


async function initPromptNavigator() {
  // console.log("⏳ waiting for header...");
  await waitForHeader();

  // console.log("⏳ waiting for messages...");
  await waitForFirstUserMessage();

  // console.log("✅ header + messages ready");
  createPromptButton();
}

async function init() {
    let success = false;
    while (!success) {
        try {
            await initPromptNavigator(); // try to initialize
            watchChatNavigation(); // start watching for navigation changes
            success = true;             // if no error, mark success
        } catch (error) {
            console.error("Init failed, retrying...", error);
            // Optional: wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

init();