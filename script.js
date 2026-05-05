/* ══════════════════════════════════════════════
   Ohm's Law — Interactive Presentation Script
   ══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Slide Navigation ──
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let current = 0;

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const counter = document.getElementById('slide-counter');
  const progressBar = document.getElementById('progress-bar');

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    slides[current].classList.remove('active');
    slides[current].classList.add('exit-left');
    setTimeout(() => slides[current === index ? current : (current)].classList.remove('exit-left'), 600);

    const prev = current;
    current = index;
    slides[current].classList.add('active');

    // Clean up previous slide after transition
    setTimeout(() => {
      slides[prev].classList.remove('exit-left');
    }, 650);

    updateNav();
  }

  function updateNav() {
    counter.textContent = `${current + 1} / ${totalSlides}`;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === totalSlides - 1;
    progressBar.style.width = `${((current + 1) / totalSlides) * 100}%`;
  }

  btnPrev.addEventListener('click', () => goToSlide(current - 1));
  btnNext.addEventListener('click', () => goToSlide(current + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goToSlide(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToSlide(current - 1); }
  });

  updateNav();

  // ── Background Particles ──
  const particlesContainer = document.getElementById('bg-particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 200 + 50;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 20 + 15) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    particlesContainer.appendChild(p);
  }

  // ── V-I-R Triangle Interactive ──
  const triBtns = document.querySelectorAll('.tri-btn');
  const triFormula = document.getElementById('tri-formula-display');
  const triV = document.getElementById('tri-v');
  const triI = document.getElementById('tri-i');
  const triR = document.getElementById('tri-r');

  const formulas = {
    V: { text: 'V = I × R', highlight: 'V', dim: [] },
    I: { text: 'I = V / R', highlight: 'I', dim: [] },
    R: { text: 'R = V / I', highlight: 'R', dim: [] },
  };

  function setTriangle(find) {
    triBtns.forEach(b => b.classList.toggle('active', b.dataset.find === find));
    const f = formulas[find];
    triFormula.textContent = f.text;

    // Animate: highlight the found variable, dim it in the triangle
    triV.style.opacity = find === 'V' ? '0.3' : '1';
    triI.style.opacity = find === 'I' ? '0.3' : '1';
    triR.style.opacity = find === 'R' ? '0.3' : '1';

    triV.style.fontSize = find === 'V' ? '36px' : '48px';
    triI.style.fontSize = find === 'I' ? '36px' : '48px';
    triR.style.fontSize = find === 'R' ? '36px' : '48px';
  }

  triBtns.forEach(btn => btn.addEventListener('click', () => setTriangle(btn.dataset.find)));

  // Click on SVG text elements
  triV.addEventListener('click', () => setTriangle('V'));
  triI.addEventListener('click', () => setTriangle('I'));
  triR.addEventListener('click', () => setTriangle('R'));

  // ── Interactive Simulator ──
  const voltageSlider = document.getElementById('sim-voltage');
  const resistanceSlider = document.getElementById('sim-resistance');
  const vDisplay = document.getElementById('sim-v-display');
  const rDisplay = document.getElementById('sim-r-display');
  const currentDisplay = document.getElementById('sim-current');
  const powerDisplay = document.getElementById('sim-power');

  function updateSimulator() {
    const v = parseFloat(voltageSlider.value);
    const r = parseFloat(resistanceSlider.value);
    const i = r > 0 ? v / r : 0;
    const p = v * i;

    vDisplay.textContent = v + ' V';
    rDisplay.textContent = r + ' Ω';
    currentDisplay.textContent = i.toFixed(3);
    powerDisplay.textContent = p.toFixed(2) + ' W';

    // Update circuit animation speed based on current
    electronSpeed = Math.min(i * 20, 8);
  }

  voltageSlider.addEventListener('input', updateSimulator);
  resistanceSlider.addEventListener('input', updateSimulator);

  // ── Animated Circuit Canvas ──
  const canvas = document.getElementById('circuit-canvas');
  const ctx = canvas.getContext('2d');
  let electronSpeed = 2.4;
  let electrons = [];
  let animFrame;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 200;
  }

  function initElectrons() {
    electrons = [];
    const w = canvas.width;
    const h = canvas.height;
    const path = getCircuitPath(w, h);
    const totalLength = getPathLength(path);

    for (let i = 0; i < 12; i++) {
      electrons.push({ progress: (i / 12) * totalLength, speed: 1 });
    }
  }

  function getCircuitPath(w, h) {
    const pad = 30;
    return [
      { x: pad, y: h / 2 },          // left (battery +)
      { x: pad, y: pad },              // top-left
      { x: w - pad, y: pad },          // top-right
      { x: w - pad, y: h / 2 },       // right (resistor)
      { x: w - pad, y: h - pad },      // bottom-right
      { x: pad, y: h - pad },          // bottom-left
      { x: pad, y: h / 2 },           // back to battery
    ];
  }

  function getPathLength(path) {
    let len = 0;
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
  }

  function getPointOnPath(path, dist) {
    let accumulated = 0;
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      const segLen = Math.sqrt(dx * dx + dy * dy);
      if (accumulated + segLen >= dist) {
        const t = (dist - accumulated) / segLen;
        return { x: path[i - 1].x + dx * t, y: path[i - 1].y + dy * t };
      }
      accumulated += segLen;
    }
    return path[path.length - 1];
  }

  function drawCircuit() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const path = getCircuitPath(w, h);
    const totalLength = getPathLength(path);

    // Draw wires
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = 'rgba(6,214,160,0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw battery symbol (left side)
    const bx = path[0].x;
    const by = path[0].y;
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3;
    // Long line (positive)
    ctx.beginPath(); ctx.moveTo(bx - 8, by - 18); ctx.lineTo(bx - 8, by + 18); ctx.stroke();
    // Short line (negative)
    ctx.beginPath(); ctx.moveTo(bx + 8, by - 10); ctx.lineTo(bx + 8, by + 10); ctx.stroke();
    // Labels
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 14px Outfit';
    ctx.fillText('+', bx - 20, by - 10);
    ctx.fillText('−', bx + 14, by - 4);
    ctx.fillText('V', bx - 6, by + 40);

    // Draw resistor symbol (right side, zigzag)
    const rx = path[3].x;
    const ry = path[3].y;
    const zigzagW = 12;
    const zigzagH = 40;
    ctx.beginPath();
    ctx.moveTo(rx, ry - zigzagH);
    for (let i = 0; i < 6; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      ctx.lineTo(rx + dir * zigzagW, ry - zigzagH + (i + 0.5) * (zigzagH * 2 / 6));
    }
    ctx.lineTo(rx, ry + zigzagH);
    ctx.strokeStyle = '#ef476f';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#ef476f';
    ctx.font = 'bold 14px Outfit';
    ctx.fillText('R', rx + 20, ry + 5);

    // Draw ammeter (top center)
    const ax = w / 2;
    const ay = path[1].y;
    ctx.beginPath();
    ctx.arc(ax, ay, 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#06d6a0';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#06d6a0';
    ctx.font = 'bold 13px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText('A', ax, ay + 5);
    ctx.textAlign = 'left';

    // Draw electrons
    electrons.forEach(e => {
      e.progress += electronSpeed;
      if (e.progress > totalLength) e.progress -= totalLength;
      const pt = getPointOnPath(path, e.progress);

      // Glow
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6,214,160,0.15)';
      ctx.fill();

      // Electron dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06d6a0';
      ctx.fill();
    });

    // Current direction arrow (top)
    const arrowX = w / 2 + 40;
    const arrowY = path[1].y;
    ctx.fillStyle = 'rgba(6,214,160,0.6)';
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY - 6);
    ctx.lineTo(arrowX + 10, arrowY);
    ctx.lineTo(arrowX, arrowY + 6);
    ctx.fill();

    animFrame = requestAnimationFrame(drawCircuit);
  }

  // Initialize and start animation
  function startCircuitAnimation() {
    resizeCanvas();
    initElectrons();
    if (animFrame) cancelAnimationFrame(animFrame);
    drawCircuit();
  }

  // ═══════════════════════════════════════════
  // ── ELECTRON WIRE ANIMATION ──
  // ═══════════════════════════════════════════
  const wireCanvas = document.getElementById('electron-wire-canvas');
  const wireCtx = wireCanvas.getContext('2d');
  const wireVoltage = document.getElementById('wire-voltage');
  let wireParticles = [];

  function resizeWireCanvas() {
    const r = wireCanvas.parentElement.getBoundingClientRect();
    wireCanvas.width = r.width;
    wireCanvas.height = 280;
  }

  function initWireParticles() {
    wireParticles = [];
    for (let i = 0; i < 40; i++) {
      wireParticles.push({
        x: Math.random() * wireCanvas.width,
        y: 100 + Math.random() * 80,
        r: 3 + Math.random() * 3,
        glow: Math.random(),
      });
    }
  }

  function drawWireAnimation() {
    const w = wireCanvas.width, h = wireCanvas.height;
    const speed = parseFloat(wireVoltage.value) * 0.8;
    wireCtx.clearRect(0, 0, w, h);

    // Wire body
    const wireTop = 90, wireBot = 190;
    wireCtx.fillStyle = 'rgba(100,116,139,0.15)';
    wireCtx.fillRect(0, wireTop, w, wireBot - wireTop);

    // Wire edges
    wireCtx.strokeStyle = 'rgba(6,214,160,0.4)';
    wireCtx.lineWidth = 2;
    wireCtx.beginPath(); wireCtx.moveTo(0, wireTop); wireCtx.lineTo(w, wireTop); wireCtx.stroke();
    wireCtx.beginPath(); wireCtx.moveTo(0, wireBot); wireCtx.lineTo(w, wireBot); wireCtx.stroke();

    // Atom lattice (fixed circles)
    wireCtx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < Math.ceil(w / 50); col++) {
        const ax = col * 50 + (row % 2) * 25 + 10;
        const ay = wireTop + 15 + row * 25;
        wireCtx.beginPath();
        wireCtx.arc(ax, ay, 8, 0, Math.PI * 2);
        wireCtx.fill();
      }
    }

    // Labels
    wireCtx.font = 'bold 14px Outfit';
    wireCtx.fillStyle = '#ffd166';
    wireCtx.textAlign = 'left';
    wireCtx.fillText('+ (Anode)', 10, wireTop - 12);
    wireCtx.textAlign = 'right';
    wireCtx.fillStyle = '#118ab2';
    wireCtx.fillText('− (Cathode)', w - 10, wireTop - 12);
    wireCtx.textAlign = 'left';

    // Label inside
    wireCtx.fillStyle = 'rgba(255,255,255,0.12)';
    wireCtx.font = '600 16px Outfit';
    wireCtx.textAlign = 'center';
    wireCtx.fillText('Conductor (Metal Wire)', w / 2, wireBot + 24);
    wireCtx.fillText('Drift velocity ∝ Voltage', w / 2, wireBot + 46);
    wireCtx.textAlign = 'left';

    // Electrons (moving dots)
    wireParticles.forEach(p => {
      p.x += speed;
      p.glow += 0.03;
      if (p.x > w + 10) { p.x = -10; p.y = 100 + Math.random() * 80; }

      const alpha = 0.4 + 0.3 * Math.sin(p.glow);
      // Glow
      wireCtx.beginPath();
      wireCtx.arc(p.x, p.y, p.r + 6, 0, Math.PI * 2);
      wireCtx.fillStyle = `rgba(6,214,160,${alpha * 0.25})`;
      wireCtx.fill();
      // Core
      wireCtx.beginPath();
      wireCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      wireCtx.fillStyle = `rgba(6,214,160,${alpha + 0.3})`;
      wireCtx.fill();
      // Label
      wireCtx.fillStyle = `rgba(255,255,255,${alpha})`;
      wireCtx.font = `${p.r * 2}px sans-serif`;
      wireCtx.textAlign = 'center';
      wireCtx.fillText('e⁻', p.x, p.y + p.r * 0.5);
      wireCtx.textAlign = 'left';
    });

    // Direction arrow
    const arrowY = 75;
    wireCtx.strokeStyle = 'rgba(6,214,160,0.6)';
    wireCtx.lineWidth = 2;
    wireCtx.beginPath(); wireCtx.moveTo(w * 0.3, arrowY); wireCtx.lineTo(w * 0.7, arrowY); wireCtx.stroke();
    wireCtx.fillStyle = '#06d6a0';
    wireCtx.beginPath();
    wireCtx.moveTo(w * 0.7, arrowY - 6); wireCtx.lineTo(w * 0.7 + 12, arrowY); wireCtx.lineTo(w * 0.7, arrowY + 6);
    wireCtx.fill();
    wireCtx.font = 'bold 12px Outfit';
    wireCtx.textAlign = 'center';
    wireCtx.fillText('Electron Drift Direction →', w / 2, arrowY - 10);
    wireCtx.textAlign = 'left';

    requestAnimationFrame(drawWireAnimation);
  }

  // ═══════════════════════════════════════════
  // ── WATER FLOW SIMULATION ──
  // ═══════════════════════════════════════════
  const waterCanvas = document.getElementById('water-flow-canvas');
  const waterCtx = waterCanvas.getContext('2d');
  const pressureSlider = document.getElementById('water-pressure');
  const pipeSlider = document.getElementById('water-pipe');
  const waterResult = document.getElementById('water-result');
  let waterDrops = [];

  function resizeWaterCanvas() {
    const r = waterCanvas.parentElement.getBoundingClientRect();
    waterCanvas.width = r.width;
    waterCanvas.height = 260;
  }

  function initWaterDrops() {
    waterDrops = [];
    for (let i = 0; i < 60; i++) {
      waterDrops.push({
        x: Math.random() * waterCanvas.width,
        y: 0,
        speed: 1 + Math.random() * 2,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function drawWaterFlow() {
    const w = waterCanvas.width, h = waterCanvas.height;
    const pressure = parseFloat(pressureSlider.value);
    const pipeWidth = parseFloat(pipeSlider.value);
    const flowRate = pressure * pipeWidth / 10;

    waterResult.textContent = `Flow Rate (Current): ${flowRate.toFixed(2)} units`;
    waterCtx.clearRect(0, 0, w, h);

    // Pipe dimensions
    const pipeH = 20 + pipeWidth * 8;  // pipe height varies with slider
    const pipeTop = (h - pipeH) / 2;
    const pipeBot = pipeTop + pipeH;
    const narrowW = 80;
    const narrowH = 10 + pipeWidth * 4;
    const narrowTop = (h - narrowH) / 2;
    const narrowBot = narrowTop + narrowH;
    const narrowStart = w * 0.4;
    const narrowEnd = w * 0.6;

    // Draw pipe outline
    wireCtx && 0; // avoid lint
    waterCtx.fillStyle = 'rgba(17,138,178,0.08)';
    // Left wide section
    waterCtx.fillRect(0, pipeTop, narrowStart, pipeH);
    // Narrow section
    waterCtx.fillRect(narrowStart, narrowTop, narrowEnd - narrowStart, narrowH);
    // Right wide section
    waterCtx.fillRect(narrowEnd, pipeTop, w - narrowEnd, pipeH);

    // Pipe borders
    waterCtx.strokeStyle = 'rgba(17,138,178,0.5)';
    waterCtx.lineWidth = 2;
    // Top edge
    waterCtx.beginPath();
    waterCtx.moveTo(0, pipeTop);
    waterCtx.lineTo(narrowStart, pipeTop);
    waterCtx.lineTo(narrowStart, narrowTop);
    waterCtx.lineTo(narrowEnd, narrowTop);
    waterCtx.lineTo(narrowEnd, pipeTop);
    waterCtx.lineTo(w, pipeTop);
    waterCtx.stroke();
    // Bottom edge
    waterCtx.beginPath();
    waterCtx.moveTo(0, pipeBot);
    waterCtx.lineTo(narrowStart, pipeBot);
    waterCtx.lineTo(narrowStart, narrowBot);
    waterCtx.lineTo(narrowEnd, narrowBot);
    waterCtx.lineTo(narrowEnd, pipeBot);
    waterCtx.lineTo(w, pipeBot);
    waterCtx.stroke();

    // Labels
    waterCtx.font = 'bold 12px Outfit';
    waterCtx.textAlign = 'center';
    waterCtx.fillStyle = '#ffd166';
    waterCtx.fillText('Pressure (V)', 60, pipeTop - 10);
    waterCtx.fillStyle = '#ef476f';
    waterCtx.fillText('Resistance', (narrowStart + narrowEnd) / 2, narrowTop - 10);
    waterCtx.fillStyle = '#06d6a0';
    waterCtx.fillText('Flow (I)', w - 60, pipeTop - 10);
    waterCtx.textAlign = 'left';

    // Water drops animation
    const dropSpeed = pressure * 0.6;
    waterDrops.forEach(d => {
      d.x += dropSpeed * d.speed;
      if (d.x > w + 10) {
        d.x = -10;
        d.y = pipeTop + 8 + Math.random() * (pipeH - 16);
      }

      // Constrain to pipe shape
      let top, bot;
      if (d.x >= narrowStart && d.x <= narrowEnd) {
        top = narrowTop + 4;
        bot = narrowBot - 4;
      } else {
        top = pipeTop + 4;
        bot = pipeBot - 4;
      }
      d.y = Math.max(top, Math.min(bot, d.y));

      // Speed up in narrow section
      const inNarrow = d.x >= narrowStart && d.x <= narrowEnd;
      const curSpeed = inNarrow ? dropSpeed * 2.5 : dropSpeed;
      if (inNarrow) d.x += curSpeed * 0.3;

      const alpha = inNarrow ? 0.9 : 0.6;
      waterCtx.beginPath();
      waterCtx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      waterCtx.fillStyle = `rgba(17,138,178,${alpha})`;
      waterCtx.fill();

      // Glow
      waterCtx.beginPath();
      waterCtx.arc(d.x, d.y, d.size + 4, 0, Math.PI * 2);
      waterCtx.fillStyle = `rgba(17,138,178,${alpha * 0.2})`;
      waterCtx.fill();
    });

    requestAnimationFrame(drawWaterFlow);
  }

  // ═══════════════════════════════════════════
  // ── V-I CHARACTERISTIC GRAPH ──
  // ═══════════════════════════════════════════
  const viCanvas = document.getElementById('vi-graph-canvas');
  const viCtx = viCanvas.getContext('2d');
  let viAnimProgress = 0;
  let viAnimR = 10;
  let viAnimFrame = null;
  let viDrawingAll = false;

  function resizeVICanvas() {
    const r = viCanvas.parentElement.getBoundingClientRect();
    viCanvas.width = r.width;
    viCanvas.height = 340;
  }

  function drawVIAxes() {
    const w = viCanvas.width, h = viCanvas.height;
    const pad = 60;
    viCtx.clearRect(0, 0, w, h);

    // Background grid
    viCtx.strokeStyle = 'rgba(255,255,255,0.04)';
    viCtx.lineWidth = 1;
    const gw = (w - pad * 2) / 10;
    const gh = (h - pad * 2) / 10;
    for (let i = 0; i <= 10; i++) {
      viCtx.beginPath(); viCtx.moveTo(pad + i * gw, pad); viCtx.lineTo(pad + i * gw, h - pad); viCtx.stroke();
      viCtx.beginPath(); viCtx.moveTo(pad, pad + i * gh); viCtx.lineTo(w - pad, pad + i * gh); viCtx.stroke();
    }

    // Axes
    viCtx.strokeStyle = 'rgba(255,255,255,0.4)';
    viCtx.lineWidth = 2;
    viCtx.beginPath(); viCtx.moveTo(pad, pad); viCtx.lineTo(pad, h - pad); viCtx.lineTo(w - pad, h - pad); viCtx.stroke();

    // Arrow heads
    viCtx.fillStyle = 'rgba(255,255,255,0.4)';
    viCtx.beginPath(); viCtx.moveTo(pad - 5, pad + 5); viCtx.lineTo(pad, pad - 5); viCtx.lineTo(pad + 5, pad + 5); viCtx.fill();
    viCtx.beginPath(); viCtx.moveTo(w - pad - 5, h - pad - 5); viCtx.lineTo(w - pad + 5, h - pad); viCtx.lineTo(w - pad - 5, h - pad + 5); viCtx.fill();

    // Labels
    viCtx.font = 'bold 14px Outfit';
    viCtx.fillStyle = '#06d6a0';
    viCtx.textAlign = 'center';
    viCtx.fillText('Current (I) in Amperes', pad - 30, pad - 15);
    viCtx.fillStyle = '#ffd166';
    viCtx.fillText('Voltage (V) in Volts', w / 2, h - pad + 35);
    viCtx.textAlign = 'left';

    // Scale values on axes
    viCtx.font = '11px Inter';
    viCtx.fillStyle = 'rgba(255,255,255,0.3)';
    const maxV = 100;
    for (let i = 0; i <= 10; i++) {
      const val = (maxV / 10 * i).toFixed(0);
      viCtx.fillText(val, pad + i * gw - 6, h - pad + 18);
    }
  }

  function animateVILine(R, color, label) {
    const w = viCanvas.width, h = viCanvas.height;
    const pad = 60;
    const graphW = w - pad * 2;
    const graphH = h - pad * 2;
    const maxV = 100;
    const maxI = 12;

    viAnimProgress += 2;
    const steps = Math.min(viAnimProgress, 100);

    viCtx.beginPath();
    viCtx.strokeStyle = color;
    viCtx.lineWidth = 3;
    viCtx.shadowColor = color;
    viCtx.shadowBlur = 8;

    for (let v = 0; v <= steps; v++) {
      const i = v / R;
      const px = pad + (v / maxV) * graphW;
      const py = (h - pad) - (i / maxI) * graphH;
      if (v === 0) viCtx.moveTo(px, py);
      else viCtx.lineTo(px, py);
    }
    viCtx.stroke();
    viCtx.shadowBlur = 0;

    // Moving dot at the tip
    const tipV = steps;
    const tipI = tipV / R;
    const tipX = pad + (tipV / maxV) * graphW;
    const tipY = (h - pad) - (tipI / maxI) * graphH;
    viCtx.beginPath();
    viCtx.arc(tipX, tipY, 6, 0, Math.PI * 2);
    viCtx.fillStyle = color;
    viCtx.fill();

    // Label
    if (steps >= 80) {
      viCtx.font = 'bold 13px Outfit';
      viCtx.fillStyle = color;
      viCtx.fillText(label, tipX + 10, tipY - 8);
    }

    return steps >= 100;
  }

  // Make drawVIGraph globally accessible for onclick
  window.drawVIGraph = function(R) {
    // Update button states
    document.querySelectorAll('#graph-r1,#graph-r2,#graph-r3,#graph-all').forEach(b => b.classList.remove('active'));
    if (R === 10) document.getElementById('graph-r1').classList.add('active');
    if (R === 20) document.getElementById('graph-r2').classList.add('active');
    if (R === 50) document.getElementById('graph-r3').classList.add('active');

    viDrawingAll = false;
    viAnimR = R;
    viAnimProgress = 0;
    if (viAnimFrame) cancelAnimationFrame(viAnimFrame);
    resizeVICanvas();

    const colors = { 10: '#06d6a0', 20: '#ffd166', 50: '#ef476f' };

    function step() {
      drawVIAxes();
      const done = animateVILine(R, colors[R] || '#06d6a0', `R=${R}Ω`);
      if (!done) viAnimFrame = requestAnimationFrame(step);
    }
    step();
  };

  window.drawVIGraphAll = function() {
    document.querySelectorAll('#graph-r1,#graph-r2,#graph-r3,#graph-all').forEach(b => b.classList.remove('active'));
    document.getElementById('graph-all').classList.add('active');
    viDrawingAll = true;
    viAnimProgress = 0;
    if (viAnimFrame) cancelAnimationFrame(viAnimFrame);
    resizeVICanvas();

    function step() {
      drawVIAxes();
      animateVILine(10, '#06d6a0', 'R=10Ω');
      animateVILine(20, '#ffd166', 'R=20Ω');
      const done = animateVILine(50, '#ef476f', 'R=50Ω');
      if (!done) viAnimFrame = requestAnimationFrame(step);
    }
    step();
  };

  // ── Start all animations on load ──
  window.addEventListener('load', () => {
    startCircuitAnimation();
    updateSimulator();

    // Electron wire
    resizeWireCanvas();
    initWireParticles();
    drawWireAnimation();

    // Water flow
    resizeWaterCanvas();
    initWaterDrops();
    drawWaterFlow();

    // V-I graph (default R=10)
    resizeVICanvas();
    drawVIGraph(10);
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    initElectrons();
    resizeWireCanvas();
    resizeWaterCanvas();
    resizeVICanvas();
  });

})();
