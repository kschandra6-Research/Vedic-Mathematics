/**
 * 2D Visualizations & Dynamic Diagram Renderer
 * For Vedic Mathematics Studio
 * Concept & Design by K.S.Chandra 2026
 */

const Visuals2D = {
  // Master dispatcher to draw the relevant 2D visualization on canvas
  render2DVisual(canvasId, calculationData, activeStepIndex = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !calculationData) return;

    const type = calculationData.type;
    if (type === "urdhva_tiryagbhyam") {
      this.drawCrissCross(canvasId, calculationData, activeStepIndex);
    } else if (type === "straight_line_2points" || type === "sankalana_vyavakalan" || type === "paravartya_linear" || type === "anurupye_sunyamanyat") {
      this.drawCoordinateGraph(canvasId, calculationData, activeStepIndex);
    } else if (type === "area_feet_inches") {
      this.drawCarpentryArea(canvasId, calculationData, activeStepIndex);
    } else if (type === "nikhilam_multiplication" || type === "anurupyena_multiplication") {
      this.drawNikhilamMatrix(canvasId, calculationData, activeStepIndex);
    } else if (type === "square_ending_5" || type === "yavadunam_square" || type === "antyayor_dasakepi" || type === "ekanyunena_purvena") {
      this.drawSplitSquareDiagram(canvasId, calculationData, activeStepIndex);
    } else if (type === "dwandwa_square") {
      this.drawDuplexDiagram(canvasId, calculationData, activeStepIndex);
    } else if (type === "anurupyena_cube") {
      this.drawCubeGPDiagram(canvasId, calculationData, activeStepIndex);
    } else if (type === "nikhilam_division" || type === "paravartya_division") {
      this.drawDivisionMatrix(canvasId, calculationData, activeStepIndex);
    } else {
      this.drawGenericBoard(canvasId, calculationData, activeStepIndex);
    }
  },

  // Helper to setup high-DPI canvas
  prepCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width || 600;
    const height = canvas.height || 340;
    ctx.clearRect(0, 0, width, height);

    // Deep cosmic background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#080c18");
    bgGrad.addColorStop(0.5, "#0d1326");
    bgGrad.addColorStop(1, "#111827");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    return { ctx, width, height };
  },

  // 1. Criss-Cross Pattern for Urdhva-Tiryagbhyam (Full step responsiveness)
  drawCrissCross(canvasId, calculationData, activeStepIndex = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    const { p1, p2, maxLen, stepCrossProducts, numColumns } = calculationData;
    if (!p1 || !p2) return;

    const spacingX = width / (maxLen + 1);
    const row1Y = height * 0.30;
    const row2Y = height * 0.65;

    // Header Title
    ctx.font = "bold 14px 'Segoe UI', system-ui";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.fillText("Ūrdhva - Tiryagbhyām (Criss-Cross Matrix Visualizer)", width / 2, 24);

    // Map activeStepIndex to cross products:
    // Step 0 = Alignment stage
    // Step 1 to numColumns = Criss-cross steps (index k = activeStepIndex - 1)
    // Step > numColumns = Final accumulated result
    const isAlignmentStep = activeStepIndex === 0;
    const isFinalStep = activeStepIndex > numColumns;
    const crossIdx = activeStepIndex - 1;
    const currentPairs = (!isAlignmentStep && !isFinalStep && stepCrossProducts && stepCrossProducts[crossIdx]) 
      ? stepCrossProducts[crossIdx] 
      : [];

    // Draw lines
    if (isFinalStep) {
      // Final step: draw all column lines softly
      (stepCrossProducts || []).forEach((pairs, cIdx) => {
        pairs.forEach(pair => {
          const x1 = (pair.i + 1) * spacingX;
          const x2 = (pair.j + 1) * spacingX;
          ctx.save();
          ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, row1Y + 18);
          ctx.lineTo(x2, row2Y - 18);
          ctx.stroke();
          ctx.restore();
        });
      });
    } else if (!isAlignmentStep && currentPairs.length > 0) {
      // Active criss-cross step: draw vibrant laser lines
      currentPairs.forEach((pair, idx) => {
        const x1 = (pair.i + 1) * spacingX;
        const y1 = row1Y;
        const x2 = (pair.j + 1) * spacingX;
        const y2 = row2Y;

        ctx.save();
        const isVertical = pair.i === pair.j;
        ctx.strokeStyle = isVertical ? "#f59e0b" : (idx % 2 === 0 ? "#f43f5e" : "#06b6d4");
        ctx.lineWidth = 4;
        ctx.shadowColor = isVertical ? "rgba(245, 158, 11, 0.9)" : "rgba(6, 182, 212, 0.9)";
        ctx.shadowBlur = 16;

        ctx.beginPath();
        ctx.moveTo(x1, y1 + 18);
        ctx.lineTo(x2, y2 - 18);
        ctx.stroke();

        // Terminal glowing node dots
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x1, y1 + 18, 5, 0, Math.PI * 2);
        ctx.arc(x2, y2 - 18, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Draw Digits
    for (let i = 0; i < maxLen; i++) {
      const x = (i + 1) * spacingX;
      const isP1Active = currentPairs.some(p => p.i === i);
      const isP2Active = currentPairs.some(p => p.j === i);

      // Multiplicand digit badge
      ctx.save();
      if (isP1Active) {
        ctx.fillStyle = "rgba(244, 63, 94, 0.3)";
        ctx.beginPath();
        ctx.arc(x, row1Y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(244, 63, 94, 0.8)";
        ctx.shadowBlur = 12;
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(30, 41, 59, 0.6)";
        ctx.beginPath();
        ctx.arc(x, row1Y, 20, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = "bold 26px 'Fira Code', monospace";
      ctx.fillStyle = isP1Active ? "#ffffff" : (isAlignmentStep ? "#38bdf8" : "#94a3b8");
      ctx.fillText(String(p1[i]), x, row1Y + 9);
      ctx.restore();

      // Multiplier digit badge
      ctx.save();
      if (isP2Active) {
        ctx.fillStyle = "rgba(6, 182, 212, 0.3)";
        ctx.beginPath();
        ctx.arc(x, row2Y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
        ctx.shadowBlur = 12;
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(30, 41, 59, 0.6)";
        ctx.beginPath();
        ctx.arc(x, row2Y, 20, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = "bold 26px 'Fira Code', monospace";
      ctx.fillStyle = isP2Active ? "#ffffff" : (isAlignmentStep ? "#38bdf8" : "#94a3b8");
      ctx.fillText(String(p2[i]), x, row2Y + 9);
      ctx.restore();
    }

    // Step footer banner
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(0, height - 44, width, 44);
    ctx.strokeStyle = "#1e293b";
    ctx.strokeRect(0, height - 44, width, 44);

    ctx.textAlign = "center";
    if (isAlignmentStep) {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "600 13px 'Segoe UI', system-ui";
      ctx.fillText(`Step 1: Align Multiplicand (${calculationData.n1}) & Multiplier (${calculationData.n2}) in Place-Value Columns`, width / 2, height - 17);
    } else if (isFinalStep) {
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 15px 'Segoe UI', system-ui";
      ctx.fillText(`✓ Final Product = ${calculationData.result} (All Columns Accumulated & Carries Resolved)`, width / 2, height - 17);
    } else {
      const subTot = calculationData.stepSubTotals ? calculationData.stepSubTotals[crossIdx] : "";
      const pairsDesc = currentPairs.map(p => `(${p.d1}×${p.d2})`).join(" + ");
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 14px 'Segoe UI', system-ui";
      ctx.fillText(`Step ${activeStepIndex + 1} of ${numColumns + 2}:  ${pairsDesc}  =  ${subTot}`, width / 2, height - 17);
    }
  },

  // 2. Split Square Visual (Ekadhikena, Yavadunam, Antyayor, Ekanyunena)
  drawSplitSquareDiagram(canvasId, data, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    ctx.font = "bold 14px 'Segoe UI'";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.fillText(`${data.sutraName || 'Vedic Squaring & Partitioning'} - Step ${activeStep + 1}`, width / 2, 24);

    const pad = 30;
    const boxW = (width - 3 * pad) / 2;
    const boxH = 130;
    const boxY = height * 0.28;

    // Determine values
    const lhsVal = data.lhs !== undefined ? data.lhs : (data.finalLhs !== undefined ? data.finalLhs : "--");
    const rhsVal = data.rhs !== undefined ? data.rhs : (data.finalRhsStr !== undefined ? data.finalRhsStr : (data.rhsProd !== undefined ? data.rhsProd : "25"));

    // Step states:
    // Step 0: Input Decomposition
    // Step 1: LHS Calculation Active
    // Step 2: RHS Calculation Active
    // Step >= 3: Final Combination Active
    const isStep0 = activeStep === 0;
    const isLhsActive = activeStep === 1;
    const isRhsActive = activeStep === 2;
    const isFinalActive = activeStep >= 3;

    // Center Input Card
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = isStep0 ? "#38bdf8" : "#334155";
    ctx.lineWidth = isStep0 ? 2.5 : 1;
    if (isStep0) {
      ctx.shadowColor = "rgba(56, 189, 248, 0.6)";
      ctx.shadowBlur = 12;
    }
    ctx.fillRect(width / 2 - 120, 36, 240, 42);
    ctx.strokeRect(width / 2 - 120, 36, 240, 42);

    ctx.font = "bold 15px 'Fira Code', monospace";
    ctx.fillStyle = isStep0 ? "#ffffff" : "#94a3b8";
    const inDisplay = data.input || data.n || (data.n1 && data.n2 ? `${data.n1} × ${data.n2}` : (data.multiplicand ? `${data.multiplicand} × ${data.multiplier}` : "Input"));
    ctx.fillText(`Number: [ ${inDisplay} ]`, width / 2, 63);
    ctx.restore();

    // Left Box: LHS
    ctx.save();
    ctx.fillStyle = isLhsActive ? "rgba(56, 189, 248, 0.25)" : "rgba(30, 41, 59, 0.4)";
    ctx.fillRect(pad, boxY, boxW, boxH);
    ctx.strokeStyle = isLhsActive ? "#38bdf8" : (isFinalActive ? "#10b981" : "#334155");
    ctx.lineWidth = isLhsActive ? 3 : 1.5;
    if (isLhsActive) {
      ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
      ctx.shadowBlur = 18;
    }
    ctx.strokeRect(pad, boxY, boxW, boxH);

    ctx.fillStyle = isLhsActive ? "#38bdf8" : "#94a3b8";
    ctx.font = "bold 13px 'Segoe UI'";
    ctx.fillText("LEFT-HAND SIDE (L.H.S)", pad + boxW / 2, boxY + 28);
    ctx.font = "bold 32px 'Fira Code', monospace";
    ctx.fillStyle = isLhsActive || isFinalActive ? "#ffffff" : "#64748b";
    ctx.fillText(String(lhsVal), pad + boxW / 2, boxY + 75);

    ctx.font = "12px 'Segoe UI'";
    ctx.fillStyle = isLhsActive ? "#38bdf8" : "#64748b";
    const lhsSub = data.previous !== undefined ? `${data.previous} × (${data.previous} + 1)` : (data.deficit !== undefined ? `${data.n} ${data.isDeficit ? '-' : '+'} ${data.deficit}` : "Adjusted Prefix");
    ctx.fillText(lhsSub, pad + boxW / 2, boxY + 110);
    ctx.restore();

    // Right Box: RHS
    const rX = pad * 2 + boxW;
    ctx.save();
    ctx.fillStyle = isRhsActive ? "rgba(244, 63, 94, 0.25)" : "rgba(30, 41, 59, 0.4)";
    ctx.fillRect(rX, boxY, boxW, boxH);
    ctx.strokeStyle = isRhsActive ? "#f43f5e" : (isFinalActive ? "#10b981" : "#334155");
    ctx.lineWidth = isRhsActive ? 3 : 1.5;
    if (isRhsActive) {
      ctx.shadowColor = "rgba(244, 63, 94, 0.8)";
      ctx.shadowBlur = 18;
    }
    ctx.strokeRect(rX, boxY, boxW, boxH);

    ctx.fillStyle = isRhsActive ? "#f43f5e" : "#94a3b8";
    ctx.font = "bold 13px 'Segoe UI'";
    ctx.fillText("RIGHT-HAND SIDE (R.H.S)", rX + boxW / 2, boxY + 28);
    ctx.font = "bold 32px 'Fira Code', monospace";
    ctx.fillStyle = isRhsActive || isFinalActive ? "#ffffff" : "#64748b";
    ctx.fillText(String(rhsVal), rX + boxW / 2, boxY + 75);

    ctx.font = "12px 'Segoe UI'";
    ctx.fillStyle = isRhsActive ? "#f43f5e" : "#64748b";
    const rhsSub = data.u1 !== undefined ? `${data.u1} × ${data.u2}` : (data.deficit !== undefined ? `(${data.deficit})²` : "5² = 25");
    ctx.fillText(rhsSub, rX + boxW / 2, boxY + 110);
    ctx.restore();

    // Connecting Bridge / Slash
    ctx.save();
    ctx.strokeStyle = isFinalActive ? "#10b981" : "#475569";
    ctx.lineWidth = isFinalActive ? 4 : 2;
    if (isFinalActive) {
      ctx.shadowColor = "rgba(16, 185, 129, 0.9)";
      ctx.shadowBlur = 15;
    }
    ctx.beginPath();
    ctx.moveTo(width / 2 + 6, boxY + 20);
    ctx.lineTo(width / 2 - 6, boxY + boxH - 20);
    ctx.stroke();
    ctx.restore();

    // Combined Result Banner
    ctx.save();
    ctx.fillStyle = isFinalActive ? "rgba(16, 185, 129, 0.25)" : "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(pad, boxY + boxH + 18, width - 2 * pad, 48);
    ctx.strokeStyle = isFinalActive ? "#10b981" : "#334155";
    ctx.lineWidth = isFinalActive ? 2.5 : 1;
    if (isFinalActive) {
      ctx.shadowColor = "rgba(16, 185, 129, 0.7)";
      ctx.shadowBlur = 12;
    }
    ctx.strokeRect(pad, boxY + boxH + 18, width - 2 * pad, 48);

    ctx.fillStyle = isFinalActive ? "#34d399" : "#94a3b8";
    ctx.font = "bold 18px 'Fira Code', monospace";
    ctx.fillText(`Combined Vedic Result = ${data.result}`, width / 2, boxY + boxH + 48);
    ctx.restore();
  },

  // 3. Nikhilam Matrix (Deviations with active cross/vertical arrows)
  drawNikhilamMatrix(canvasId, data, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    ctx.font = "bold 14px 'Segoe UI'";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.fillText(`Nikhilam Base Scheme (Base = ${data.base || 100}) - Step ${activeStep + 1}`, width / 2, 24);

    const leftX = width * 0.32;
    const rightX = width * 0.68;
    const row1Y = height * 0.30;
    const row2Y = height * 0.48;
    const lineY = height * 0.60;
    const resY = height * 0.76;

    const isStep0 = activeStep === 0; // Base identification
    const isStep1 = activeStep === 1; // Deviations
    const isStep2 = activeStep === 2; // Cross subtraction/addition (LHS)
    const isStep3 = activeStep === 3; // Vertical product of deviations (RHS)
    const isFinal = activeStep >= 4; // Final combined

    // Draw Numbers
    ctx.font = "bold 28px 'Fira Code', monospace";
    ctx.fillStyle = isStep0 || isStep2 ? "#38bdf8" : "#f8fafc";
    ctx.fillText(String(data.n1), leftX, row1Y);
    ctx.fillText(String(data.n2), leftX, row2Y);

    // Draw Deviations
    const d1Str = data.d1 >= 0 ? "+" + data.d1 : String(data.d1);
    const d2Str = data.d2 >= 0 ? "+" + data.d2 : String(data.d2);
    ctx.fillStyle = (isStep1 || isStep3) ? "#f59e0b" : (data.d1 >= 0 ? "#10b981" : "#f43f5e");
    ctx.fillText(d1Str, rightX, row1Y);
    ctx.fillStyle = (isStep1 || isStep3) ? "#f59e0b" : (data.d2 >= 0 ? "#10b981" : "#f43f5e");
    ctx.fillText(d2Str, rightX, row2Y);

    // Cross-arrows: n1 to d2 and n2 to d1 (Active on step 2)
    ctx.save();
    if (isStep2) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "rgba(56, 189, 248, 0.9)";
      ctx.shadowBlur = 15;
    } else {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
    }
    ctx.beginPath();
    ctx.moveTo(leftX + 35, row1Y - 6);
    ctx.lineTo(rightX - 35, row2Y - 6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftX + 35, row2Y - 6);
    ctx.lineTo(rightX - 35, row1Y - 6);
    ctx.stroke();
    ctx.restore();

    // Vertical arrow on deviations (d1 x d2, active on step 3)
    ctx.save();
    if (isStep3) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.shadowColor = "rgba(245, 158, 11, 0.9)";
      ctx.shadowBlur = 16;
    } else {
      ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
      ctx.lineWidth = 1.5;
    }
    ctx.beginPath();
    ctx.moveTo(rightX, row1Y + 12);
    ctx.lineTo(rightX, row2Y - 24);
    ctx.stroke();
    ctx.restore();

    // Divider line
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, lineY);
    ctx.lineTo(width * 0.85, lineY);
    ctx.stroke();

    // Slanted slash divider
    const midX = width / 2;
    ctx.save();
    ctx.strokeStyle = isFinal ? "#10b981" : "#38bdf8";
    ctx.lineWidth = isFinal ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(midX + 10, lineY - 12);
    ctx.lineTo(midX - 10, lineY + 60);
    ctx.stroke();
    ctx.restore();

    // Bottom parts (LHS and RHS)
    ctx.font = "bold 26px 'Fira Code', monospace";
    ctx.fillStyle = isStep2 ? "#38bdf8" : (isFinal ? "#34d399" : "#64748b");
    ctx.fillText(String(data.lhs), leftX, resY);

    ctx.fillStyle = isStep3 ? "#f59e0b" : (isFinal ? "#34d399" : "#64748b");
    ctx.fillText(String(data.rhsProd), rightX, resY);

    ctx.font = "600 12px 'Segoe UI'";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("L.H.S (Cross Sum/Diff)", leftX, resY + 22);
    ctx.fillText("R.H.S (Vertical Prod)", rightX, resY + 22);

    // Footer result
    ctx.fillStyle = isFinal ? "#10b981" : "#38bdf8";
    ctx.font = "bold 15px 'Segoe UI'";
    ctx.fillText(`Result: ${data.result}`, width / 2, height - 12);
  },

  // 4. Duplex Sliding Window Diagram (Dwandwa Yoga)
  drawDuplexDiagram(canvasId, data, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    ctx.font = "bold 14px 'Segoe UI'";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.fillText("Dvandva-Yoga (Duplex Window Analysis)", width / 2, 24);

    const steps = data.duplexSteps || [];
    const count = steps.length;
    if (count === 0) return;

    const barW = Math.min(55, (width - 60) / count - 10);
    const startX = (width - (count * (barW + 10))) / 2;
    const maxVal = Math.max(...steps.map(s => s.dVal), 1);

    steps.forEach((s, idx) => {
      const x = startX + idx * (barW + 10);
      const barH = (s.dVal / maxVal) * 120 + 15;
      const y = height * 0.65 - barH;
      const isCur = idx === activeStep;

      ctx.save();
      ctx.fillStyle = isCur ? "#f43f5e" : "rgba(2, 132, 199, 0.4)";
      if (isCur) {
        ctx.shadowColor = "rgba(244, 63, 94, 0.9)";
        ctx.shadowBlur = 18;
      }
      ctx.fillRect(x, y, barW, barH);
      ctx.strokeStyle = isCur ? "#ffffff" : "#38bdf8";
      ctx.lineWidth = isCur ? 3 : 1;
      ctx.strokeRect(x, y, barW, barH);

      ctx.font = "bold 13px 'Fira Code'";
      ctx.fillStyle = isCur ? "#ffffff" : "#94a3b8";
      ctx.fillText(String(s.dVal), x + barW / 2, y - 8);

      ctx.font = "bold 11px 'Segoe UI'";
      ctx.fillStyle = isCur ? "#38bdf8" : "#64748b";
      ctx.fillText(`D(${s.group})`, x + barW / 2, height * 0.65 + 18);
      ctx.restore();
    });

    // Active Duplex Callout
    const curStepData = steps[activeStep] || steps[0];
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(20, height - 48, width - 40, 38);
    ctx.strokeStyle = "#38bdf8";
    ctx.strokeRect(20, height - 48, width - 40, 38);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px 'Fira Code', monospace";
    ctx.fillText(`${curStepData.desc}  ⟹  Square = ${data.result}`, width / 2, height - 24);
  },

  // 5. Cubing GP Row Diagram (Anurupyena Cubing)
  drawCubeGPDiagram(canvasId, data, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    ctx.font = "bold 14px 'Segoe UI'";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.fillText(`Ānurūpyeṇa Cubing Scheme: ${data.num || 14}³ - Step ${activeStep + 1}`, width / 2, 24);

    const a = data.a !== undefined ? data.a : Math.floor((data.num || 14) / 10);
    const b = data.b !== undefined ? data.b : (data.num || 14) % 10;
    const t1 = data.t1 !== undefined ? data.t1 : a * a * a;
    const t2 = data.t2 !== undefined ? data.t2 : a * a * b;
    const t3 = data.t3 !== undefined ? data.t3 : a * b * b;
    const t4 = data.t4 !== undefined ? data.t4 : b * b * b;
    const d2 = data.d2 !== undefined ? data.d2 : 2 * t2;
    const d3 = data.d3 !== undefined ? data.d3 : 2 * t3;

    const cols = [
      { top: t1, bot: "", label: "a³", desc: `${a}³` },
      { top: t2, bot: d2, label: "a²b", desc: `${a}²·${b}` },
      { top: t3, bot: d3, label: "ab²", desc: `${a}·${b}²` },
      { top: t4, bot: "", label: "b³", desc: `${b}³` }
    ];

    const colW = width / 5;
    cols.forEach((col, idx) => {
      const x = (idx + 1) * colW;
      const isColActive = activeStep === 0 || (activeStep === 1 && (idx === 1 || idx === 2)) || activeStep >= 2;

      ctx.save();
      ctx.font = "600 13px 'Segoe UI'";
      ctx.fillStyle = isColActive ? "#38bdf8" : "#64748b";
      ctx.fillText(col.label, x, height * 0.28);

      // Row 1
      ctx.font = "bold 26px 'Fira Code'";
      ctx.fillStyle = isColActive ? "#ffffff" : "#475569";
      ctx.fillText(String(col.top), x, height * 0.44);

      // Row 2 (Middle terms doubled)
      if (col.bot !== "") {
        ctx.fillStyle = activeStep >= 1 ? "#f59e0b" : "#475569";
        ctx.fillText(String(col.bot), x, height * 0.60);
      }
      ctx.restore();
    });

    // Divider line
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(colW * 0.5, height * 0.70);
    ctx.lineTo(colW * 4.5, height * 0.70);
    ctx.stroke();

    // Result
    ctx.fillStyle = activeStep >= 2 ? "#10b981" : "#94a3b8";
    ctx.font = "bold 20px 'Fira Code'";
    ctx.fillText(`= ${data.result}`, width / 2, height * 0.86);
  },

  // 6. Division Matrix Diagram
  drawDivisionMatrix(canvasId, data, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    ctx.font = "bold 14px 'Segoe UI'";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.fillText(`Vedic Division Scheme: ${data.dividend} ÷ ${data.divisor} - Step ${activeStep + 1}`, width / 2, 28);

    const midX = width / 2;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(midX, height * 0.22);
    ctx.lineTo(midX, height * 0.75);
    ctx.stroke();

    // Quotient Left
    ctx.fillStyle = activeStep >= 1 ? "#38bdf8" : "#64748b";
    ctx.font = "bold 20px 'Segoe UI'";
    ctx.fillText("Quotient (Q)", midX * 0.5, height * 0.38);
    ctx.font = "bold 40px 'Fira Code'";
    ctx.fillStyle = activeStep >= 1 ? "#ffffff" : "#475569";
    ctx.fillText(String(data.quotient), midX * 0.5, height * 0.58);

    // Remainder Right
    ctx.fillStyle = activeStep >= 2 ? "#f43f5e" : "#64748b";
    ctx.font = "bold 20px 'Segoe UI'";
    ctx.fillText("Remainder (R)", midX * 1.5, height * 0.38);
    ctx.font = "bold 40px 'Fira Code'";
    ctx.fillStyle = activeStep >= 2 ? "#ffffff" : "#475569";
    ctx.fillText(String(data.remainder), midX * 1.5, height * 0.58);

    // Footer
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 15px 'Segoe UI'";
    ctx.fillText(`Vedic Formula: Dividend = Divisor × Q + R`, width / 2, height - 16);
  },

  // 7. 2D Coordinate Graph for Straight Line & Linear Equations
  drawCoordinateGraph(canvasId, lineData, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 24;

    // Grid lines
    ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
    ctx.lineWidth = 1;
    for (let x = centerX % scale; x < width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = centerY % scale; y < height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); ctx.stroke();

    const toCanvasX = (mx) => centerX + mx * scale;
    const toCanvasY = (my) => centerY - my * scale;

    if (lineData.type === "straight_line_2points") {
      const { x1, y1, x2, y2, aCoeff, bCoeff, cConst, eqStr } = lineData;

      // Draw Line (Active on step >= 2)
      if (activeStep >= 2) {
        ctx.save();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3.5;
        ctx.shadowColor = "rgba(56, 189, 248, 0.9)";
        ctx.shadowBlur = 12;

        let startX = -12, endX = 12;
        let startY = 0, endY = 0;
        if (bCoeff !== 0) {
          startY = (cConst - aCoeff * startX) / bCoeff;
          endY = (cConst - aCoeff * endX) / bCoeff;
        } else {
          startX = cConst / aCoeff; endX = startX;
          startY = -12; endY = 12;
        }
        ctx.beginPath();
        ctx.moveTo(toCanvasX(startX), toCanvasY(startY));
        ctx.lineTo(toCanvasX(endX), toCanvasY(endY));
        ctx.stroke();
        ctx.restore();
      }

      // Plot P1 (Active on step >= 0)
      const cx1 = toCanvasX(x1), cy1 = toCanvasY(y1);
      ctx.save();
      ctx.fillStyle = "#f43f5e";
      ctx.shadowColor = "rgba(244, 63, 94, 0.9)";
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(cx1, cy1, 7, 0, Math.PI * 2); ctx.fill();
      ctx.font = "bold 12px 'Segoe UI'";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`P₁ (${x1}, ${y1})`, cx1 + 12, cy1 - 10);
      ctx.restore();

      // Plot P2 (Active on step >= 1)
      if (activeStep >= 1) {
        const cx2 = toCanvasX(x2), cy2 = toCanvasY(y2);
        ctx.save();
        ctx.fillStyle = "#10b981";
        ctx.shadowColor = "rgba(16, 185, 129, 0.9)";
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(cx2, cy2, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillText(`P₂ (${x2}, ${y2})`, cx2 + 12, cy2 - 10);
        ctx.restore();
      }

      // Title badge
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(10, 10, 260, 34);
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(10, 10, 260, 34);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 14px 'Fira Code', monospace";
      ctx.fillText(eqStr, 20, 32);
    } else {
      // Linear systems solver visualization (Sankalana / Anurupye)
      const fx = lineData.finalX !== undefined ? lineData.finalX : (lineData.sol ? lineData.sol.x : 0);
      const fy = lineData.finalY !== undefined ? lineData.finalY : (lineData.sol ? lineData.sol.y : 0);
      const cfx = toCanvasX(fx);
      const cfy = toCanvasY(fy);

      ctx.save();
      ctx.fillStyle = "#f59e0b";
      ctx.shadowColor = "rgba(245, 158, 11, 0.9)";
      ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(cfx, cfy, 8, 0, Math.PI * 2); ctx.fill();
      ctx.font = "bold 13px 'Segoe UI'";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`Solution (${fx}, ${fy})`, cfx + 12, cfy - 12);
      ctx.restore();
    }
  },

  // 8. Carpentry Area Decomposition
  drawCarpentryArea(canvasId, areaData, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    const { lFt, lIn, bFt, bIn, firstByFirst, crossWise, lastByLast, totalSqFt, remSqIn } = areaData;

    const pad = 35;
    const rectW = width - 2 * pad;
    const rectH = height - 2 * pad - 35;
    const splitX = pad + rectW * 0.65;
    const splitY = pad + rectH * 0.65;

    // Block 1 (First x First)
    const isB1 = activeStep === 0;
    ctx.fillStyle = isB1 ? "rgba(56, 189, 248, 0.4)" : "rgba(56, 189, 248, 0.15)";
    ctx.fillRect(pad, pad, splitX - pad, splitY - pad);
    ctx.strokeStyle = isB1 ? "#38bdf8" : "#0284c7";
    ctx.lineWidth = isB1 ? 3 : 1;
    ctx.strokeRect(pad, pad, splitX - pad, splitY - pad);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.fillText(`First × First (Feet)`, (pad + splitX) / 2, (pad + splitY) / 2 - 8);
    ctx.fillText(`${lFt}' × ${bFt}' = ${firstByFirst} sq. ft.`, (pad + splitX) / 2, (pad + splitY) / 2 + 14);

    // Block 2 (Cross 1)
    const isB2 = activeStep === 1;
    ctx.fillStyle = isB2 ? "rgba(168, 85, 247, 0.4)" : "rgba(168, 85, 247, 0.15)";
    ctx.fillRect(splitX, pad, pad + rectW - splitX, splitY - pad);
    ctx.strokeStyle = isB2 ? "#c084fc" : "#a855f7";
    ctx.lineWidth = isB2 ? 3 : 1;
    ctx.strokeRect(splitX, pad, pad + rectW - splitX, splitY - pad);
    ctx.fillStyle = "#e9d5ff";
    ctx.fillText(`Cross 1`, (splitX + pad + rectW) / 2, (pad + splitY) / 2 - 6);
    ctx.fillText(`${lIn}" × ${bFt}' = ${lIn * bFt}`, (splitX + pad + rectW) / 2, (pad + splitY) / 2 + 12);

    // Block 3 (Cross 2)
    const isB3 = activeStep === 2;
    ctx.fillStyle = isB3 ? "rgba(236, 72, 153, 0.4)" : "rgba(236, 72, 153, 0.15)";
    ctx.fillRect(pad, splitY, splitX - pad, pad + rectH - splitY);
    ctx.strokeStyle = isB3 ? "#f472b6" : "#ec4899";
    ctx.lineWidth = isB3 ? 3 : 1;
    ctx.strokeRect(pad, splitY, splitX - pad, pad + rectH - splitY);
    ctx.fillStyle = "#fbcfe8";
    ctx.fillText(`Cross 2`, (pad + splitX) / 2, (splitY + pad + rectH) / 2 - 6);
    ctx.fillText(`${lFt}' × ${bIn}" = ${lFt * bIn}`, (pad + splitX) / 2, (splitY + pad + rectH) / 2 + 12);

    // Block 4 (Last x Last)
    const isB4 = activeStep === 3;
    ctx.fillStyle = isB4 ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.15)";
    ctx.fillRect(splitX, splitY, pad + rectW - splitX, pad + rectH - splitY);
    ctx.strokeStyle = isB4 ? "#34d399" : "#10b981";
    ctx.lineWidth = isB4 ? 3 : 1;
    ctx.strokeRect(splitX, splitY, pad + rectW - splitX, pad + rectH - splitY);
    ctx.fillStyle = "#a7f3d0";
    ctx.fillText(`Last × Last`, (splitX + pad + rectW) / 2, (splitY + pad + rectH) / 2 - 6);
    ctx.fillText(`${lIn}" × ${bIn}" = ${lastByLast} sq. in.`, (splitX + pad + rectW) / 2, (splitY + pad + rectH) / 2 + 12);

    // Total
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 15px 'Segoe UI'";
    ctx.fillText(`Vedic Total: ${totalSqFt} sq. ft.  ${remSqIn} sq. in.`, width / 2, height - 12);
  },

  // 9. Generic Board for other operations
  drawGenericBoard(canvasId, data, activeStep = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.prepCanvas(canvas);

    ctx.font = "bold 16px 'Segoe UI'";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.fillText(data.sutraName || "Vedic Mathematics Formulation", width / 2, height * 0.28);

    ctx.font = "bold 32px 'Fira Code', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(String(data.result !== undefined ? data.result : "Solved"), width / 2, height * 0.52);

    const curStep = (data.steps && data.steps[activeStep]) ? data.steps[activeStep] : null;
    if (curStep) {
      ctx.font = "bold 14px 'Segoe UI'";
      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`Step ${activeStep + 1}: ${curStep.title}`, width / 2, height * 0.70);
      ctx.font = "12px 'Segoe UI'";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(curStep.desc, width / 2, height * 0.82);
    }
  }
};

if (typeof window !== "undefined") window.Visuals2D = Visuals2D;
if (typeof global !== "undefined") global.Visuals2D = Visuals2D;
if (typeof module !== "undefined" && module.exports) module.exports = Visuals2D;
