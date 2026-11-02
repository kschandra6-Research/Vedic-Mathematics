/**
 * Graph of the Equation - Mathematical Coordinate Visualizer
 * For Vedic Mathematics Studio
 * Concept & Design by K.S.Chandra 2026
 * 
 * Plots exact Cartesian equations, functions, tangents, roots, intercepts,
 * and system intersections corresponding to every Vedic Sutra and numerical problem.
 */

const EquationGraph = {
  canvas: null,
  ctx: null,
  currentData: null,
  activeStep: 0,
  
  // Coordinate Bounds
  bounds: {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  },
  defaultBounds: {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  },

  // Display toggles
  showTangent: true,
  showPoints: true,
  showGrid: true,

  // Mouse interaction state
  isDragging: false,
  dragStart: { x: 0, y: 0 },
  hoverMathCoord: null,
  isInitialized: false,

  // Initialize event listeners on the canvas
  init(canvasId = "equation-graph-canvas") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    if (this.isInitialized) return;
    this.isInitialized = true;

    // Mouse drag to pan
    canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
        const mathX = this.screenToMathX(mx, rect.width);
        const mathY = this.screenToMathY(my, rect.height);
        this.hoverMathCoord = { x: mathX, y: mathY, px: mx, py: my };
        this.updateHud(mathX, mathY);
      } else {
        this.hoverMathCoord = null;
        this.hideHud();
      }

      if (this.isDragging) {
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.dragStart = { x: e.clientX, y: e.clientY };

        const spanX = this.bounds.xMax - this.bounds.xMin;
        const spanY = this.bounds.yMax - this.bounds.yMin;

        const mathDx = (dx / rect.width) * spanX;
        const mathDy = (dy / rect.height) * spanY;

        this.bounds.xMin -= mathDx;
        this.bounds.xMax -= mathDx;
        this.bounds.yMin += mathDy;
        this.bounds.yMax += mathDy;

        this.draw();
      } else if (this.hoverMathCoord) {
        this.draw();
      }
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
      this.isDragging = false;
      this.hoverMathCoord = null;
      this.hideHud();
      this.draw();
    });

    // Wheel to zoom centered at cursor
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const cursorMathX = this.screenToMathX(mx, rect.width);
      const cursorMathY = this.screenToMathY(my, rect.height);

      const zoomFactor = e.deltaY < 0 ? 0.85 : 1.18;
      this.zoomAtPoint(cursorMathX, cursorMathY, zoomFactor);
    }, { passive: false });

    // Touch support
    let lastTouch = null;
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        lastTouch = { x: t.clientX, y: t.clientY };
      }
    }, { passive: true });

    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && lastTouch) {
        const t = e.touches[0];
        const dx = t.clientX - lastTouch.x;
        const dy = t.clientY - lastTouch.y;
        lastTouch = { x: t.clientX, y: t.clientY };

        const rect = canvas.getBoundingClientRect();
        const spanX = this.bounds.xMax - this.bounds.xMin;
        const spanY = this.bounds.yMax - this.bounds.yMin;

        this.bounds.xMin -= (dx / rect.width) * spanX;
        this.bounds.xMax -= (dx / rect.width) * spanX;
        this.bounds.yMin += (dy / rect.height) * spanY;
        this.bounds.yMax += (dy / rect.height) * spanY;

        this.draw();
      }
    }, { passive: true });

    canvas.addEventListener("touchend", () => {
      lastTouch = null;
    }, { passive: true });

    // Attach Toolbar button events
    this.bindToolbar();
  },

  bindToolbar() {
    document.getElementById("btn-graph-zoom-in")?.addEventListener("click", () => this.zoom(0.8));
    document.getElementById("btn-graph-zoom-out")?.addEventListener("click", () => this.zoom(1.25));
    document.getElementById("btn-graph-reset")?.addEventListener("click", () => this.resetBounds());

    const btnTangent = document.getElementById("btn-graph-tangent");
    if (btnTangent) {
      btnTangent.addEventListener("click", () => {
        this.showTangent = !this.showTangent;
        btnTangent.classList.toggle("active", this.showTangent);
        this.draw();
      });
    }

    const btnPoints = document.getElementById("btn-graph-roots");
    if (btnPoints) {
      btnPoints.addEventListener("click", () => {
        this.showPoints = !this.showPoints;
        btnPoints.classList.toggle("active", this.showPoints);
        this.draw();
      });
    }
  },

  updateHud(x, y) {
    const hud = document.getElementById("graph-coord-hud");
    const hx = document.getElementById("hud-x");
    const hy = document.getElementById("hud-y");
    if (hud && hx && hy) {
      hud.style.display = "block";
      hx.textContent = Number(x).toFixed(2);
      hy.textContent = Number(y).toFixed(2);
    }
  },

  hideHud() {
    const hud = document.getElementById("graph-coord-hud");
    if (hud) hud.style.display = "none";
  },

  zoom(factor) {
    const cx = (this.bounds.xMin + this.bounds.xMax) / 2;
    const cy = (this.bounds.yMin + this.bounds.yMax) / 2;
    this.zoomAtPoint(cx, cy, factor);
  },

  zoomAtPoint(px, py, factor) {
    const w = (this.bounds.xMax - this.bounds.xMin) * factor;
    const h = (this.bounds.yMax - this.bounds.yMin) * factor;

    const ratioX = (px - this.bounds.xMin) / (this.bounds.xMax - this.bounds.xMin);
    const ratioY = (py - this.bounds.yMin) / (this.bounds.yMax - this.bounds.yMin);

    this.bounds.xMin = px - ratioX * w;
    this.bounds.xMax = this.bounds.xMin + w;
    this.bounds.yMin = py - ratioY * h;
    this.bounds.yMax = this.bounds.yMin + h;

    this.draw();
  },

  resetBounds() {
    this.bounds = { ...this.defaultBounds };
    this.draw();
  },

  // Coordinate transforms
  mathToScreenX(x, width) {
    return ((x - this.bounds.xMin) / (this.bounds.xMax - this.bounds.xMin)) * width;
  },

  mathToScreenY(y, height) {
    return height - ((y - this.bounds.yMin) / (this.bounds.yMax - this.bounds.yMin)) * height;
  },

  screenToMathX(px, width) {
    return this.bounds.xMin + (px / width) * (this.bounds.xMax - this.bounds.xMin);
  },

  screenToMathY(py, height) {
    return this.bounds.yMin + ((height - py) / height) * (this.bounds.yMax - this.bounds.yMin);
  },

  // Master Render Method
  render(canvasId, calculationData, activeStepIndex = 0) {
    this.init(canvasId);
    if (!this.canvas) return;

    this.currentData = calculationData;
    this.activeStep = activeStepIndex;

    // Generate mathematical equation model for current problem
    const model = this.generateEquationModel(calculationData, activeStepIndex);
    this.model = model;

    // Update floating equation banner in UI
    const eqBadge = document.getElementById("graph-eq-text");
    if (eqBadge) {
      eqBadge.textContent = model.equationText;
    }

    // Set optimal default bounds
    this.defaultBounds = { ...model.bounds };
    this.bounds = { ...model.bounds };

    this.draw();
  },

  // Generate equation parameters, curves, points, and optimal bounds
  generateEquationModel(data, step = 0) {
    const type = data.type;

    // 1. Squaring: y = x^2 (Ekadhikena, Yavadunam, Dwandwa)
    if (type === "square_ending_5" || type === "yavadunam_square" || type === "dwandwa_square") {
      let x0 = 15;
      if (data.input !== undefined) x0 = Number(data.input);
      else if (data.n !== undefined) x0 = Number(data.n);
      else if (data.num !== undefined) x0 = Number(data.num);

      const y0 = x0 * x0;
      const slope = 2 * x0; // Derivative y' = 2x

      return {
        equationText: `y = x²  [at x = ${x0} ⟹ y = ${y0}]`,
        bounds: {
          xMin: Math.min(-10, -0.4 * x0),
          xMax: Math.max(20, 1.4 * x0),
          yMin: Math.min(-50, -0.2 * y0),
          yMax: Math.max(100, 1.3 * y0)
        },
        curves: [
          {
            name: "Parabola y = x²",
            color: "#38bdf8",
            width: 3.5,
            glow: true,
            fn: (x) => x * x
          }
        ],
        tangents: [
          {
            name: `Tangent at (${x0}, ${y0})`,
            color: "#f59e0b",
            width: 2,
            dashed: [5, 5],
            // y - y0 = slope * (x - x0) => y = slope * x - slope * x0 + y0 = slope * x - x0^2
            fn: (x) => slope * x - x0 * x0
          }
        ],
        points: [
          { x: 0, y: 0, label: "Vertex (0, 0)", color: "#94a3b8" },
          { x: x0, y: y0, label: `P (${x0}, ${y0})`, color: "#10b981", active: true, radius: 8 }
        ],
        rays: [
          { x1: x0, y1: 0, x2: x0, y2: y0, color: "rgba(56, 189, 248, 0.6)", label: `x = ${x0}` },
          { x1: 0, y1: y0, x2: x0, y2: y0, color: "rgba(16, 185, 129, 0.6)", label: `y = ${y0}` }
        ]
      };
    }

    // 2. Straight Line through 2 points: ax + by = c
    if (type === "straight_line_2points") {
      const { x1, y1, x2, y2, aCoeff, bCoeff, cConst, eqStr } = data;
      const m = bCoeff !== 0 ? -aCoeff / bCoeff : Infinity;

      const minX = Math.min(x1, x2) - 4;
      const maxX = Math.max(x1, x2) + 4;
      const minY = Math.min(y1, y2) - 4;
      const maxY = Math.max(y1, y2) + 4;

      const xInt = aCoeff !== 0 ? cConst / aCoeff : null;
      const yInt = bCoeff !== 0 ? cConst / bCoeff : null;

      const pts = [
        { x: x1, y: y1, label: `P₁ (${x1}, ${y1})`, color: "#f43f5e", active: true, radius: 8 },
        { x: x2, y: y2, label: `P₂ (${x2}, ${y2})`, color: "#10b981", active: step >= 1, radius: 8 }
      ];
      if (xInt !== null && isFinite(xInt)) pts.push({ x: xInt, y: 0, label: `X-Int (${xInt.toFixed(1)}, 0)`, color: "#38bdf8" });
      if (yInt !== null && isFinite(yInt)) pts.push({ x: 0, y: yInt, label: `Y-Int (0, ${yInt.toFixed(1)})`, color: "#38bdf8" });

      return {
        equationText: eqStr || `${aCoeff}x + ${bCoeff}y = ${cConst}`,
        bounds: { xMin: minX, xMax: maxX, yMin: minY, yMax: maxY },
        lines: [
          { a: aCoeff, b: bCoeff, c: cConst, color: "#38bdf8", width: 3.5, glow: true, active: step >= 2 }
        ],
        slopeTriangle: step >= 2 ? { x1, y1, x2, y2, slope: m } : null,
        points: pts
      };
    }

    // 3. Simultaneous Equations (Sankalana-Vyavakalana)
    if (type === "sankalana_vyavakalan") {
      const { a1, b1, c1, a2, b2, c2, finalX, finalY } = data;
      const fx = Number(finalX);
      const fy = Number(finalY);

      // Sum equation: (a1+a2)x + (b1+b2)y = c1+c2
      const sa = a1 + a2, sb = b1 + b2, sc = c1 + c2;
      // Diff equation: (a1-a2)x + (b1-b2)y = c1-c2
      const da = a1 - a2, db = b1 - b2, dc = c1 - c2;

      return {
        equationText: `L₁: ${a1}x + (${b1})y = ${c1}  |  L₂: ${a2}x + (${b2})y = ${c2}`,
        bounds: {
          xMin: fx - 8,
          xMax: fx + 8,
          yMin: fy - 8,
          yMax: fy + 8
        },
        lines: [
          { a: a1, b: b1, c: c1, color: "#38bdf8", width: 3, label: "Line 1" },
          { a: a2, b: b2, c: c2, color: "#f43f5e", width: 3, label: "Line 2" },
          { a: sa, b: sb, c: sc, color: "#f59e0b", width: 2, dashed: [5, 5], label: "Sum (Saṅkalana)", active: step >= 1 },
          { a: da, b: db, c: dc, color: "#c084fc", width: 2, dashed: [5, 5], label: "Diff (Vyavakalana)", active: step >= 2 }
        ],
        points: [
          { x: fx, y: fy, label: `Intersection (${fx}, ${fy})`, color: "#fbbf24", active: true, radius: 9, pulse: true }
        ]
      };
    }

    // 4. Paravartya Linear: ax + b = cx + d
    if (type === "paravartya_linear") {
      const { a, b, c, d } = data;
      const xSol = (d - b) / (a - c);
      const ySol = a * xSol + b;

      return {
        equationText: `${a}x + (${b}) = ${c}x + (${d})  [x = ${xSol.toFixed(2)}]`,
        bounds: {
          xMin: xSol - 6,
          xMax: xSol + 6,
          yMin: ySol - 12,
          yMax: ySol + 12
        },
        curves: [
          { name: `y₁ = ${a}x + ${b}`, color: "#38bdf8", width: 3, fn: (x) => a * x + b },
          { name: `y₂ = ${c}x + ${d}`, color: "#f43f5e", width: 3, fn: (x) => c * x + d },
          { name: `Diff: y = (${a - c})x + (${b - d})`, color: "#10b981", width: 2, dashed: [4, 4], fn: (x) => (a - c) * x + (b - d), active: step >= 1 }
        ],
        points: [
          { x: xSol, y: ySol, label: `Sol (${xSol.toFixed(2)}, ${ySol.toFixed(2)})`, color: "#fbbf24", active: true, radius: 8 }
        ]
      };
    }

    // 5. Quadratic Factorization: y = ax^2 + bx + c
    if (type === "factorize_quadratic") {
      const { a, b, c, f1_x, f1_c, f2_x, f2_c } = data;
      const r1 = -f1_c / f1_x;
      const r2 = -f2_c / f2_x;
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;

      const minR = Math.min(r1, r2);
      const maxR = Math.max(r1, r2);

      return {
        equationText: `y = ${a}x² + ${b}x + ${c} = (${f1_x}x + ${f1_c})(${f2_x}x + ${f2_c})`,
        bounds: {
          xMin: minR - 3,
          xMax: maxR + 3,
          yMin: Math.min(vy - 4, -4),
          yMax: Math.max(vy + 12, 12)
        },
        curves: [
          { name: "Parabola", color: "#38bdf8", width: 3.5, glow: true, fn: (x) => a * x * x + b * x + c }
        ],
        points: [
          { x: r1, y: 0, label: `Root r₁ = ${r1.toFixed(2)}`, color: "#10b981", active: true, radius: 7 },
          { x: r2, y: 0, label: `Root r₂ = ${r2.toFixed(2)}`, color: "#10b981", active: step >= 1, radius: 7 },
          { x: vx, y: vy, label: `Vertex (${vx.toFixed(2)}, ${vy.toFixed(2)})`, color: "#f59e0b", active: step >= 2, radius: 6 },
          { x: 0, y: c, label: `Y-Int (0, ${c})`, color: "#c084fc" }
        ]
      };
    }

    // 6. Universal Multiplication & Nikhilam: f(x) = (x + d1)(x + d2)
    if (type === "nikhilam_multiplication" || type === "anurupyena_multiplication" || type === "urdhva_tiryagbhyam" || type === "ekanyunena_purvena" || type === "antyayor_dasakepi") {
      const n1 = Number(data.n1 || data.multiplicand || 98);
      const n2 = Number(data.n2 || data.multiplier || 97);
      const base = Number(data.base || data.workingBase || 100);
      const d1 = Number(data.d1 !== undefined ? data.d1 : (n1 - base));
      const d2 = Number(data.d2 !== undefined ? data.d2 : (n2 - base));
      const prod = n1 * n2;

      // Polynomial: f(x) = (x + d1)(x + d2) = x^2 + (d1 + d2)x + d1*d2
      const r1 = -d1;
      const r2 = -d2;
      const vx = -(d1 + d2) / 2;

      return {
        equationText: `f(x) = (x ${d1 >= 0 ? '+' : ''}${d1})(x ${d2 >= 0 ? '+' : ''}${d2})  [at Base x = ${base} ⟹ ${prod}]`,
        bounds: {
          xMin: Math.min(-base * 0.2, r1 - 10, r2 - 10),
          xMax: Math.max(base * 1.25, 20),
          yMin: Math.min(-100, d1 * d2 - 50),
          yMax: Math.max(prod * 1.15, 1000)
        },
        curves: [
          {
            name: `f(x) = x² + (${d1 + d2})x + ${d1 * d2}`,
            color: "#38bdf8",
            width: 3.5,
            glow: true,
            fn: (x) => (x + d1) * (x + d2)
          },
          {
            name: `Linear Scaling y = ${n1}x`,
            color: "#f59e0b",
            width: 1.5,
            dashed: [4, 4],
            fn: (x) => n1 * x,
            active: step >= 2
          }
        ],
        points: [
          { x: r1, y: 0, label: `Root (-${d1})`, color: "#10b981", active: true, radius: 6 },
          { x: r2, y: 0, label: `Root (-${d2})`, color: "#10b981", active: true, radius: 6 },
          { x: 0, y: d1 * d2, label: `Y-Int = d₁d₂ (${d1 * d2})`, color: "#f43f5e", active: step >= 1, radius: 6 },
          { x: base, y: prod, label: `Base Eval (${base}, ${prod})`, color: "#fbbf24", active: step >= 2, radius: 8, pulse: true }
        ],
        rays: [
          { x1: base, y1: 0, x2: base, y2: prod, color: "rgba(251, 191, 36, 0.6)", label: `x = ${base}` }
        ]
      };
    }

    // 7. Vedic Division: y = Divisor * x and y = Dividend
    if (type === "nikhilam_division" || type === "paravartya_division") {
      const dividend = Number(data.dividend || 1012);
      const divisor = Number(data.divisor || 9);
      const q = Number(data.quotient || Math.floor(dividend / divisor));
      const r = Number(data.remainder || (dividend % divisor));

      return {
        equationText: `y = ${divisor}x + ${r}  [Dividend = ${dividend}, Divisor = ${divisor} ⟹ Q = ${q}, R = ${r}]`,
        bounds: {
          xMin: -1,
          xMax: Math.max(12, q * 1.3),
          yMin: -dividend * 0.1,
          yMax: dividend * 1.3
        },
        curves: [
          { name: `Divisor Ray: y = ${divisor}x`, color: "#38bdf8", width: 3, fn: (x) => divisor * x },
          { name: `Hyperbola y = ${dividend}/x`, color: "#c084fc", width: 1.5, dashed: [4, 4], fn: (x) => x !== 0 ? dividend / x : 0 }
        ],
        horizontalLines: [
          { y: dividend, color: "#f43f5e", width: 2.5, label: `Dividend Line y = ${dividend}` }
        ],
        points: [
          { x: q, y: divisor * q, label: `Q-Point (${q}, ${divisor * q})`, color: "#10b981", active: step >= 1, radius: 7 },
          { x: q, y: dividend, label: `Remainder Gap R = ${r}`, color: "#fbbf24", active: step >= 2, radius: 7 }
        ],
        rays: [
          { x1: q, y1: divisor * q, x2: q, y2: dividend, color: "#f43f5e", width: 3, label: `R = ${r}` }
        ]
      };
    }

    // 8. Anurupyena Cubing: y = x^3
    if (type === "anurupyena_cube" || type === "sunyam_samya_samuccaye") {
      let n = 14;
      if (data.num) n = Number(data.num);
      else if (data.resultVal !== undefined) n = Number(data.resultVal);
      const cube = n * n * n;

      return {
        equationText: `y = x³  [at x = ${n} ⟹ y = ${cube}]`,
        bounds: {
          xMin: -n * 0.4,
          xMax: n * 1.35,
          yMin: -cube * 0.2,
          yMax: cube * 1.3
        },
        curves: [
          { name: "Cubic y = x³", color: "#38bdf8", width: 3.5, glow: true, fn: (x) => x * x * x }
        ],
        tangents: [
          { name: "Tangent", color: "#f59e0b", width: 2, dashed: [5, 5], fn: (x) => (3 * n * n) * (x - n) + cube }
        ],
        points: [
          { x: 0, y: 0, label: "Inflection (0, 0)", color: "#94a3b8" },
          { x: n, y: cube, label: `(${n}, ${cube})`, color: "#10b981", active: true, radius: 8 }
        ]
      };
    }

    // 9. Carpentry Area: y = Width * x
    if (type === "area_feet_inches") {
      const l = Number(data.lFt || 12) + Number(data.lIn || 0) / 12;
      const b = Number(data.bFt || 8) + Number(data.bIn || 0) / 12;
      const area = l * b;

      return {
        equationText: `Area Function: A(x) = ${b.toFixed(2)}x  [Total = ${area.toFixed(2)} sq. ft.]`,
        bounds: { xMin: -1, xMax: l * 1.3, yMin: -2, yMax: area * 1.3 },
        curves: [
          { name: `Area Growth: A(x) = ${b.toFixed(2)}x`, color: "#38bdf8", width: 3.5, fn: (x) => b * x }
        ],
        points: [
          { x: l, y: area, label: `(${l.toFixed(2)} ft, ${area.toFixed(2)} sq ft)`, color: "#10b981", active: true, radius: 8 }
        ],
        rays: [
          { x1: l, y1: 0, x2: l, y2: area, color: "#f59e0b", label: `Length = ${l.toFixed(2)}'` }
        ]
      };
    }

    // 10. Default Polynomial / Function Representation
    const val = Number(data.result) || 10;
    return {
      equationText: `${data.sutraName || 'Vedic Equation'}: f(x) = x [Result = ${data.result}]`,
      bounds: { xMin: -5, xMax: 15, yMin: -5, yMax: 15 },
      curves: [
        { name: "y = x", color: "#38bdf8", width: 3, fn: (x) => x }
      ],
      points: [
        { x: val, y: val, label: `Result = ${val}`, color: "#10b981", active: true, radius: 8 }
      ]
    };
  },

  // Master Canvas Drawing Routine
  draw() {
    if (!this.canvas || !this.ctx) return;
    const canvas = this.canvas;
    const ctx = this.ctx;

    // Canvas dimensions
    const width = canvas.width || 600;
    const height = canvas.height || 340;

    ctx.clearRect(0, 0, width, height);

    // Deep cosmic gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#070b14");
    grad.addColorStop(0.5, "#0b1224");
    grad.addColorStop(1, "#0d1527");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Grid Lines and Coordinates
    if (this.showGrid) {
      this.drawGrid(ctx, width, height);
    }

    // 2. Draw Mathematical Curves
    const model = this.model;
    if (!model) return;

    // Draw General Linear Equations (ax + by = c)
    if (model.lines) {
      model.lines.forEach(l => {
        if (l.active === false) return;
        this.drawImplicitLine(ctx, l.a, l.b, l.c, l.color, l.width, l.dashed, width, height);
      });
    }

    // Draw Explicit Function Curves y = f(x)
    if (model.curves) {
      model.curves.forEach(c => {
        if (c.active === false) return;
        this.drawCurve(ctx, c.fn, c.color, c.width, c.dashed, c.glow, width, height);
      });
    }

    // Draw Horizontal Lines y = const
    if (model.horizontalLines) {
      model.horizontalLines.forEach(hl => {
        const py = this.mathToScreenY(hl.y, height);
        ctx.save();
        ctx.strokeStyle = hl.color || "#f43f5e";
        ctx.lineWidth = hl.width || 2;
        ctx.setLineDash(hl.dashed || []);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();

        ctx.font = "bold 11px 'Fira Code', monospace";
        ctx.fillStyle = hl.color || "#f43f5e";
        ctx.fillText(hl.label || `y = ${hl.y}`, 10, py - 6);
        ctx.restore();
      });
    }

    // Draw Tangents if enabled
    if (this.showTangent && model.tangents) {
      model.tangents.forEach(t => {
        this.drawCurve(ctx, t.fn, t.color, t.width, t.dashed, false, width, height);
      });
    }

    // Draw Coordinate Rays (drop lines)
    if (model.rays) {
      model.rays.forEach(r => {
        const sx1 = this.mathToScreenX(r.x1, width);
        const sy1 = this.mathToScreenY(r.y1, height);
        const sx2 = this.mathToScreenX(r.x2, width);
        const sy2 = this.mathToScreenY(r.y2, height);

        ctx.save();
        ctx.strokeStyle = r.color || "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();
        ctx.restore();
      });
    }

    // Draw Slope Triangle
    if (model.slopeTriangle) {
      this.drawSlopeTriangle(ctx, model.slopeTriangle, width, height);
    }

    // Draw Points of Interest if enabled
    if (this.showPoints && model.points) {
      model.points.forEach(p => {
        if (p.active === false) return;
        this.drawPoint(ctx, p.x, p.y, p.label, p.color, p.radius || 6, p.pulse || false, width, height);
      });
    }

    // Draw Hover Crosshair Reticle & Tooltip
    if (this.hoverMathCoord) {
      this.drawReticle(ctx, this.hoverMathCoord, width, height);
    }
  },

  // Draw Grid, Ticks, and Axis numbers
  drawGrid(ctx, width, height) {
    const spanX = this.bounds.xMax - this.bounds.xMin;
    const spanY = this.bounds.yMax - this.bounds.yMin;

    // Calculate natural tick intervals
    const roughSteps = 8;
    const stepX = this.calcNiceStep(spanX / roughSteps);
    const stepY = this.calcNiceStep(spanY / roughSteps);

    const firstX = Math.floor(this.bounds.xMin / stepX) * stepX;
    const firstY = Math.floor(this.bounds.yMin / stepY) * stepY;

    // Vertical grid lines
    ctx.strokeStyle = "rgba(51, 65, 85, 0.28)";
    ctx.lineWidth = 1;
    ctx.font = "10px 'Fira Code', monospace";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";

    const zeroY = this.mathToScreenY(0, height);

    for (let x = firstX; x <= this.bounds.xMax; x += stepX) {
      const px = this.mathToScreenX(x, width);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      // Tick number label
      if (Math.abs(x) > stepX * 0.1) {
        const labelY = Math.max(14, Math.min(height - 6, zeroY + 14));
        ctx.fillText(this.formatNumber(x), px, labelY);
      }
    }

    // Horizontal grid lines
    ctx.textAlign = "right";
    const zeroX = this.mathToScreenX(0, width);

    for (let y = firstY; y <= this.bounds.yMax; y += stepY) {
      const py = this.mathToScreenY(y, height);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      // Tick number label
      if (Math.abs(y) > stepY * 0.1) {
        const labelX = Math.max(26, Math.min(width - 6, zeroX - 6));
        ctx.fillText(this.formatNumber(y), labelX, py + 3);
      }
    }

    // Primary Axes (X and Y)
    ctx.save();
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.8;

    // X Axis
    if (zeroY >= 0 && zeroY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(width, zeroY);
      ctx.stroke();

      // X arrow
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.moveTo(width, zeroY);
      ctx.lineTo(width - 8, zeroY - 4);
      ctx.lineTo(width - 8, zeroY + 4);
      ctx.fill();
      ctx.fillText("x", width - 12, zeroY - 8);
    }

    // Y Axis
    if (zeroX >= 0 && zeroX <= width) {
      ctx.beginPath();
      ctx.moveTo(zeroX, height);
      ctx.lineTo(zeroX, 0);
      ctx.stroke();

      // Y arrow
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.moveTo(zeroX, 0);
      ctx.lineTo(zeroX - 4, 8);
      ctx.lineTo(zeroX + 4, 8);
      ctx.fill();
      ctx.fillText("y", zeroX + 12, 14);
    }
    ctx.restore();
  },

  // Calculate clean readable step interval (1, 2, 5, 10...)
  calcNiceStep(range) {
    const exp = Math.floor(Math.log10(range));
    const frac = range / Math.pow(10, exp);
    let niceFrac;
    if (frac < 1.5) niceFrac = 1;
    else if (frac < 3) niceFrac = 2;
    else if (frac < 7) niceFrac = 5;
    else niceFrac = 10;
    return niceFrac * Math.pow(10, exp);
  },

  formatNumber(n) {
    if (Math.abs(n) >= 10000 || (Math.abs(n) > 0 && Math.abs(n) < 0.01)) {
      return n.toExponential(1);
    }
    return Number(n.toFixed(2)).toString();
  },

  // Draw continuous explicit function curve y = f(x)
  drawCurve(ctx, fn, color = "#38bdf8", lineWidth = 3, dashed = null, glow = true, width, height) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (dashed) ctx.setLineDash(dashed);

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    const numSamples = Math.min(800, width * 1.5);
    let started = false;

    for (let i = 0; i <= numSamples; i++) {
      const px = (i / numSamples) * width;
      const x = this.screenToMathX(px, width);
      try {
        const y = fn(x);
        if (!isFinite(y)) {
          started = false;
          continue;
        }
        const py = this.mathToScreenY(y, height);

        // Clip huge offscreen vertical values cleanly
        if (py < -height * 2 || py > height * 3) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      } catch (err) {
        started = false;
      }
    }
    ctx.stroke();
    ctx.restore();
  },

  // Draw implicit straight line ax + by = c
  drawImplicitLine(ctx, a, b, c, color = "#38bdf8", lineWidth = 3, dashed = null, width, height) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (dashed) ctx.setLineDash(dashed);
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    let p1 = null, p2 = null;

    if (b !== 0) {
      // Evaluate at xMin and xMax
      const yAtMin = (c - a * this.bounds.xMin) / b;
      const yAtMax = (c - a * this.bounds.xMax) / b;
      p1 = { x: this.bounds.xMin, y: yAtMin };
      p2 = { x: this.bounds.xMax, y: yAtMax };
    } else if (a !== 0) {
      // Vertical line x = c/a
      const xVal = c / a;
      p1 = { x: xVal, y: this.bounds.yMin };
      p2 = { x: xVal, y: this.bounds.yMax };
    }

    if (p1 && p2) {
      const sx1 = this.mathToScreenX(p1.x, width);
      const sy1 = this.mathToScreenY(p1.y, height);
      const sx2 = this.mathToScreenX(p2.x, width);
      const sy2 = this.mathToScreenY(p2.y, height);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
    }
    ctx.restore();
  },

  // Draw Point of Interest with glowing beacon
  drawPoint(ctx, x, y, label, color = "#10b981", radius = 6, pulse = false, width, height) {
    const px = this.mathToScreenX(x, width);
    const py = this.mathToScreenY(y, height);

    if (px < -30 || px > width + 30 || py < -30 || py > height + 30) return;

    ctx.save();

    // Pulse halo ring
    if (pulse) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, radius + 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer glow
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(px, py, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Point Label badge
    if (label) {
      ctx.font = "bold 11px 'Segoe UI', system-ui";
      const textWidth = ctx.measureText(label).width;
      const lx = Math.min(width - textWidth - 10, Math.max(10, px + 10));
      const ly = Math.min(height - 10, Math.max(18, py - 10));

      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.fillRect(lx - 4, ly - 12, textWidth + 8, 16);
      ctx.strokeRect(lx - 4, ly - 12, textWidth + 8, 16);

      ctx.fillStyle = "#f8fafc";
      ctx.fillText(label, lx, ly);
    }
    ctx.restore();
  },

  // Draw Slope Triangle for 2-point lines
  drawSlopeTriangle(ctx, st, width, height) {
    const { x1, y1, x2, y2, slope } = st;
    const sx1 = this.mathToScreenX(x1, width);
    const sy1 = this.mathToScreenY(y1, height);
    const sx2 = this.mathToScreenX(x2, width);
    const sy2 = this.mathToScreenY(y2, height);

    // Corner at (x2, y1)
    const scx = this.mathToScreenX(x2, width);
    const scy = this.mathToScreenY(y1, height);

    ctx.save();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    ctx.moveTo(sx1, sy1);
    ctx.lineTo(scx, scy); // Delta X
    ctx.lineTo(sx2, sy2); // Delta Y
    ctx.stroke();

    ctx.font = "10px 'Fira Code', monospace";
    ctx.fillStyle = "#f59e0b";
    ctx.fillText(`Δx=${(x2 - x1).toFixed(1)}`, (sx1 + scx) / 2 - 12, scy + 12);
    ctx.fillText(`Δy=${(y2 - y1).toFixed(1)}`, scx + 6, (sy1 + sy2) / 2);
    ctx.restore();
  },

  // Draw Crosshair Reticle & Floating Hover Tooltip
  drawReticle(ctx, coord, width, height) {
    const { x, y, px, py } = coord;
    ctx.save();

    // Crosshair lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    ctx.moveTo(px, 0); ctx.lineTo(px, height);
    ctx.moveTo(0, py); ctx.lineTo(width, py);
    ctx.stroke();

    // Small circle at cursor
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Coordinate hover box
    const text = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
    ctx.font = "bold 11px 'Fira Code', monospace";
    const tw = ctx.measureText(text).width;
    const bx = Math.min(width - tw - 12, px + 10);
    const by = Math.max(20, py - 10);

    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;
    ctx.fillRect(bx - 4, by - 14, tw + 8, 18);
    ctx.strokeRect(bx - 4, by - 14, tw + 8, 18);

    ctx.fillStyle = "#38bdf8";
    ctx.fillText(text, bx, by);
    ctx.restore();
  }
};

if (typeof window !== "undefined") window.EquationGraph = EquationGraph;
if (typeof global !== "undefined") global.EquationGraph = EquationGraph;
if (typeof module !== "undefined" && module.exports) module.exports = EquationGraph;
