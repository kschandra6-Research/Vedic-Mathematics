# Vedic Mathematics Studio

> **Interactive Computational Engine, Equation Graphs, Algebraic Proofs & Multi-Format Exporter**  
> **Concept & Design by K.S.Chandra 2026**  
> **Source Reference:** *Vedic Mathematics - Methods*, Sri Sathya Sai Veda Pratishtan  
> *Based on the foundational works of Jagadguru Swami Bharati Krishna Tirtha (1884–1960)*

---

## 🌟 Executive Overview

**Vedic Mathematics Studio** is a comprehensive, standalone, offline-capable mathematical calculation and educational application. Designed to bridge ancient Vedic computational sutras with modern computational geometry, the studio transforms sixteen primary aphorisms (*Sūtras*) and thirteen sub-aphorisms (*Upa-Sūtras*) into an interactive, visual, and analytical desktop laboratory.

Unlike conventional calculators that output static figures, **Vedic Mathematics Studio** renders:
1. **The Graph of the Equation:** Dynamic Cartesian plots of polynomials, straight lines, parabolas, cubics, rational curves, tangents, and simultaneous system intersections.
2. **Animated Step-by-Step Flow:** Real-time playback tracing every intermediate carry, duplex, split decomposition, and cross-multiplication step.
3. **Rigorous Proofs & Verification:** Empirical algebraic demonstrations and **Beejank (Navashesha / Casting out 9s)** arithmetic integrity checks for every calculation.
4. **Multi-Format Export Pipeline:** Instant generation of Microsoft Word (`.doc`), Printable PDF, High-Resolution Infographic (`.png`), and self-contained Offline Interactive HTML packages.
5. **Direct Desktop Launch:** Double-click native Windows batch and VBScript launchers eliminating the need for terminal commands.

---

## 📐 System Architecture

The application is structured into decoupled, modular JavaScript engines built on standard Web technologies without complex build steps or remote server requirements:

```
vedic-math-studio/
├── index.html                  # Unified single-page studio layout & HUD
├── app.css                     # Celestial Dark & Daylight design system
├── app.js                      # Application controller & state machine
├── vedic-engine.js             # Core mathematical library (18+ Sutra algorithms)
├── equation-graph.js           # Interactive Canvas Cartesian Graph Visualizer
├── charts-manager.js           # Vedic vs Conventional efficiency analytics (Chart.js)
├── export-manager.js           # Multi-format report generation pipeline
├── Launch_Vedic_Math_Studio.bat# Windows direct batch launcher
├── Launch_App.vbs              # Silent background launcher
├── chart.umd.min.js            # Bundled local charting library
├── html2canvas.min.js          # Bundled infographic canvas renderer
├── jspdf.umd.min.js            # Bundled PDF generation engine
├── README.md                   # Technical documentation & architectural reference
└── HOW_TO.md                   # Operational user manual & step-by-step guide
```

---

## 📚 Complete Vedic Sutra Coverage

The studio faithfully implements and visualizes all major chapters and sections of the Sri Sathya Sai Veda Pratishtan text:

### 1. Basic Arithmetic & Place-Value Methods
* **Ekādhikena Pūrveṇa (By One More Than the Previous):**
  * Squaring numbers ending in $5$: $(10P + 5)^2 = 100P(P + 1) + 25$.
  * Auxiliary fraction conversion of vulgar fractions ($\frac{1}{19}, \frac{1}{29}, \dots$) via recurring cycles.
* **Nikhilam Navataścaramaṁ Daśataḥ (All from 9 and the Last from 10):**
  * Base multiplication for numbers near powers of $10$ ($10, 100, 1000$) above and below base.
  * Negative normalization using Vinculum notation ($\overline{1}, \overline{2}$).
  * High-speed base division bypassing standard trial quotients.
* **Ūrdhva - Tiryagbhyām (Vertically and Crosswise):**
  * Universal cross-multiplication algorithm applicable to $N \times N$ and $M \times N$ digit integers.
  * Columnar accumulation with right-to-left carry resolution.
* **Ekanyūnena Pūrveṇa (By One Less Than the Previous):**
  * Instant multiplication by strings of nines ($9, 99, 999, \dots$) through dual-side complementary decomposition.
* **Antyayordaśake'pi (When Last Digits Sum to 10):**
  * Multiplication of two-digit numbers with identical prefixes and unit digits summing to $10$.

### 2. Algebraic Solutions & Linear Systems
* **Parāvartya Yojayet (Transpose and Apply):**
  * High-speed division of polynomials and integers by divisors starting with $1$.
  * Instant single-step solutions for linear equations $ax + b = cx + d \implies x = \frac{d - b}{a - c}$.
* **Śūnyaṁ Sāmyasamuccaye (When the Collection is the Same, it is Zero):**
  * Solving cubic and symmetric rational equations: $(x - a)^3 + (x - b)^3 = 2(x - c)^3 \implies x = c$.
* **Ānurūpye Śūnyamanyat (If One is in Ratio, the Other is Zero):**
  * Solving simultaneous linear equations when the ratio of coefficients of one variable equals the ratio of constants.
* **Saṅkalana - Vyavakalana (By Addition and Subtraction):**
  * Solving simultaneous systems with transposed cyclic coefficients:
    $$\begin{cases} a_1 x + b_1 y = c_1 \\ a_2 x + b_2 y = c_2 \end{cases} \implies (a_1 \pm a_2)x + (b_1 \pm b_2)y = c_1 \pm c_2$$
* **Ādyamādyenāntyamantyena (First by First and Last by Last):**
  * Direct quadratic factorization $ax^2 + bx + c = (f_1 x + c_1)(f_2 x + c_2)$ using differential ratios.
  * Practical mixed-unit carpentry area calculations ($Feet \times Inches$).
* **Antyayoreva (Only the Last Terms):**
  * Solution of complex rational fraction equations $\frac{ax + b}{cx + d} = \frac{ex + f}{gx + h}$.
* **Vilokanam (By Mere Observation):**
  * Inspection solver for quadratic equations and reciprocal symmetric forms $x + \frac{1}{x} = \frac{p}{q} + \frac{q}{p}$.

### 3. Section III Special Operations
* **Dvandva-Yoga (Duplex Method):**
  * Single-line mental squaring of multi-digit numbers using digit duplex windows:
    $$D(a) = a^2, \quad D(ab) = 2ab, \quad D(abc) = 2ac + b^2$$
* **Ānurūpyeṇa Cubing:**
  * Two-digit cubing using four-term geometric progressions:
    $$(a + b)^3 = [a^3 \mid 3a^2b \mid 3ab^2 \mid b^3]$$
* **Coordinate Geometry of the Straight Line:**
  * Direct formation of the linear equation $ax + by = c$ passing through two points $P_1(x_1, y_1)$ and $P_2(x_2, y_2)$ in a single line.
* **Beejank Arithmetic Check:**
  * Universal casting out nines verification for multiplication, division, and squares.

---

## 📈 Graph of the Equation Visualizer

The visual core of the studio is powered by **`equation-graph.js`**, an interactive HTML5 Cartesian graphing engine that renders:

* **Parabolas ($y = x^2$):** Plotted with dynamic vertex and target coordinate callouts for squaring operations.
* **Polynomial Curves ($f(x) = x^2 + (d_1+d_2)x + d_1 d_2$):** Demonstrating the algebraic proof of base multiplication.
* **Simultaneous Intersection Lines:** Renders Line 1, Line 2, Saṅkalana sum line, and Vyavakalana difference line all converging at $(x^*, y^*)$.
* **Straight Lines & Slope Triangles:** Visualizes $\Delta x$, $\Delta y$, slope $m$, and axis intercepts.
* **Division Rays & Remainder Gaps:** Displays dividend levels and quotient remainder intervals.
* **Interactive Tooling:**
  * Pan and drag canvas navigation.
  * Mouse wheel smooth zoom centered at cursor position.
  * Live Heads-Up Display (HUD) showing current $(x, y)$ coordinates.
  * Toggles for Tangent/Secant lines and Points of Interest (roots, vertex, intercepts).
  * Auto-scaling bounds ensuring all critical points remain in view.

---

## 📊 Computational Efficiency Analytics

Integrated with **Chart.js**, the studio compares Vedic computational mechanics against standard conventional arithmetic:
* **Operational Steps:** Illustrates the dramatic reduction from multi-line conventional column work down to 1–2 mental lines.
* **Working Load Score:** Quantifies cognitive strain, intermediate scratchpad memory usage, and digit manipulation overhead.
* **Speed Multiplier:** Displays calculated speedup factors (up to $3.5\times$ faster).

---

## 💾 Multi-Format Export Pipeline

Users can archive and share their mathematical results in four standardized formats:
1. **Microsoft Word (`.doc`):** Fully formatted mathematical report complete with problem title, equations, step-by-step procedures, algebraic proofs, and Beejank checks.
2. **Printable PDF:** Clean, high-contrast, print-optimized document view with page-break management.
3. **High-Resolution Infographic (`.png`):** High-DPI snapshot of the entire workspace stage, equations, and active graph.
4. **Standalone Interactive HTML (`.html`):** Self-contained, portable offline file that can be opened on any device without internet access.

---

## 🧪 Verification & External Data Input

The studio features an **External Data Input & Batch Verification Modal** allowing users to:
* Input arbitrary comma-separated numerical pairs (`N1, N2`).
* Execute automated batch calculations across the Vedic engine.
* Compare Vedic outputs with standard floating-point arithmetic.
* Verify arithmetic integrity with automated Beejank checks ($100\%$ validation score).

---

## 🚀 Getting Started

### Prerequisites
* Windows OS (7, 8, 10, 11) or any modern web browser (Edge, Chrome, Firefox, Brave).
* No Node.js, Python, or command-line installation required.

### Launching the Studio
1. **Option A (Desktop):** Double-click `Launch_Vedic_Math_Studio.bat` or `Launch_Vedic_Math_Studio.vbs` directly on your Desktop.
2. **Option B (Workspace):** Open `index.html` in your favorite web browser.

For complete usage instructions, refer to **[HOW_TO.md](file:///C:/Users/DuDu-PC/.gemini/antigravity/scratch/vedic-math-studio/HOW_TO.md)**.

---

## 📜 Credits & Acknowledgements

* **Concept & Design:** **K.S.Chandra 2026**
* **Primary Source:** *Vedic Mathematics - Methods*, Sri Sathya Sai Veda Pratishtan.
* **Inspiration:** Reverently dedicated to Jagadguru Swami Bharati Krishna Tirtha (1884–1960), former Shankaracharya of Govardhana Matha, Puri, who reconstructed the Vedic mathematical system between 1911 and 1918.

---
*Vedic Mathematics Studio © 2026. All rights reserved.*
