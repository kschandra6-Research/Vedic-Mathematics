/**
 * Charts and Graphs Manager
 * Dynamic Visual Comparisons & Mathematical Analytics using Chart.js
 * Concept & Design by K.S.Chandra 2026
 */

const ChartsManager = {
  activeChart: null,

  // Render Vedic vs Conventional Efficiency Comparison Chart
  renderComparisonChart(canvasId, calculationType = "multiplication") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (this.activeChart) {
      this.activeChart.destroy();
      this.activeChart = null;
    }

    let labels = [];
    let vedicData = [];
    let conventionalData = [];

    if (calculationType.includes("multiplication") || calculationType.includes("square")) {
      labels = ["Written Steps", "Scratch Lines", "Mental Operations", "Time (seconds)", "Error Risk (%)"];
      vedicData = [1, 1, 4, 3, 5];
      conventionalData = [4, 5, 12, 14, 25];
    } else if (calculationType.includes("division")) {
      labels = ["Division Steps", "Intermediate Lines", "Repeated Subtractions", "Calculation Time", "Complexity Index"];
      vedicData = [2, 1, 1, 5, 20];
      conventionalData = [6, 8, 7, 18, 75];
    } else {
      labels = ["Step Count", "Equation Rewrites", "Algebraic Expansions", "Mental Effort", "Time Taken"];
      vedicData = [1, 1, 0, 10, 2];
      conventionalData = [5, 6, 4, 60, 15];
    }

    this.activeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "⚡ Vedic Mathematics Method",
            data: vedicData,
            backgroundColor: "rgba(56, 189, 248, 0.75)",
            borderColor: "#38bdf8",
            borderWidth: 2,
            borderRadius: 6
          },
          {
            label: "🐢 Conventional Textbook Method",
            data: conventionalData,
            backgroundColor: "rgba(244, 63, 94, 0.65)",
            borderColor: "#f43f5e",
            borderWidth: 2,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#e2e8f0",
              font: { family: "'Segoe UI', system-ui", weight: "bold", size: 12 }
            }
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#38bdf8",
            bodyColor: "#f1f5f9",
            borderColor: "#334155",
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(51, 65, 85, 0.3)" },
            ticks: { color: "#94a3b8", font: { family: "'Segoe UI', system-ui" } }
          },
          y: {
            grid: { color: "rgba(51, 65, 85, 0.3)" },
            ticks: { color: "#94a3b8", font: { family: "'Segoe UI', system-ui" } }
          }
        }
      }
    });
  }
};

if (typeof window !== "undefined") {
  window.ChartsManager = ChartsManager;
}
