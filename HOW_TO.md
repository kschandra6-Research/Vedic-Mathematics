# Vedic Mathematics Studio - How-To Guide & Operational Manual

> **Concept & Design by K.S.Chandra 2026**  
> **Source Reference:** *Vedic Mathematics - Methods*, Sri Sathya Sai Veda Pratishtan  
> *Based on the works of Swami Bharati Krishna Tirtha (1884–1960)*

---

## 📖 Welcome to Vedic Mathematics Studio

This guide provides step-by-step instructions on how to use every feature of **Vedic Mathematics Studio**, from launching the application without command lines to exploring interactive equation graphs, animated step playback, external data batch verification, and exporting reports.

---

## 🚀 1. How to Launch the Application Directly

You do **not** need to open PowerShell, Command Prompt, or install web servers. The studio runs entirely locally in your default browser.

### Method A: From the Desktop (Recommended)
1. Go to your Windows **Desktop**.
2. Locate either of the following launcher files:
   * **`Launch_Vedic_Math_Studio.bat`** (Batch Launcher with startup banner)
   * **`Launch_Vedic_Math_Studio.vbs`** (Silent One-Click Launcher)
3. **Double-click** either file.
4. Your default web browser will immediately open with the full application loaded and ready.

### Method B: From the Project Folder
* Navigate to `C:\Users\DuDu-PC\.gemini\antigravity\scratch\vedic-math-studio\`.
* Double-click **`Launch_Vedic_Math_Studio.bat`** or double-click **`index.html`**.

---

## 🧭 2. How to Select Sutras & Problem Domains

The application provides two intuitive methods to browse and switch between all 21+ Sutras and sub-methods:

### Method A: Sidebar Navigation Menu (Left Pane)
The left sidebar organizes methods into logical mathematical categories:
* **Multiplication & Fractions:**
  * *1. Ekādhikena (Squares ending in 5)*
  * *1b. Recurring Decimals (1/a9)*
  * *2. Nikhilam Multiplication*
  * *3. Ūrdhva - Tiryagbhyām (Criss-Cross)*
  * *10. Ekanyūnena (Multiplication by 9s)*
  * *11. Ānurūpyeṇa Working Base Multiplication*
  * *14. Antyayordaśake'pi (Units sum to 10)*
* **Division:**
  * *2b. Nikhilam Division*
  * *4. Parāvartya Division*
* **Squaring & Cubing:**
  * *13. Yāvadūnaṁ Squaring*
  * *Section III. Dvandva-Yoga (Duplex Squaring)*
  * *Section III. Ānurūpyeṇa Cubing*
* **Algebra & Equations:**
  * *4b. Parāvartya Linear Equations ($ax+b=cx+d$)*
  * *5. Śūnyaṁ Sāmyasamuccaye (Cubic / Symmetric equations)*
  * *6. Ānurūpye Śūnyamanyat (Ratio reduction)*
  * *7. Saṅkalana - Vyavakalana (Simultaneous systems)*
  * *12b. Ādyamādyena Quadratic Factorization*
  * *15. Antyayoreva (Rational fractions)*
  * *17. Vilokanam (By Observation)*
* **Section III Special Topics:**
  * *12. Ādyamādyena Carpentry Area ($Feet \times Inches$)*
  * *Section III. Coordinate Geometry (Straight Line through 2 Points)*
  * *Section III. Beejank (Casting out 9s)*

Click any item in the sidebar to instantly load that mathematical domain.

### Method B: Quick Dropdown Selector (Top Header)
Located on the top header bar:
1. Click the **"Select Sutra"** dropdown.
2. Choose any method from the list to navigate immediately.

---

## 🔢 3. Customizing Numerical Inputs & Presets

Each Sutra provides interactive input fields tailored to its mathematical domain:

1. **Enter Your Own Numbers:**
   * Modify the numbers in the input fields (e.g., change `Number ending in 5` to `85`, or change multiplicands to `456` and `789`).
   * The calculation recalculates **automatically** as you type, and the result, graph, and steps update in real time.
   * You can also click the **"⚡ Calculate Vedic Result"** button to force recalculation.

2. **Use Textbook Presets:**
   * Above the input fields, click any of the **preset pill buttons** (e.g., `15²`, `25²`, `65²`, `105²`, `225²` or `98 × 97`, `103 × 107`).
   * This immediately populates the inputs with canonical examples from the Vedic Mathematics textbook and updates all visualizers.

---

## 📈 4. Reading and Interacting with the Graph of the Equation

The studio features a high-precision Cartesian coordinate graphing visualizer that maps each calculation to its mathematical equation.

### A. Graph Elements Displayed
* **Floating Equation Badge (Top):** Shows the exact mathematical formulation (e.g., `y = x² [at x = 65 ⟹ y = 4225]` or `L₁: 45x - 23y = 113 | L₂: 23x - 45y = 91`).
* **Axes & Grid:** Labeled $X$ and $Y$ axes with dynamic numerical ticks and auto-scaled intervals.
* **Function Curves & Lines:** Smooth neon curves representing parabolas, polynomials, cubics, or straight lines.
* **Tangent Lines & Secants:** Shows rates of change or base difference chords.
* **Points of Interest:** Highlighted markers for:
  * Operating solution points $(x_0, y_0)$
  * Roots and $X$-intercepts
  * $Y$-intercepts
  * Vertex extrema
  * Multi-line intersection points $(x^*, y^*)$

### B. Interactive Controls
1. **Pan Across the Graph:** Click and hold your left mouse button (or drag on a touchscreen) anywhere on the canvas to move the viewport in any direction.
2. **Zoom In / Out:**
   * **Mouse Wheel:** Scroll up to zoom in, scroll down to zoom out (centered at your mouse cursor).
   * **Toolbar Buttons:** Click **`+`** (Zoom In) or **`−`** (Zoom Out) in the upper-right corner of the graph.
3. **Reset View (`⟲ Reset`):** Click the **Reset** button on the toolbar to return to the optimal bounding box that frames all critical points of interest.
4. **Toggle Tangent / Secants (`📐 Tangent`):** Click to turn tangent and secant chords on or off.
5. **Toggle Points of Interest (`📍 Points`):** Click to show or hide root, vertex, and coordinate point labels.
6. **Live Coordinate Heads-Up Display (HUD):** Move your cursor over the canvas. The bottom-right HUD displays the exact mathematical coordinates `x: ... | y: ...` along with a reticle crosshair.

---

## ⏯️ 5. Operating the Animated Step Player

Directly beneath the graph stage is the **Animated Working Controller**:

1. **Step-by-Step Playback:**
   * Click **`◀`** to move backward one step.
   * Click **`▶`** to move forward one step.
   * Click **`↺`** to reset to Step 1.
2. **Continuous Auto-Play:**
   * Click **`▶ Play`** to automatically cycle through all calculation steps sequentially.
   * Click **`⏸ Pause`** at any time to pause on an interesting intermediate step.
3. **Playback Speed:**
   * Use the **Speed** dropdown on the right (`0.8s`, `1.5s`, `2.5s`, `4.0s`) to adjust the pace of the automated walk-through.
4. **Clickable Step Cards:**
   * In the right column, each step of the calculation is displayed as a formatted card showing the step title, explanation, and mathematical notation.
   * **Click directly on any step card** in the list to immediately jump the graph and highlights to that step.

---

## 📊 6. Viewing Computational Efficiency Analytics

To compare Vedic methods against standard arithmetic:
1. Above the graph stage, click the **"📊 Efficiency Comparison"** tab.
2. The view switches to a comparative Chart.js visualization displaying:
   * **Operational Steps:** Compares standard multi-line scratch work against Vedic single-line mental methods.
   * **Mental Load Index:** Measures cognitive strain and memory overhead.
   * **Speed Multiplier:** Illustrates the calculated performance improvement factor.
3. Click back to **"📈 Graph of the Equation"** at any time to return to the mathematical curve view.

---

## 🧪 7. External Data Input & Batch Verification

The studio allows you to verify arbitrary external numerical datasets and confirm mathematical integrity:

1. Click **"Batch Verification"** in the sidebar (under the *Verification & Integrity* section).
2. A modal dialog will appear.
3. **Enter Custom Numerical Data:**
   * In the text area, enter pairs of numbers in CSV format, one pair per line:
     ```
     12, 13
     25, 25
     98, 97
     234, 316
     105, 105
     ```
4. Click the **"Run Batch Verification"** button.
5. The engine executes all problems, compares the Vedic output against standard floating-point arithmetic, applies the **Beejank (Casting out 9s)** cross-check, and renders an itemized audit table confirming a $100\%$ validation match.
6. Click the **`×`** button in the top right to close the modal.

---

## 💾 8. Exporting Reports in Multiple Formats

You can export your current calculation and visual graph in four standardized formats:

### A. Export to Microsoft Word (`.doc`)
1. Click the **"📄 Export Word"** button located in the top-right header toolbar.
2. A formatted `.doc` document will automatically download (`Vedic_Calculation_<Sutra>.doc`).
3. Open it in Microsoft Word, Google Docs, or LibreOffice to view a complete report including equations, step tables, proofs, and source citations.

### B. Export as Printable PDF
1. Click the **"📑 Export PDF"** button.
2. The print preview dialog will launch with clean, high-contrast, print-optimized formatting.
3. Select **"Save as PDF"** or choose your printer.

### C. Export High-Resolution Infographic (`.png`)
1. Click the **"🖼️ Infographic"** button.
2. The application captures a high-DPI image of the workspace stage (result banner, equation graph, step flow, and proofs) and downloads it as a `.png` file suitable for presentations and publications.

### D. Export Standalone Interactive HTML (`.html`)
1. Click the **"🌐 Interactive HTML"** button.
2. A self-contained `.html` file will download.
3. You can email or share this file; anyone can open it in any web browser without needing internet access, servers, or any local setup.

---

## 🌓 9. Switching Themes (Celestial Dark & Daylight Mode)

* Click the **"🌙 Dark Mode"** / **"☀️ Light Mode"** toggle button in the top-right toolbar.
* **Celestial Dark Theme:** Deep cosmic background (`#080c18`) with neon highlights, optimized for high visual contrast and low eye fatigue.
* **Daylight Light Theme:** Crisp clean white/slate background with indigo and emerald highlights, ideal for daytime presentations and projection.

---

## ❓ 10. Frequently Asked Questions & Troubleshooting

### Q: Why does the launcher say PowerShell isn't needed?
**A:** The project uses native Windows batch files (`.bat`) and Windows Script Host (`.vbs`) that invoke your default operating system browser directly via the Windows shell, avoiding PowerShell command execution policies.

### Q: Can I run this application completely offline?
**A:** Yes. All third-party libraries (`Chart.js`, `html2canvas`, `jsPDF`) and font fallbacks are bundled locally within the project directory. No internet connection is required.

### Q: What is Beejank and why does the verification badge appear?
**A:** *Beejank* (also known as *Navashesha* or digital root modulo 9) is the ancient Vedic method of casting out nines to verify arithmetic integrity. If $A \times B = C$, then:
$$\text{Beejank}(A) \times \text{Beejank}(B) \equiv \text{Beejank}(C) \pmod 9$$
The green **"✓ 100% Verified"** badge confirms that this mathematical invariant holds true for your input.

### Q: How do I zoom in on a specific point on the graph?
**A:** Place your mouse cursor directly over the point of interest and roll your mouse wheel forward. The graph zooms into that specific coordinate point. Click `⟲ Reset` on the toolbar to reset to full view.

---

*Vedic Mathematics Studio © 2026. Concept & Design by K.S.Chandra.*
