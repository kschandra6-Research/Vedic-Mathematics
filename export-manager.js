/**
 * Export Manager
 * Generates Word (.doc), PDF, Infographic (PNG), and Standalone Interactive HTML
 * Concept & Design by K.S.Chandra 2026
 */

const ExportManager = {
  // 1. Export as Word Document (.doc)
  exportToWord(problemTitle, sutraName, currentData) {
    const stepsHtml = (currentData.steps || []).map((s, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; width: 25%; color: #1e3a8a;">Step ${idx + 1}: ${s.title}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1; color: #334155;">${s.desc}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: 'Courier New', monospace; font-weight: bold; color: #0284c7; width: 30%;">${s.math || ''}</td>
      </tr>
    `).join("");

    const beejankHtml = currentData.vedicCheck ? `
      <div style="margin-top: 15px; padding: 12px; background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 4px;">
        <h4 style="margin: 0 0 5px 0; color: #065f46;">✨ Vedic Beejank Verification (Casting Out 9s):</h4>
        <p style="margin: 0; color: #047857;">Status: <strong>${currentData.vedicCheck.valid ? 'VERIFIED ACCURATE (Beejank Match)' : 'Check Completed'}</strong></p>
      </div>
    ` : '';

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${problemTitle}</title>
        <style>
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 24pt; color: #1e3a8a; margin: 0; }
          .sutra { font-size: 15pt; color: #0284c7; font-style: italic; margin: 6px 0; }
          .meta { font-size: 10pt; color: #64748b; }
          .result-card { background: #eff6ff; border: 2px solid #93c5fd; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11pt; }
          .proof-box { background: #f8fafc; border: 1px dashed #94a3b8; padding: 15px; margin-top: 20px; border-radius: 6px; font-size: 10.5pt; }
          .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 9pt; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">Vedic Mathematics Calculation Report</h1>
          <div class="sutra">Sutra: <strong>${sutraName}</strong></div>
          <div class="meta">Problem Domain: ${problemTitle} | Date: ${new Date().toLocaleDateString()}</div>
        </div>

        <div class="result-card">
          <strong>Final Computed Result:</strong> <span style="color: #2563eb; font-weight: bold; font-size: 18pt;">${currentData.result !== undefined ? currentData.result : ''}</span>
          ${(typeof EquationGraph !== "undefined" && EquationGraph.model) ? `<div style="margin-top: 8px; font-size: 11pt; color: #0284c7;"><strong>📈 Mathematical Equation:</strong> <code style="font-family: 'Consolas', monospace; color: #1e3a8a;">${EquationGraph.model.equationText}</code></div>` : ''}
        </div>

        <h3>Step-by-Step Animated Working & Log:</h3>
        <table>
          <thead>
            <tr style="background: #e2e8f0; color: #1e293b;">
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Step</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Procedure & Explanation</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Symbolic Representation</th>
            </tr>
          </thead>
          <tbody>
            ${stepsHtml}
          </tbody>
        </table>

        ${beejankHtml}

        <div class="proof-box">
          <h4 style="margin: 0 0 8px 0; color: #1e293b;">📘 Algebraic Proof & Vedic Rationale:</h4>
          <pre style="font-family: 'Consolas', monospace; white-space: pre-wrap; margin: 0; color: #334155;">${currentData.proof || 'Based on the aphorisms of Vedic Mathematics.'}</pre>
        </div>

        <div class="footer">
          <p><strong>Source:</strong> <em>Vedic Mathematics - Methods</em>, Sri Sathya Sai Veda Pratishtan. Based on the works of Swami Bharati Krishna Tirtha (1884-1960).</p>
          <p><strong>Concept & Design by K.S.Chandra 2026</strong>. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vedic_Calculation_${sutraName.replace(/[^a-zA-Z0-9]/g, "_")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 2. Export as PDF Document
  exportToPDF() {
    window.print();
  },

  // 3. Export as High-Resolution Infographic Card (PNG)
  exportInfographic(cardElementId, fileName = "Vedic_Infographic.png") {
    const element = document.getElementById(cardElementId);
    if (!element) return;

    if (typeof html2canvas !== "undefined") {
      html2canvas(element, {
        backgroundColor: "#0a0e17",
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        console.error("Infographic export failed", err);
        alert("Infographic generation error: " + err.message);
      });
    } else {
      alert("html2canvas library is loading, please try again in a moment.");
    }
  },

  // 4. Export as Standalone Interactive HTML File
  exportInteractiveHTML(currentSutraId, problemInput, stateData) {
    const rawHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vedic Mathematics Interactive Output - Concept & Design by K.S.Chandra 2026</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0a0e17; color: #f8fafc; margin: 0; padding: 30px; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 25px; max-width: 900px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; margin-top: 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-weight: 600; font-size: 13px; margin-bottom: 15px; }
    .result-display { background: linear-gradient(135deg, #1e3a8a, #0369a1); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
    .result-val { font-size: 2.2rem; font-weight: 800; color: #ffffff; letter-spacing: 1px; }
    .step-box { background: #0b1120; border-left: 4px solid #38bdf8; padding: 15px; border-radius: 6px; margin: 12px 0; }
    .step-title { font-weight: bold; color: #7dd3fc; margin-bottom: 5px; }
    .step-math { font-family: monospace; background: #1e293b; padding: 6px 12px; border-radius: 4px; display: inline-block; color: #38bdf8; margin-top: 6px; }
    .proof-box { background: #1e1b4b; border: 1px solid #4338ca; border-radius: 8px; padding: 18px; margin-top: 25px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Offline Vedic Mathematics Package</div>
    <h1>${stateData.title || 'Vedic Mathematics Calculation'}</h1>
    <p><strong>Sutra:</strong> ${stateData.sutraName || 'Vedic Formula'}</p>
    <p><strong>Input Parameters:</strong> ${JSON.stringify(problemInput)}</p>

    <div class="result-display">
      <div style="font-size: 14px; text-transform: uppercase; color: #bae6fd;">Calculated Vedic Result</div>
      <div class="result-val">${stateData.result !== undefined ? stateData.result : ''}</div>
      ${(typeof EquationGraph !== "undefined" && EquationGraph.model) ? `<div style="margin-top: 10px; font-size: 14px; color: #7dd3fc;"><strong>📈 Mathematical Equation:</strong> <code style="color: #ffffff; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">${EquationGraph.model.equationText}</code></div>` : ''}
    </div>

    <h3>Step-by-Step Computational Steps:</h3>
    <div id="steps-container">
      ${(stateData.steps || []).map((s, idx) => `
        <div class="step-box">
          <div class="step-title">Step ${idx + 1}: ${s.title}</div>
          <div>${s.desc}</div>
          ${s.math ? `<div class="step-math">${s.math}</div>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="proof-box">
      <h3 style="color: #a5b4fc; margin-top: 0;">Algebraic Proof & Principle:</h3>
      <pre style="white-space: pre-wrap; font-family: monospace; color: #e0e7ff;">${stateData.proof || 'Vedic principles provide empirical and algebraic certainty.'}</pre>
    </div>

    <div class="footer">
      <p>Source: <em>Vedic Mathematics - Methods</em>, Sri Sathya Sai Veda Pratishtan.</p>
      <p><strong>Concept & Design by K.S.Chandra 2026</strong>. Self-contained Offline Interactive Application.</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([rawHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vedic_Interactive_${(stateData.sutraName || 'App').replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

if (typeof window !== "undefined") {
  window.ExportManager = ExportManager;
}
