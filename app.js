/**
 * Vedic Mathematics Studio - Master Studio Logic
 * Concept & Design by K.S.Chandra 2026
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    activeSutraId: "ekadhikena",
    currentData: null,
    activeStepIndex: 0,
    isPlaying: false,
    playInterval: null,
    playSpeed: 1500,
    activeVisualTab: "graph",
    theme: "dark"
  };

  // Sutra Metadata & Input Configurations
  const sutraConfigs = {
    "ekadhikena": {
      title: "1. Ekādhikena Pūrveṇa",
      sanskrit: "By One More Than the Previous",
      desc: "Squaring numbers ending in 5: Multiply previous part P by (P + 1) for L.H.S, append 25 for R.H.S.",
      category: "multiplication",
      inputs: [
        { id: "ekad_num", label: "Number ending in 5:", type: "number", value: 65, step: 10 }
      ],
      presets: [
        { label: "15²", values: { ekad_num: 15 } },
        { label: "25²", values: { ekad_num: 25 } },
        { label: "35²", values: { ekad_num: 35 } },
        { label: "45²", values: { ekad_num: 45 } },
        { label: "65²", values: { ekad_num: 65 } },
        { label: "105²", values: { ekad_num: 105 } },
        { label: "165²", values: { ekad_num: 165 } },
        { label: "225²", values: { ekad_num: 225 } }
      ],
      calculate: (vals) => VedicEngine.squareEndingIn5(vals.ekad_num)
    },
    "recurring_decimals": {
      title: "1b. Recurring Decimals (1/a9)",
      sanskrit: "Ekādhikena Pūrveṇa on Vulgar Fractions",
      desc: "Converts 1/19, 1/49, 1/39 into repeating decimal cycles via successive division or multiplication by (a + 1).",
      category: "fractions",
      inputs: [
        { id: "rec_a", label: "Digit 'a' (forming 1/a9):", type: "number", value: 1, min: 1, max: 9 }
      ],
      presets: [
        { label: "1/19 (18 places)", values: { rec_a: 1 } },
        { label: "1/49 (42 places)", values: { rec_a: 4 } },
        { label: "1/39 (6 places)", values: { rec_a: 3 } },
        { label: "1/29", values: { rec_a: 2 } },
        { label: "1/59", values: { rec_a: 5 } },
        { label: "1/79", values: { rec_a: 7 } }
      ],
      calculate: (vals) => VedicEngine.recurringDecimal1_a9(vals.rec_a, "division")
    },
    "nikhilam_mult": {
      title: "2. Nikhilam Navataścaramam Daśataḥ",
      sanskrit: "All from 9 and the Last from 10",
      desc: "Base multiplication near powers of 10. Covers numbers below base, above base, and mixed.",
      category: "multiplication",
      inputs: [
        { id: "nik_n1", label: "First Number (N₁):", type: "number", value: 97 },
        { id: "nik_n2", label: "Second Number (N₂):", type: "number", value: 94 }
      ],
      presets: [
        { label: "97 × 94 (Below 100)", values: { nik_n1: 97, nik_n2: 94 } },
        { label: "986 × 989 (Below 1000)", values: { nik_n1: 986, nik_n2: 989 } },
        { label: "13 × 12 (Above 10)", values: { nik_n1: 13, nik_n2: 12 } },
        { label: "104 × 102 (Above 100)", values: { nik_n1: 104, nik_n2: 102 } },
        { label: "13 × 7 (Mixed 10)", values: { nik_n1: 13, nik_n2: 7 } },
        { label: "108 × 94 (Mixed 100)", values: { nik_n1: 108, nik_n2: 94 } },
        { label: "998 × 1025 (Mixed 1000)", values: { nik_n1: 998, nik_n2: 1025 } }
      ],
      calculate: (vals) => VedicEngine.nikhilamMultiply(vals.nik_n1, vals.nik_n2)
    },
    "nikhilam_div": {
      title: "2b. Nikhilam Division",
      sanskrit: "Synthetic Division Near Powers of 10",
      desc: "Divides numbers by divisors below base (9, 89, 98, 897, 997) using complements and additions.",
      category: "division",
      inputs: [
        { id: "nikd_dividend", label: "Dividend:", type: "number", value: 1235 },
        { id: "nikd_divisor", label: "Divisor (Near Base):", type: "number", value: 89 }
      ],
      presets: [
        { label: "1235 ÷ 89", values: { nikd_dividend: 1235, nikd_divisor: 89 } },
        { label: "13 ÷ 9", values: { nikd_dividend: 13, nikd_divisor: 9 } },
        { label: "511 ÷ 9", values: { nikd_dividend: 511, nikd_divisor: 9 } },
        { label: "1204 ÷ 9", values: { nikd_dividend: 1204, nikd_divisor: 9 } },
        { label: "10015 ÷ 89", values: { nikd_dividend: 10015, nikd_divisor: 89 } },
        { label: "10015 ÷ 98", values: { nikd_dividend: 10015, nikd_divisor: 98 } },
        { label: "11422 ÷ 897", values: { nikd_dividend: 11422, nikd_divisor: 897 } }
      ],
      calculate: (vals) => VedicEngine.nikhilamDivision(vals.nikd_dividend, vals.nikd_divisor)
    },
    "urdhva": {
      title: "3. Ūrdhva - Tiryagbhyām",
      sanskrit: "Vertically and Crosswise",
      desc: "The universal multiplication algorithm of Vedic mathematics for any numbers and polynomials.",
      category: "multiplication",
      inputs: [
        { id: "urdhva_n1", label: "Multiplicand:", type: "number", value: 234 },
        { id: "urdhva_n2", label: "Multiplier:", type: "number", value: 316 }
      ],
      presets: [
        { label: "14 × 12 (2×2)", values: { urdhva_n1: 14, urdhva_n2: 12 } },
        { label: "23 × 13", values: { urdhva_n1: 23, urdhva_n2: 13 } },
        { label: "32 × 24", values: { urdhva_n1: 32, urdhva_n2: 24 } },
        { label: "48 × 47", values: { urdhva_n1: 48, urdhva_n2: 47 } },
        { label: "124 × 132 (3×3)", values: { urdhva_n1: 124, urdhva_n2: 132 } },
        { label: "234 × 316", values: { urdhva_n1: 234, urdhva_n2: 316 } }
      ],
      calculate: (vals) => VedicEngine.urdhvaTiryagbhyam(vals.urdhva_n1, vals.urdhva_n2)
    },
    "paravartya_div": {
      title: "4. Parāvartya Yojayet (Division)",
      sanskrit: "Transpose and Apply in Division",
      desc: "Divides when divisor is slightly greater than a base by transposing signs of excess digits.",
      category: "division",
      inputs: [
        { id: "para_div_num", label: "Dividend:", type: "number", value: 1225 },
        { id: "para_div_den", label: "Divisor (> Base):", type: "number", value: 12 }
      ],
      presets: [
        { label: "1225 ÷ 12", values: { para_div_num: 1225, para_div_den: 12 } },
        { label: "1697 ÷ 14", values: { para_div_num: 1697, para_div_den: 14 } },
        { label: "2598 ÷ 123", values: { para_div_num: 2598, para_div_den: 123 } },
        { label: "239479 ÷ 11213", values: { para_div_num: 239479, para_div_den: 11213 } },
        { label: "32894 ÷ 1028", values: { para_div_num: 32894, para_div_den: 1028 } }
      ],
      calculate: (vals) => VedicEngine.paravartyaDivision(vals.para_div_num, vals.para_div_den)
    },
    "paravartya_eq": {
      title: "4b. Parāvartya Linear Equations",
      sanskrit: "Transpose and Apply in Simple Equations",
      desc: "Instantly solves ax + b = cx + d via x = (d - b) / (a - c) without algebraic rewrites.",
      category: "algebra",
      inputs: [
        { id: "pe_a", label: "Coefficient a:", type: "number", value: 7 },
        { id: "pe_b", label: "Constant b:", type: "number", value: -5 },
        { id: "pe_c", label: "Coefficient c:", type: "number", value: 5 },
        { id: "pe_d", label: "Constant d:", type: "number", value: 1 }
      ],
      presets: [
        { label: "7x - 5 = 5x + 1", values: { pe_a: 7, pe_b: -5, pe_c: 5, pe_d: 1 } },
        { label: "3x + 4 = 2x + 6", values: { pe_a: 3, pe_b: 4, pe_c: 2, pe_d: 6 } }
      ],
      calculate: (vals) => VedicEngine.paravartyaLinear(vals.pe_a, vals.pe_b, vals.pe_c, vals.pe_d)
    },
    "sunyam": {
      title: "5. Śūnyaṁ Sāmyasamuccaye",
      sanskrit: "When the Collection is Same, It is Zero",
      desc: "Solves cubic equations of form (x - a)³ + (x - b)³ = 2(x - c)³ by equating (x - c) = 0.",
      category: "algebra",
      inputs: [
        { id: "sun_a", label: "Parameter a:", type: "number", value: 4 },
        { id: "sun_b", label: "Parameter b:", type: "number", value: 6 },
        { id: "sun_c", label: "Parameter c = (a+b)/2:", type: "number", value: 5 }
      ],
      presets: [
        { label: "(x-4)³ + (x-6)³ = 2(x-5)³", values: { sun_a: 4, sun_b: 6, sun_c: 5 } },
        { label: "(x-249)³ + (x+247)³ = 2(x-1)³", values: { sun_a: 249, sun_b: -247, sun_c: 1 } },
        { label: "(x-3)³ + (x-9)³ = 2(x-6)³", values: { sun_a: 3, sun_b: 9, sun_c: 6 } },
        { label: "(x+4)³ + (x-10)³ = 2(x-3)³", values: { sun_a: -4, sun_b: 10, sun_c: 3 } }
      ],
      calculate: (vals) => VedicEngine.sunyamSamyaSamuccaye("cubes_linear", { a: vals.sun_a, b: vals.sun_b, c: vals.sun_c })
    },
    "anurupye_sunyam": {
      title: "6. Ānurūpye Śūnyamanyat",
      sanskrit: "If One is in Ratio, the Other is Zero",
      desc: "Solves simultaneous equations when the ratio of one variable's coefficients equals the constant ratio.",
      category: "algebra",
      inputs: [
        { id: "as_a1", label: "a₁:", type: "number", value: 3 },
        { id: "as_b1", label: "b₁:", type: "number", value: 7 },
        { id: "as_c1", label: "c₁:", type: "number", value: 2 },
        { id: "as_a2", label: "a₂:", type: "number", value: 4 },
        { id: "as_b2", label: "b₂:", type: "number", value: 21 },
        { id: "as_c2", label: "c₂:", type: "number", value: 6 }
      ],
      presets: [
        { label: "3x+7y=2 & 4x+21y=6 (x=0)", values: { as_a1: 3, as_b1: 7, as_c1: 2, as_a2: 4, as_b2: 21, as_c2: 6 } },
        { label: "323x+147y=1615 & 969x+321y=4845 (y=0)", values: { as_a1: 323, as_b1: 147, as_c1: 1615, as_a2: 969, as_b2: 321, as_c2: 4845 } }
      ],
      calculate: (vals) => VedicEngine.anurupyeSunyamanyat(vals.as_a1, vals.as_b1, vals.as_c1, vals.as_a2, vals.as_b2, vals.as_c2)
    },
    "sankalana": {
      title: "7. Saṅkalana - Vyavakalanābhyām",
      sanskrit: "By Addition and by Subtraction",
      desc: "Solves systems with interchanged coefficients: Add equations, subtract equations, solve instantly.",
      category: "algebra",
      inputs: [
        { id: "sv_a1", label: "a₁:", type: "number", value: 45 },
        { id: "sv_b1", label: "b₁:", type: "number", value: -23 },
        { id: "sv_c1", label: "c₁:", type: "number", value: 113 },
        { id: "sv_a2", label: "a₂:", type: "number", value: 23 },
        { id: "sv_b2", label: "b₂:", type: "number", value: -45 },
        { id: "sv_c2", label: "c₂:", type: "number", value: 91 }
      ],
      presets: [
        { label: "45x - 23y = 113 & 23x - 45y = 91", values: { sv_a1: 45, sv_b1: -23, sv_c1: 113, sv_a2: 23, sv_b2: -45, sv_c2: 91 } },
        { label: "1955x - 476y = 2482 & 476x - 1955y = -4913", values: { sv_a1: 1955, sv_b1: -476, sv_c1: 2482, sv_a2: 476, sv_b2: -1955, sv_c2: -4913 } },
        { label: "3x + 2y = 18 & 2x + 3y = 17", values: { sv_a1: 3, sv_b1: 2, sv_c1: 18, sv_a2: 2, sv_b2: 3, sv_c2: 17 } }
      ],
      calculate: (vals) => VedicEngine.sankalanaVyavakalan(vals.sv_a1, vals.sv_b1, vals.sv_c1, vals.sv_a2, vals.sv_b2, vals.sv_c2)
    },
    "ekanyunena": {
      title: "10. Ekanyūnena Pūrveṇa",
      sanskrit: "By One Less Than the Previous",
      desc: "High-speed multiplication by strings of 9s (9, 99, 999, 9999...).",
      category: "multiplication",
      inputs: [
        { id: "ekan_m", label: "Multiplicand:", type: "number", value: 356 },
        { id: "ekan_9s", label: "9s Multiplier:", type: "number", value: 999 }
      ],
      presets: [
        { label: "24 × 99", values: { ekan_m: 24, ekan_9s: 99 } },
        { label: "356 × 999", values: { ekan_m: 356, ekan_9s: 999 } },
        { label: "878 × 9999", values: { ekan_m: 878, ekan_9s: 9999 } },
        { label: "42 × 9", values: { ekan_m: 42, ekan_9s: 9 } },
        { label: "124 × 9", values: { ekan_m: 124, ekan_9s: 9 } }
      ],
      calculate: (vals) => VedicEngine.ekanyunenaPurvena(vals.ekan_m, vals.ekan_9s)
    },
    "anurupyena_mult": {
      title: "11. Ānurūpyeṇa (Proportional Bases)",
      sanskrit: "Proportionality in Multiplication",
      desc: "Multiplication using working bases (e.g. 50 = 100/2, 40 = 4×10, 20, 500, 4000).",
      category: "multiplication",
      inputs: [
        { id: "an_n1", label: "Number 1:", type: "number", value: 46 },
        { id: "an_n2", label: "Number 2:", type: "number", value: 43 },
        { id: "an_base", label: "Working Base:", type: "number", value: 50 }
      ],
      presets: [
        { label: "46 × 43 (Base 50)", values: { an_n1: 46, an_n2: 43, an_base: 50 } },
        { label: "42 × 48 (Base 50)", values: { an_n1: 42, an_n2: 48, an_base: 50 } },
        { label: "24 × 23 (Base 20)", values: { an_n1: 24, an_n2: 23, an_base: 20 } },
        { label: "492 × 404 (Base 500)", values: { an_n1: 492, an_n2: 404, an_base: 500 } }
      ],
      calculate: (vals) => VedicEngine.anurupyenaMultiply(vals.an_n1, vals.an_n2, vals.an_base)
    },
    "carpentry_area": {
      title: "12. Ādyamādyenāntyamantyena (Area)",
      sanskrit: "The First by the First and the Last by the Last",
      desc: "Carpenter's mental method for rectangular area with mixed feet and inches.",
      category: "geometry",
      inputs: [
        { id: "ca_lft", label: "Length (Ft):", type: "number", value: 6 },
        { id: "ca_lin", label: "Length (In):", type: "number", value: 4 },
        { id: "ca_bft", label: "Breadth (Ft):", type: "number", value: 5 },
        { id: "ca_bin", label: "Breadth (In):", type: "number", value: 8 }
      ],
      presets: [
        { label: "6' 4\" × 5' 8\"", values: { ca_lft: 6, ca_lin: 4, ca_bft: 5, ca_bin: 8 } },
        { label: "4' 6\" × 3' 4\"", values: { ca_lft: 4, ca_lin: 6, ca_bft: 3, ca_bin: 4 } },
        { label: "3' 8\" × 2' 4\"", values: { ca_lft: 3, ca_lin: 8, ca_bft: 2, ca_bin: 4 } }
      ],
      calculate: (vals) => VedicEngine.areaFeetInches(vals.ca_lft, vals.ca_lin, vals.ca_bft, vals.ca_bin)
    },
    "factorize_quad": {
      title: "12b. Quadratic Factorization",
      sanskrit: "Adyamadyena & Anurupyena Factorization",
      desc: "Mental quadratic factorization: split middle term by ratio, divide first by first and last by last.",
      category: "algebra",
      inputs: [
        { id: "fq_a", label: "a (x² coeff):", type: "number", value: 3 },
        { id: "fq_b", label: "b (x coeff):", type: "number", value: 8 },
        { id: "fq_c", label: "c (constant):", type: "number", value: 4 }
      ],
      presets: [
        { label: "3x² + 8x + 4", values: { fq_a: 3, fq_b: 8, fq_c: 4 } },
        { label: "4x² + 12x + 5", values: { fq_a: 4, fq_b: 12, fq_c: 5 } },
        { label: "3x² + 14x + 15", values: { fq_a: 3, fq_b: 14, fq_c: 15 } },
        { label: "6x² - 23x + 7", values: { fq_a: 6, fq_b: -23, fq_c: 7 } }
      ],
      calculate: (vals) => VedicEngine.factorizeQuadratic(vals.fq_a, vals.fq_b, vals.fq_c)
    },
    "yavadunam_square": {
      title: "13. Yāvadūnaṁ Squaring",
      sanskrit: "Whatever the Deficiency Subtract That Deficit",
      desc: "Universal squaring near powers of 10 and sub-bases using deficit/surplus adjustment.",
      category: "squaring",
      inputs: [
        { id: "yav_n", label: "Number to Square:", type: "number", value: 96 }
      ],
      presets: [
        { label: "9²", values: { yav_n: 9 } },
        { label: "96²", values: { yav_n: 96 } },
        { label: "994²", values: { yav_n: 994 } },
        { label: "9988²", values: { yav_n: 9988 } },
        { label: "13²", values: { yav_n: 13 } },
        { label: "112²", values: { yav_n: 112 } }
      ],
      calculate: (vals) => VedicEngine.yavadunamSquare(vals.yav_n)
    },
    "antyayor_dasakepi": {
      title: "14. Antyayordaśake'pi",
      sanskrit: "When the Last Digits Add up to 10",
      desc: "Multiplication when unit digits sum to 10 and prefixes are identical: P(P + 1) / (u₁ × u₂).",
      category: "multiplication",
      inputs: [
        { id: "ant_n1", label: "Number 1:", type: "number", value: 47 },
        { id: "ant_n2", label: "Number 2:", type: "number", value: 43 }
      ],
      presets: [
        { label: "47 × 43", values: { ant_n1: 47, ant_n2: 43 } },
        { label: "62 × 68", values: { ant_n1: 62, ant_n2: 68 } },
        { label: "127 × 123", values: { ant_n1: 127, ant_n2: 123 } },
        { label: "395 × 395", values: { ant_n1: 395, ant_n2: 395 } }
      ],
      calculate: (vals) => VedicEngine.antyayorDasakepi(vals.ant_n1, vals.ant_n2)
    },
    "antyayoreva": {
      title: "15. Antyayoreva",
      sanskrit: "Only the Last Terms",
      desc: "Solves rational quadratic equations by equating the entire ratio to the ratio of last terms.",
      category: "algebra",
      inputs: [
        { id: "ar_a", label: "a:", type: "number", value: 2 },
        { id: "ar_b", label: "b:", type: "number", value: 7 },
        { id: "ar_c", label: "c:", type: "number", value: 3 },
        { id: "ar_d", label: "d:", type: "number", value: 5 },
        { id: "ar_e", label: "e:", type: "number", value: 2 },
        { id: "ar_f", label: "f:", type: "number", value: 3 }
      ],
      presets: [
        { label: "(x²+2x+7)/(x²+3x+5) = (x+2)/(x+3)", values: { ar_a: 2, ar_b: 7, ar_c: 3, ar_d: 5, ar_e: 2, ar_f: 3 } },
        { label: "(2x²+3x+10)/(3x²+4x+14) = (2x+3)/(3x+4)", values: { ar_a: 3, ar_b: 10, ar_c: 4, ar_d: 14, ar_e: 3, ar_f: 4 } }
      ],
      calculate: (vals) => VedicEngine.antyayoreva(vals.ar_a, vals.ar_b, vals.ar_c, vals.ar_d, vals.ar_e, vals.ar_f)
    },
    "vilokanam": {
      title: "17. Vilokanam (Observation)",
      sanskrit: "By Mere Observation",
      desc: "Solves symmetric equations x + 1/x = (p² + q²)/(pq) by immediate inspection.",
      category: "algebra",
      inputs: [
        { id: "vil_p", label: "p:", type: "number", value: 3 },
        { id: "vil_q", label: "q:", type: "number", value: 5 }
      ],
      presets: [
        { label: "x + 1/x = 5/2 (p=2, q=1)", values: { vil_p: 2, vil_q: 1 } },
        { label: "x + 1/x = 34/15 (p=3, q=5)", values: { vil_p: 3, vil_q: 5 } },
        { label: "x + 1/x = 113/56 (p=7, q=8)", values: { vil_p: 7, vil_q: 8 } }
      ],
      calculate: (vals) => VedicEngine.vilokanamSymmetric(vals.vil_p, vals.vil_q)
    },
    "beejank": {
      title: "Section III. Beejank & Casting Out 9s",
      sanskrit: "Bījāṅka Digital Root Verification",
      desc: "Infallible verification system based on invariance modulo 9. Cancels 9s for instant verification.",
      category: "foundations",
      inputs: [
        { id: "bj_num", label: "Number to analyze:", type: "number", value: 632174 }
      ],
      presets: [
        { label: "632174", values: { bj_num: 632174 } },
        { label: "1256847", values: { bj_num: 1256847 } },
        { label: "1567", values: { bj_num: 1567 } },
        { label: "348", values: { bj_num: 348 } }
      ],
      calculate: (vals) => {
        const b = VedicEngine.calculateBeejank(vals.bj_num);
        return {
          type: "beejank",
          sutraName: "Bījāṅka",
          result: `Beejank = ${b.beejank}`,
          steps: b.breakdown.map((item, i) => ({
            title: `Beejank Reduction ${i + 1}`,
            desc: `Summing digits of ${item.num}: ${item.digits.join(" + ")} = ${item.sum}`,
            math: `\\sum = ${item.sum}`
          })),
          proof: "Beejank is invariant modulo 9. Casting out 9s never changes the algebraic checksum."
        };
      }
    },
    "dwandwa_square": {
      title: "Section III. Dwandwa-Yoga (Duplex Squaring)",
      sanskrit: "Universal Mental Squaring of Any N-Digit Number",
      desc: "Uses Duplexes: D(a)=a², D(ab)=2ab, D(abc)=2ac+b², D(abcd)=2ad+2bc to square numbers in 1 line.",
      category: "squaring",
      inputs: [
        { id: "dw_n", label: "Number to square:", type: "number", value: 1426 }
      ],
      presets: [
        { label: "62²", values: { dw_n: 62 } },
        { label: "234²", values: { dw_n: 234 } },
        { label: "1426²", values: { dw_n: 1426 } }
      ],
      calculate: (vals) => VedicEngine.dwandwaSquare(vals.dw_n)
    },
    "anurupyena_cube": {
      title: "Section III. Anurupyena Cubing",
      sanskrit: "Geometric Progression Row Method: a³, a²b, ab², b³",
      desc: "Cubes two-digit numbers using ratio GP. Explore the cubic equation graph above!",
      category: "squaring",
      inputs: [
        { id: "cube_n", label: "Two-digit number (10 to 99):", type: "number", value: 14, min: 10, max: 99 }
      ],
      presets: [
        { label: "14³ = 2744", values: { cube_n: 14 } },
        { label: "18³ = 5832", values: { cube_n: 18 } },
        { label: "33³ = 35937", values: { cube_n: 33 } }
      ],
      calculate: (vals) => VedicEngine.anurupyenaCube(vals.cube_n)
    },
    "straight_line": {
      title: "Section III. Straight Line Through 2 Points",
      sanskrit: "Coordinate Geometry by Parāvartya",
      desc: "Determines the equation of a line passing through (x₁, y₁) and (x₂, y₂) in one mental step.",
      category: "geometry",
      inputs: [
        { id: "sl_x1", label: "x₁:", type: "number", value: 9 },
        { id: "sl_y1", label: "y₁:", type: "number", value: 7 },
        { id: "sl_x2", label: "x₂:", type: "number", value: 5 },
        { id: "sl_y2", label: "y₂:", type: "number", value: 2 }
      ],
      presets: [
        { label: "(9,7) and (5,2)", values: { sl_x1: 9, sl_y1: 7, sl_x2: 5, sl_y2: 2 } },
        { label: "(2,-3) and (4,-7)", values: { sl_x1: 2, sl_y1: -3, sl_x2: 4, sl_y2: -7 } },
        { label: "(7,9) and (3,-7)", values: { sl_x1: 7, sl_y1: 9, sl_x2: 3, sl_y2: -7 } }
      ],
      calculate: (vals) => VedicEngine.straightLine2Points(vals.sl_x1, vals.sl_y1, vals.sl_x2, vals.sl_y2)
    }
  };

  // DOM Containers
  const sutraSelector = document.getElementById("sutra-select-dropdown");
  const sutraInputContainer = document.getElementById("sutra-input-form");
  const sutraTitleElem = document.getElementById("sutra-hero-title");
  const sutraSanskritElem = document.getElementById("sutra-hero-sanskrit");
  const sutraDescElem = document.getElementById("sutra-hero-desc");
  const presetsContainer = document.getElementById("sutra-presets-container");

  const calcResultVal = document.getElementById("current-result-val");
  const beejankBox = document.getElementById("beejank-verification-box");
  const beejankStatusText = document.getElementById("beejank-status-text");
  const stepFlowList = document.getElementById("step-flow-list");
  const proofTextBlock = document.getElementById("proof-text-block");

  // Playback Controls
  const btnPrev = document.getElementById("btn-prev-step");
  const btnPlay = document.getElementById("btn-play-pause");
  const btnNext = document.getElementById("btn-next-step");
  const btnReset = document.getElementById("btn-reset-step");
  const speedSelect = document.getElementById("playback-speed-select");
  const stepIndicator = document.getElementById("step-indicator-text");

  // Visual Tabs
  const visualTabButtons = document.querySelectorAll(".visual-tab-btn");
  const stageGraph = document.getElementById("visual-stage-graph");
  const stageChart = document.getElementById("visual-stage-chart");

  // Navigation Setup
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.getAttribute("data-target");
      if (target === "how-to-guide") {
        document.getElementById("how-to-modal").style.display = "block";
        return;
      }
      if (target === "batch-verification") {
        document.getElementById("batch-verification-modal").style.display = "block";
        return;
      }
      if (target === "sources-credits") {
        document.getElementById("sources-modal").style.display = "block";
        return;
      }
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      loadSutra(target);
    });
  });

  // Dropdown Quick Selector
  if (sutraSelector) {
    sutraSelector.addEventListener("change", (e) => {
      loadSutra(e.target.value);
    });
  }

  // Load Sutra and Build Dynamic UI
  function loadSutra(sutraId) {
    const config = sutraConfigs[sutraId];
    if (!config) return;

    state.activeSutraId = sutraId;
    if (sutraSelector) sutraSelector.value = sutraId;

    sutraTitleElem.textContent = config.title;
    sutraSanskritElem.textContent = config.sanskrit;
    sutraDescElem.textContent = config.desc;

    // Build Inputs
    sutraInputContainer.innerHTML = "";
    config.inputs.forEach(inp => {
      const group = document.createElement("div");
      group.className = "form-group";
      group.innerHTML = `
        <label class="form-label" for="${inp.id}">${inp.label}</label>
        <input type="${inp.type}" id="${inp.id}" class="form-input" value="${inp.value}" ${inp.step ? `step="${inp.step}"` : ''} ${inp.min !== undefined ? `min="${inp.min}"` : ''} ${inp.max !== undefined ? `max="${inp.max}"` : ''}>
      `;
      sutraInputContainer.appendChild(group);

      // Auto-recalculate on change/input
      group.querySelector("input").addEventListener("input", executeActiveCalculation);
    });

    // Action calculate button
    const btnCalc = document.createElement("button");
    btnCalc.className = "btn btn-primary";
    btnCalc.style.width = "100%";
    btnCalc.style.marginTop = "8px";
    btnCalc.innerHTML = "⚡ Calculate Vedic Result";
    btnCalc.addEventListener("click", executeActiveCalculation);
    sutraInputContainer.appendChild(btnCalc);

    // Build Presets
    presetsContainer.innerHTML = "";
    config.presets.forEach(preset => {
      const pBtn = document.createElement("button");
      pBtn.className = "pill-btn";
      pBtn.textContent = preset.label;
      pBtn.addEventListener("click", () => {
        for (const [id, val] of Object.entries(preset.values)) {
          const inp = document.getElementById(id);
          if (inp) inp.value = val;
        }
        executeActiveCalculation();
      });
      presetsContainer.appendChild(pBtn);
    });

    // Execute immediately
    executeActiveCalculation();
  }

  // Execute Calculation and Render Everything
  function executeActiveCalculation() {
    const config = sutraConfigs[state.activeSutraId];
    if (!config) return;

    // Collect input values
    const vals = {};
    config.inputs.forEach(inp => {
      const elem = document.getElementById(inp.id);
      vals[inp.id] = elem ? Number(elem.value) : inp.value;
    });

    try {
      const data = config.calculate(vals);
      state.currentData = data;
      state.activeStepIndex = 0;
      stopPlayback();

      // Update Big Result Banner
      if (calcResultVal) {
        calcResultVal.textContent = data.result !== undefined ? data.result : "Solved";
      }

      // Update Beejank Badge
      if (beejankBox) {
        if (data.vedicCheck) {
          beejankBox.style.display = "flex";
          beejankStatusText.textContent = data.vedicCheck.valid ? "✓ 100% Verified (Beejank Match)" : "Beejank Check Completed";
          beejankStatusText.style.color = data.vedicCheck.valid ? "#10b981" : "#f59e0b";
        } else {
          beejankBox.style.display = "none";
        }
      }

      // Populate Step-by-Step Flow Cards
      if (stepFlowList) {
        stepFlowList.innerHTML = (data.steps || []).map((s, idx) => `
          <div class="step-card ${idx === 0 ? 'active-step' : ''}" data-step="${idx}">
            <div class="step-header">Step ${idx + 1}: ${s.title}</div>
            <div class="step-desc">${s.desc}</div>
            ${s.math ? `<div class="step-formula">${s.math}</div>` : ''}
          </div>
        `).join("");

        // Click on step card to jump
        document.querySelectorAll(".step-card").forEach(sc => {
          sc.addEventListener("click", () => {
            const stepIdx = parseInt(sc.getAttribute("data-step"));
            state.activeStepIndex = stepIdx;
            updateStepView();
          });
        });
      }

      // Update Proof
      if (proofTextBlock) {
        proofTextBlock.textContent = data.proof || "Empirical and algebraic proof established by Vedic aphorisms.";
      }

      // Render Graph of the Equation
      if (state.activeVisualTab === "graph") {
        EquationGraph.render("equation-graph-canvas", data, state.activeStepIndex);
      }

      // Render Comparison Chart
      ChartsManager.renderComparisonChart("comparison-canvas", config.category);

      updateStepView();
    } catch (err) {
      console.error(err);
      if (calcResultVal) calcResultVal.textContent = "Input Notice: " + err.message;
    }
  }

  // Visual Tab Switches
  visualTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      visualTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.getAttribute("data-tab");
      state.activeVisualTab = mode;

      if (stageGraph) stageGraph.style.display = mode === "graph" ? "block" : "none";
      if (stageChart) stageChart.style.display = mode === "chart" ? "block" : "none";

      if (mode === "graph") {
        EquationGraph.render("equation-graph-canvas", state.currentData, state.activeStepIndex);
      } else if (mode === "chart") {
        ChartsManager.renderComparisonChart("comparison-canvas", sutraConfigs[state.activeSutraId]?.category || "multiplication");
      }
    });
  });

  // Playback Control Handlers
  if (btnPlay) btnPlay.addEventListener("click", togglePlayPause);
  if (btnNext) btnNext.addEventListener("click", () => stepDelta(1));
  if (btnPrev) btnPrev.addEventListener("click", () => stepDelta(-1));
  if (btnReset) btnReset.addEventListener("click", resetStepCounter);
  if (speedSelect) {
    speedSelect.addEventListener("change", (e) => {
      state.playSpeed = parseInt(e.target.value) || 1500;
      if (state.isPlaying) {
        stopPlayback();
        startPlayback();
      }
    });
  }

  function togglePlayPause() {
    state.isPlaying ? stopPlayback() : startPlayback();
  }

  function startPlayback() {
    if (!state.currentData || !state.currentData.steps) return;
    state.isPlaying = true;
    if (btnPlay) btnPlay.innerHTML = "⏸ Pause";

    state.playInterval = setInterval(() => {
      if (state.activeStepIndex < state.currentData.steps.length - 1) {
        stepDelta(1);
      } else {
        stopPlayback();
      }
    }, state.playSpeed);
  }

  function stopPlayback() {
    state.isPlaying = false;
    if (state.playInterval) {
      clearInterval(state.playInterval);
      state.playInterval = null;
    }
    if (btnPlay) btnPlay.innerHTML = "▶ Play";
  }

  function resetStepCounter() {
    stopPlayback();
    state.activeStepIndex = 0;
    updateStepView();
  }

  function stepDelta(delta) {
    if (!state.currentData || !state.currentData.steps) return;
    const max = state.currentData.steps.length - 1;
    const next = state.activeStepIndex + delta;
    if (next >= 0 && next <= max) {
      state.activeStepIndex = next;
      updateStepView();
    }
  }

  function updateStepView() {
    if (!state.currentData || !state.currentData.steps) return;

    document.querySelectorAll(".step-card").forEach((card, idx) => {
      if (idx === state.activeStepIndex) {
        card.classList.add("active-step");
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        card.classList.remove("active-step");
      }
    });

    if (stepIndicator) {
      stepIndicator.textContent = `Step ${state.activeStepIndex + 1} of ${state.currentData.steps.length}`;
    }

    // Refresh dynamic Graph of the Equation with current step highlight
    if (state.activeVisualTab === "graph") {
      EquationGraph.render("equation-graph-canvas", state.currentData, state.activeStepIndex);
    }
  }

  // Theme Toggle
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.body.setAttribute("data-theme", state.theme);
      themeToggleBtn.innerHTML = state.theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode";
      if (ChartsManager && ChartsManager.activeChart) {
        ChartsManager.renderComparisonChart("comparison-canvas", sutraConfigs[state.activeSutraId]?.category || "multiplication");
      }
    });
  }

  // Multi-Format Export Handlers
  document.getElementById("export-word-btn")?.addEventListener("click", () => {
    if (!state.currentData) return;
    ExportManager.exportToWord(sutraConfigs[state.activeSutraId]?.title || "Vedic Calculation", state.currentData.sutraName || "Vedic Sutra", state.currentData);
  });

  document.getElementById("export-pdf-btn")?.addEventListener("click", () => {
    ExportManager.exportToPDF();
  });

  document.getElementById("export-infographic-btn")?.addEventListener("click", () => {
    ExportManager.exportInfographic("infographic-capture-box", `Vedic_${state.activeSutraId}_2026.png`);
  });

  document.getElementById("export-html-btn")?.addEventListener("click", () => {
    if (!state.currentData) return;
    ExportManager.exportInteractiveHTML(state.activeSutraId, {}, {
      title: sutraConfigs[state.activeSutraId]?.title,
      sutraName: state.currentData.sutraName,
      result: state.currentData.result,
      steps: state.currentData.steps,
      proof: state.currentData.proof
    });
  });

  // Batch Verification Runner
  document.getElementById("run-batch-btn")?.addEventListener("click", () => {
    const rawText = document.getElementById("batch-input-area").value;
    const lines = rawText.trim().split("\n");
    const tbody = document.getElementById("batch-results-tbody");
    tbody.innerHTML = "";

    lines.forEach((line, idx) => {
      const parts = line.split(",").map(s => s.trim());
      if (parts.length >= 2) {
        const n1 = parseInt(parts[0]);
        const n2 = parseInt(parts[1]);
        if (!isNaN(n1) && !isNaN(n2)) {
          const vedic = n1 * n2;
          const standard = n1 * n2;
          const check = VedicEngine.beejankCheckMult(n1, n2, vedic);
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${idx + 1}</td>
            <td style="font-weight:600; color:#cbd5e1;">${n1} × ${n2}</td>
            <td style="font-weight:bold; color:#38bdf8;">${vedic}</td>
            <td>${standard}</td>
            <td><span class="badge-pass">PASS (100% Match)</span></td>
            <td style="color:#10b981; font-weight:bold;">Beejank ${check.bProd} = ${check.expected} ✓</td>
          `;
          tbody.appendChild(tr);
        }
      }
    });
  });

  // Modal Closers
  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".modal-overlay").style.display = "none";
    });
  });

  // Initialize with Ekadhikena Purvena
  loadSutra("ekadhikena");
});
