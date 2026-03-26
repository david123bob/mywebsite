// ─────────────────────────────────────────────────────────────
//  Snake Game
// ─────────────────────────────────────────────────────────────

(function () {

  // ── Canvas setup ───────────────────────────────────────────
  const canvas  = document.getElementById("game-canvas");
  const ctx     = canvas.getContext("2d");
  const COLS    = 20;
  const ROWS    = 20;
  const CELL    = 28;           // logical cell size (canvas units)

  canvas.width  = COLS * CELL;
  canvas.height = ROWS * CELL;

  // ── UI elements ────────────────────────────────────────────
  const scoreEl   = document.getElementById("score-display");
  const bestEl    = document.getElementById("best-display");
  const restartBtn= document.getElementById("restart-btn");

  // ── Theme ──────────────────────────────────────────────────
  const COLORS = {
    bg:         "#0f1117",
    gridLine:   "rgba(255,255,255,0.04)",
    snakeHead:  "#4648d4",
    snakeBody:  "#6366f1",
    snakeDark:  "#3730a3",
    food:       "#f43f5e",
    foodGlow:   "rgba(244,63,94,0.35)",
    foodShine:  "rgba(255,255,255,0.5)",
    textPrimary:"#ffffff",
    textMuted:  "rgba(255,255,255,0.5)",
    overlay:    "rgba(15,17,23,0.82)",
  };

  // ── Game state ─────────────────────────────────────────────
  let snake, dir, nextDir, food, score, best, gameOver, paused, loop, speed;

  function init() {
    snake    = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir      = { x: 1, y: 0 };
    nextDir  = { x: 1, y: 0 };
    score    = 0;
    best     = best || 0;
    gameOver = false;
    paused   = false;
    speed    = 130;            // ms per tick

    spawnFood();
    updateHUD();

    clearInterval(loop);
    loop = setInterval(tick, speed);
  }

  // ── Food ───────────────────────────────────────────────────
  function spawnFood() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  // ── Game tick ──────────────────────────────────────────────
  function tick() {
    if (gameOver || paused) return;

    dir = { ...nextDir };

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      return endGame();
    }

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      return endGame();
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      if (score > best) best = score;
      updateHUD();
      spawnFood();
      // Speed up slightly every 50 pts
      if (score % 50 === 0 && speed > 60) {
        speed -= 8;
        clearInterval(loop);
        loop = setInterval(tick, speed);
      }
    } else {
      snake.pop();
    }

    draw();
  }

  function endGame() {
    gameOver = true;
    clearInterval(loop);
    draw();
  }

  // ── HUD ────────────────────────────────────────────────────
  function updateHUD() {
    scoreEl.textContent = score;
    bestEl.textContent  = best;
  }

  // ── Input ──────────────────────────────────────────────────
  const DIR_MAP = {
    ArrowUp:    { x: 0,  y: -1 },
    ArrowDown:  { x: 0,  y:  1 },
    ArrowLeft:  { x: -1, y:  0 },
    ArrowRight: { x: 1,  y:  0 },
    KeyW:       { x: 0,  y: -1 },
    KeyS:       { x: 0,  y:  1 },
    KeyA:       { x: -1, y:  0 },
    KeyD:       { x: 1,  y:  0 },
  };

  window.addEventListener("keydown", e => {
    const mapped = DIR_MAP[e.code];
    if (mapped) {
      e.preventDefault();
      // Prevent reversing direction
      if (mapped.x !== -dir.x || mapped.y !== -dir.y) {
        nextDir = mapped;
      }
    }
    if (e.code === "KeyR") init();
    if (e.code === "KeyP") {
      paused = !paused;
      if (!paused) draw();
    }
  });

  restartBtn.addEventListener("click", init);

  // ── Drawing ────────────────────────────────────────────────
  function draw() {
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, H);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(W, r * CELL);
      ctx.stroke();
    }

    drawFood();
    drawSnake();

    if (paused && !gameOver)  drawPauseOverlay();
    if (gameOver)             drawGameOverOverlay();
  }

  function drawFood() {
    const cx = food.x * CELL + CELL / 2;
    const cy = food.y * CELL + CELL / 2;
    const r  = CELL / 2 - 4;

    // Glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL);
    glow.addColorStop(0, COLORS.foodGlow);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(food.x * CELL - CELL, food.y * CELL - CELL, CELL * 3, CELL * 3);

    // Body
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.food;
    ctx.fill();

    // Shine
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.foodShine;
    ctx.fill();
  }

  function drawSnake() {
    snake.forEach((seg, i) => {
      const x = seg.x * CELL;
      const y = seg.y * CELL;
      const pad = 2;
      const isHead = i === 0;

      // Segment body
      ctx.fillStyle = isHead ? COLORS.snakeHead : (i % 2 === 0 ? COLORS.snakeBody : COLORS.snakeDark);
      roundRect(ctx, x + pad, y + pad, CELL - pad * 2, CELL - pad * 2, 6);
      ctx.fill();

      // Head details — eyes
      if (isHead) {
        const eyeOffX = dir.x !== 0 ? 2 : 5;
        const eyeOffY = dir.y !== 0 ? 2 : 5;

        ctx.fillStyle = "#fff";

        if (dir.x === 1) {       // facing right
          ctx.beginPath(); ctx.arc(x + CELL - 7, y + 7,  3, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + CELL - 7, y + CELL - 7, 3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#111";
          ctx.beginPath(); ctx.arc(x + CELL - 6, y + 7,  1.5, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + CELL - 6, y + CELL - 7, 1.5, 0, Math.PI*2); ctx.fill();
        } else if (dir.x === -1) { // facing left
          ctx.beginPath(); ctx.arc(x + 7, y + 7,  3, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + 7, y + CELL - 7, 3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#111";
          ctx.beginPath(); ctx.arc(x + 6, y + 7,  1.5, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + 6, y + CELL - 7, 1.5, 0, Math.PI*2); ctx.fill();
        } else if (dir.y === -1) { // facing up
          ctx.beginPath(); ctx.arc(x + 7,        y + 7, 3, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + CELL - 7, y + 7, 3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#111";
          ctx.beginPath(); ctx.arc(x + 7,        y + 6, 1.5, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + CELL - 7, y + 6, 1.5, 0, Math.PI*2); ctx.fill();
        } else {                   // facing down
          ctx.beginPath(); ctx.arc(x + 7,        y + CELL - 7, 3, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + CELL - 7, y + CELL - 7, 3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#111";
          ctx.beginPath(); ctx.arc(x + 7,        y + CELL - 6, 1.5, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + CELL - 7, y + CELL - 6, 1.5, 0, Math.PI*2); ctx.fill();
        }

        // Segment number (score indicator)
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = `bold ${CELL * 0.35}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
      }
    });
  }

  function drawGameOverOverlay() {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.fillStyle = COLORS.textPrimary;
    ctx.font = `bold 42px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText("Game Over", cx, cy - 36);

    ctx.font = `20px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = "#f43f5e";
    ctx.fillText(`Score: ${score}`, cx, cy + 8);

    ctx.font = `14px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("Press R or click New Game to restart", cx, cy + 44);
  }

  function drawPauseOverlay() {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COLORS.textPrimary;
    ctx.font = `bold 42px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText("Paused", canvas.width / 2, canvas.height / 2 - 16);

    ctx.font = `14px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("Press P to resume", canvas.width / 2, canvas.height / 2 + 24);
  }

  // ── Utility: rounded rect ──────────────────────────────────
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Start ──────────────────────────────────────────────────
  init();
  draw();

})();
