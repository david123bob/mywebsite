const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

function setNavOpen(isOpen) {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navLinks.classList.toggle("open", isOpen);
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!expanded);
  });

  navLinks.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLAnchorElement)) return;
    if (!target.classList.contains("nav-link")) return;
    setNavOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Node)) return;
    if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
    setNavOpen(false);
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ── Project carousel ───────────────────────────────────────
(function () {
  const track  = document.getElementById("proj-track");
  const prev   = document.getElementById("proj-prev");
  const next   = document.getElementById("proj-next");
  if (!track || !prev || !next) return;

  const CARD_WIDTH = 300 + 20; // card width + gap

  function updateArrows() {
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  }

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
  });

  track.addEventListener("scroll", updateArrows);
  updateArrows();
})();

// ── Scroll reveal (Intersection Observer) ─────────────────
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// ── Hero typewriter interest rotator ──────────────────────
(function () {
  const el = document.getElementById("typewriter-interest");
  if (!el) return;

  const interests = [
    "machine learning…",
    "robotics…",
    "cybersecurity…",
    "cloud systems…",
  ];
  const finalLine = "solving challenging problems with technology.";

  const TYPE_SPEED   = 50;   // ms per character typed
  const DELETE_SPEED = 25;   // ms per character deleted
  const PAUSE_AFTER  = 1400; // ms to pause before deleting
  const PAUSE_BEFORE = 350;  // ms to pause before typing next

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function typeText(text) {
    for (const char of text) {
      el.textContent += char;
      await sleep(TYPE_SPEED);
    }
  }

  async function deleteText() {
    while (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1);
      await sleep(DELETE_SPEED);
    }
  }

  async function run() {
    await sleep(800); // slight delay before starting

    for (const phrase of interests) {
      await typeText(phrase);
      await sleep(PAUSE_AFTER);
      await deleteText();
      await sleep(PAUSE_BEFORE);
    }

    // Type the final statement and leave it permanently
    await typeText(finalLine);
  }

  run();
})();

// ── Terminal typing animation ──────────────────────────────
(function () {
  const body = document.getElementById("terminal-body");
  if (!body) return;

  // Each step is either a "command" (typed out) or an "output" (appears instantly)
  const PROMPT =
    `<span class="text-emerald-400">➜ <span class="text-indigo-200">~</span></span> `;

  const steps = [
    { type: "command", text: "whoami" },
    { type: "output",  html: "David Hao, Software Engineer" },
    { type: "pause" },
    { type: "command", text: "ls experience/" },
    { type: "output",  html: '<span class="text-indigo-200">Socotec&nbsp;&nbsp;&nbsp; NYU&nbsp;&nbsp;&nbsp; Personal-Projects&nbsp;&nbsp;&nbsp; ARobotics</span>' },
    { type: "pause" },
    { type: "command", text: "echo $Status" },
    { type: "output",  html: "Open to new opportunities" },
    { type: "pause" },
    { type: "command", text: "git log --oneline" },
    { type: "output",  html: '<span class="text-yellow-300">a1f4c2e</span> applyflow.us \u2014 optimized job finder' },
    { type: "output",  html: '<span class="text-yellow-300">7b8d391</span> propel.earth \u2014 founders finding founders' },
    { type: "output",  html: '<span class="text-yellow-300">3e92fd0</span> weather-ml \u2014 predicting the weather using LSTM' },
    { type: "pause" },
    { type: "command", text: "cat hobbies.txt" },
    { type: "output",  html: 'Fitness &nbsp; Bouldering &nbsp; Crocheting &nbsp; Photography &nbsp; Trying new food places' },
  ];

  const CHAR_DELAY  = 55;   // ms between each typed character
  const POST_CMD    = 180;  // ms pause after finishing a command before output appears
  const POST_OUTPUT = 80;   // ms pause after each output line
  const PAUSE_MS    = 420;  // ms for explicit pause steps
  const INITIAL_DELAY = 600; // ms before the animation starts

  let currentCmdEl = null;  // <p> holding the line being typed right now
  let cursorEl = null;      // blinking cursor span

  function addLine(html) {
    const p = document.createElement("p");
    p.innerHTML = html;
    body.appendChild(p);
    return p;
  }

  function attachCursor(el) {
    if (cursorEl) cursorEl.remove();
    cursorEl = document.createElement("span");
    cursorEl.className = "terminal-cursor";
    el.appendChild(cursorEl);
  }

  function removeCursor() {
    if (cursorEl) { cursorEl.remove(); cursorEl = null; }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function typeCommand(text) {
    // Start a new prompt line
    const p = document.createElement("p");
    p.innerHTML = PROMPT;
    body.appendChild(p);
    currentCmdEl = p;
    attachCursor(p);

    // Type each character
    for (const char of text) {
      // insert char before the cursor
      const textNode = document.createTextNode(char);
      p.insertBefore(textNode, cursorEl);
      await sleep(CHAR_DELAY);
    }

    // Small pause after finishing typing before output
    await sleep(POST_CMD);
    removeCursor();
  }

  async function run() {
    await sleep(INITIAL_DELAY);

    for (const step of steps) {
      if (step.type === "command") {
        await typeCommand(step.text);
      } else if (step.type === "output") {
        addLine(step.html);
        await sleep(POST_OUTPUT);
      } else if (step.type === "pause") {
        await sleep(PAUSE_MS);
      }
    }

    // Final blinking cursor on a new empty prompt line
    const finalPrompt = document.createElement("p");
    finalPrompt.innerHTML = PROMPT;
    body.appendChild(finalPrompt);
    attachCursor(finalPrompt);
  }

  run();
})();