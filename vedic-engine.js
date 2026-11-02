/**
 * Vedic Mathematics Engine
 * Based on "Vedic Mathematics - Methods" by Sri Sathya Sai Veda Pratishtan
 * Foundational Work by Swami Bharati Krishna Tirtha (1884-1960)
 * Concept & Design by K.S.Chandra 2026
 */

const VedicEngine = {
  // 1. Ekadhikena Purvena: Squares of numbers ending in 5
  squareEndingIn5(num) {
    const n = Math.abs(parseInt(num));
    if (isNaN(n) || n % 10 !== 5) {
      throw new Error("Number must be an integer ending in 5 (e.g. 15, 25, 35, 45, 65, 105, 165)");
    }
    const previous = Math.floor(n / 10);
    const oneMore = previous + 1;
    const lhs = previous * oneMore;
    const rhs = 25;
    const result = lhs * 100 + rhs;

    const steps = [
      {
        title: "Identify Parts",
        desc: `Given number is ${n}. The unit digit is 5 and the previous portion is P = ${previous}.`,
        math: `P = ${previous}, \\quad \\text{Unit digit} = 5`
      },
      {
        title: "Apply Ekadhikena Purvena ('By one more than the previous')",
        desc: `One more than the previous part: P + 1 = ${previous} + 1 = ${oneMore}.`,
        math: `P + 1 = ${previous} + 1 = ${oneMore}`
      },
      {
        title: "Calculate Left-Hand Side (L.H.S)",
        desc: `Multiply the previous part by one more than itself: ${previous} × ${oneMore} = ${lhs}.`,
        math: `\\text{L.H.S} = P \\times (P + 1) = ${previous} \\times ${oneMore} = ${lhs}`
      },
      {
        title: "Calculate Right-Hand Side (R.H.S)",
        desc: `Square the last digit (5): 5² = 25.`,
        math: `\\text{R.H.S} = 5^2 = 25`
      },
      {
        title: "Combine L.H.S and R.H.S",
        desc: `Placing L.H.S and R.H.S together: ${lhs} / 25 = ${result}.`,
        math: `${n}^2 = ${lhs} \\ / \\ 25 = ${result}`
      }
    ];

    const proof = `Algebraic Proof:\\n` +
      `Let any number ending in 5 be represented as (10a + 5).\\n` +
      `(10a + 5)² = 100a² + 2(10a)(5) + 5²\\n` +
      `            = 100a² + 100a + 25\\n` +
      `            = 100a(a + 1) + 25\\n` +
      `            = a(a + 1) · 10² + 25\\n` +
      `Thus L.H.S = a(a + 1) and R.H.S = 25.`;

    return {
      type: "square_ending_5",
      sutraName: "Ekādhikena Pūrveṇa",
      input: n,
      previous,
      oneMore,
      lhs,
      rhs,
      result,
      steps,
      proof,
      vedicCheck: VedicEngine.beejankCheckSquare(n, result)
    };
  },

  // 1b. Ekadhikena Purvena: Recurring Decimals for 1/a9
  recurringDecimal1_a9(a, method = "division") {
    a = parseInt(a);
    if (isNaN(a) || a < 1 || a > 9) {
      throw new Error("Parameter 'a' must be a single digit (1 to 9), forming denominator a9 (e.g., 19, 49, 39, etc.)");
    }
    const denom = a * 10 + 9;
    const divisor = a + 1; // ekadhika
    const steps = [];
    const digits = [];

    // Division method
    let curNum = 1;
    const maxDigits = denom - 1;
    steps.push({
      title: "Initialize Ekadhika Divisor",
      desc: `Denominator is ${denom}. Previous digit is ${a}. One more than previous is ${a} + 1 = ${divisor}.`,
      math: `\\text{Divisor} = ${divisor}`
    });

    for (let i = 0; i < maxDigits; i++) {
      const q = Math.floor(curNum / divisor);
      const r = curNum % divisor;
      digits.push(q);

      steps.push({
        title: `Division Step ${i + 1}`,
        desc: `Divide ${curNum} by ${divisor}: Quotient = ${q}, Remainder = ${r}. Prefix ${r} to next place to form ${r}${q} (or ${r * 10 + q}).`,
        math: `${curNum} \\div ${divisor} = ${q} \\text{ (R: } ${r}\\text{)}`
      });

      curNum = r * 10 + q;
      if (i > 1 && r === 1 && q === 0 && (i % 2 === 1 || i >= 17)) break;
    }

    const decimalStr = "0." + digits.join("");
    return {
      type: "recurring_decimal",
      sutraName: "Ekādhikena Pūrveṇa",
      denom,
      a,
      divisor,
      method: "division",
      digits: digits.join(""),
      result: decimalStr,
      steps,
      proof: `Algebraic Proof:\\n1/(a9) = 1/((a+1)x - 1) where x = 10\\n= 1/((a+1)x) · [1 - 1/((a+1)x)]⁻¹\\n= 10⁻¹(1/(a+1)) + 10⁻²(1/(a+1)²) + 10⁻³(1/(a+1)³) + ...\\nSuccessive division by ${divisor} generates the exact recurring expansion.`
    };
  },

  // 2. Nikhilam Navatascaramam Dasatah: Base Multiplication
  nikhilamMultiply(n1, n2, customBase = null) {
    n1 = parseInt(n1);
    n2 = parseInt(n2);
    if (isNaN(n1) || isNaN(n2)) throw new Error("Please enter valid integers.");

    const maxVal = Math.max(Math.abs(n1), Math.abs(n2));
    let base = customBase || Math.pow(10, Math.ceil(Math.log10(maxVal <= 10 ? 10 : maxVal)));
    if (base < 10) base = 10;

    const numZeros = Math.round(Math.log10(base));
    const d1 = n1 - base;
    const d2 = n2 - base;

    const lhs = n1 + d2;
    const rhsProd = d1 * d2;
    const expectedProduct = n1 * n2;

    const steps = [
      {
        title: "Identify Reference Power-of-10 Base",
        desc: `For ${n1} and ${n2}, the nearest base is ${base} (${numZeros} zero${numZeros > 1 ? 's' : ''}).`,
        math: `\\text{Base } B = 10^{${numZeros}} = ${base}`
      },
      {
        title: "Calculate Deviations from Base",
        desc: `Deviation 1: ${n1} - ${base} = ${d1 >= 0 ? '+' + d1 : d1}\\nDeviation 2: ${n2} - ${base} = ${d2 >= 0 ? '+' + d2 : d2}`,
        math: `D_1 = ${d1 >= 0 ? '+' + d1 : d1}, \\quad D_2 = ${d2 >= 0 ? '+' + d2 : d2}`
      },
      {
        title: "Determine Left-Hand Side (L.H.S)",
        desc: `Cross-add / cross-subtract deviation: ${n1} + (${d2}) = ${lhs} (or ${n2} + (${d1}) = ${lhs}).`,
        math: `\\text{L.H.S} = N_1 + D_2 = ${n1} + (${d2}) = ${lhs}`
      },
      {
        title: "Determine Right-Hand Side (R.H.S)",
        desc: `Multiply deviations: (${d1}) × (${d2}) = ${rhsProd}. R.H.S must contain exactly ${numZeros} digit(s).`,
        math: `\\text{R.H.S} = D_1 \\times D_2 = (${d1}) \\times (${d2}) = ${rhsProd}`
      }
    ];

    let finalLhs = lhs;
    let finalRhsStr = "";
    if (rhsProd >= 0) {
      const rhsStr = String(rhsProd);
      if (rhsStr.length < numZeros) {
        finalRhsStr = rhsStr.padStart(numZeros, "0");
        steps.push({
          title: "Adjust R.H.S Digit Count",
          desc: `Pad with leading zeros to match base zeros: ${finalRhsStr}.`,
          math: `\\text{R.H.S (padded)} = ${finalRhsStr}`
        });
      } else if (rhsStr.length > numZeros) {
        const carry = parseInt(rhsStr.slice(0, rhsStr.length - numZeros));
        const remRhs = rhsStr.slice(rhsStr.length - numZeros);
        finalLhs += carry;
        finalRhsStr = remRhs;
        steps.push({
          title: "Carry Over Excess Digits",
          desc: `Carry ${carry} to L.H.S: ${lhs} + ${carry} = ${finalLhs}.`,
          math: `\\text{New L.H.S} = ${finalLhs}, \\quad \\text{R.H.S} = ${finalRhsStr}`
        });
      } else {
        finalRhsStr = rhsStr;
      }
    } else {
      const absRhs = Math.abs(rhsProd);
      const borrow = Math.ceil(absRhs / base);
      finalLhs -= borrow;
      const compRhs = borrow * base - absRhs;
      finalRhsStr = String(compRhs).padStart(numZeros, "0");
      steps.push({
        title: "Vinculum / Negative Normalization",
        desc: `Since product of deviations is negative (${rhsProd}), borrow ${borrow} from L.H.S: ${finalLhs + borrow} - ${borrow} = ${finalLhs}, and complement R.H.S = ${compRhs}.`,
        math: `\\text{Normalized} = (${lhs} - ${borrow}) \\times ${base} + (${borrow * base} - ${absRhs}) = ${expectedProduct}`
      });
    }

    steps.push({
      title: "Final Product",
      desc: `Result is ${expectedProduct}.`,
      math: `${n1} \\times ${n2} = ${expectedProduct}`
    });

    const proof = `Algebraic Proof:\\n` +
      `Let N₁ = x + a and N₂ = x + b, where x is base.\\n` +
      `N₁ · N₂ = (x + a)(x + b) = x² + ax + bx + ab\\n` +
      `         = x(x + a + b) + ab\\n` +
      `         = x(N₁ + b) + ab = x(N₂ + a) + ab.`;

    return {
      type: "nikhilam_multiplication",
      sutraName: "Nikhilam Navataścaramaṁ Daśataḥ",
      n1, n2, base, d1, d2, lhs, rhsProd,
      finalLhs, finalRhsStr,
      result: expectedProduct,
      steps,
      proof,
      vedicCheck: VedicEngine.beejankCheckMult(n1, n2, expectedProduct)
    };
  },

  // 2b. Nikhilam Division
  nikhilamDivision(dividend, divisor) {
    dividend = parseInt(dividend);
    divisor = parseInt(divisor);
    if (isNaN(dividend) || isNaN(divisor) || divisor <= 0) {
      throw new Error("Valid positive dividend and divisor required.");
    }
    const numDigits = String(divisor).length;
    let base = Math.pow(10, numDigits);
    if (divisor > base) base = Math.pow(10, numDigits + 1);

    const complement = base - divisor;
    const divStr = String(dividend);
    const remLength = String(base).length - 1;

    const actualQ = Math.floor(dividend / divisor);
    const actualR = dividend % divisor;

    const qPart = divStr.length > remLength ? divStr.slice(0, divStr.length - remLength) : "0";
    const rPart = divStr.length > remLength ? divStr.slice(divStr.length - remLength) : divStr;

    const steps = [
      {
        title: "Identify Base and Modified Divisor (M.D.)",
        desc: `Divisor is ${divisor}. Nearest upper base is ${base}. Modified Divisor (complement) = ${base} - ${divisor} = ${complement}.`,
        math: `\\text{Base } B = ${base}, \\quad \\text{Complement (M.D.)} = ${complement}`
      },
      {
        title: "Bifurcate Dividend",
        desc: `Split dividend ${dividend} so remainder column has ${remLength} digits: Quotient part = ${qPart}, Remainder part = ${rPart}.`,
        math: `\\text{Quotient Column: } ${qPart} \\quad | \\quad \\text{Remainder Column: } ${rPart}`
      },
      {
        title: "Vedic Column Accumulation",
        desc: `Multiply brought-down quotient digits by M.D. (${complement}) and distribute rightwards to obtain Quotient = ${actualQ} and Remainder = ${actualR}.`,
        math: `\\text{Quotient } Q = ${actualQ}, \\quad \\text{Remainder } R = ${actualR}`
      }
    ];

    return {
      type: "nikhilam_division",
      sutraName: "Nikhilam Navataścaramaṁ Daśataḥ",
      dividend, divisor, base, complement,
      qPart, rPart,
      result: `Q = ${actualQ}, R = ${actualR}`,
      quotient: actualQ,
      remainder: actualR,
      steps,
      proof: `Algebraic Proof:\\nDividend N = Q · Divisor + R = Q · (Base - C) + R\\nN = Q · Base - Q · C + R\\nAdding Q · C systematically shifts the deficit into the remainder columns without formal long division!`,
      vedicCheck: VedicEngine.beejankCheckDiv(dividend, divisor, actualQ, actualR)
    };
  },

  // 3. Urdhva - Tiryagbhyam: Universal Vertically and Crosswise Multiplication
  urdhvaTiryagbhyam(n1, n2) {
    n1 = Math.abs(parseInt(n1));
    n2 = Math.abs(parseInt(n2));
    if (isNaN(n1) || isNaN(n2)) throw new Error("Please enter valid integers.");

    const s1 = String(n1);
    const s2 = String(n2);
    const maxLen = Math.max(s1.length, s2.length);
    const p1 = s1.padStart(maxLen, "0").split("").map(Number);
    const p2 = s2.padStart(maxLen, "0").split("").map(Number);

    const numColumns = 2 * maxLen - 1;
    const stepCrossProducts = [];
    const stepSubTotals = [];
    const steps = [];

    steps.push({
      title: "Align Numbers Vertically",
      desc: `Padded inputs to uniform length ${maxLen}:\\nMultiplicand: [${p1.join(", ")}]\\nMultiplier:   [${p2.join(", ")}]`,
      math: `\\begin{matrix} ${p1.join(" & ")} \\\\ ${p2.join(" & ")} \\end{matrix}`
    });

    // Step k from 0 to 2*maxLen - 2 (where k=0 is units place, k=1 is tens place, etc.)
    // Condition: i + j = 2 * maxLen - 2 - k
    for (let k = 0; k < numColumns; k++) {
      const targetSum = 2 * maxLen - 2 - k;
      let pairs = [];
      let sum = 0;
      for (let i = 0; i < maxLen; i++) {
        let j = targetSum - i;
        if (j >= 0 && j < maxLen) {
          const prod = p1[i] * p2[j];
          sum += prod;
          pairs.push({ i, j, d1: p1[i], d2: p2[j], prod });
        }
      }
      stepCrossProducts.push(pairs);
      stepSubTotals.push(sum);

      const formulaStr = pairs.map(p => `(${p.d1} \\times ${p.d2})`).join(" + ");
      steps.push({
        title: `Criss-Cross Step ${k + 1} of ${numColumns} (10^${k} Column)`,
        desc: `Multiply cross-pairs: ${pairs.map(p => `${p.d1}×${p.d2}`).join(" + ")} = ${sum}.`,
        math: `\\sum = ${formulaStr || "0"} = ${sum}`,
        pairs
      });
    }

    // Accumulate carries from right to left
    let carries = 0;
    const finalDigits = [];
    for (let k = 0; k < stepSubTotals.length; k++) {
      let total = stepSubTotals[k] + carries;
      let digit = total % 10;
      carries = Math.floor(total / 10);
      finalDigits.unshift(digit);
    }
    if (carries > 0) {
      finalDigits.unshift(carries);
    }

    const calculatedResult = parseInt(finalDigits.join(""));
    steps.push({
      title: "Final Product with Carries",
      desc: `Accumulate all cross sums and resolve carries: ${calculatedResult}.`,
      math: `${n1} \\times ${n2} = ${calculatedResult}`
    });

    const proof = `Algebraic Proof for (ax² + bx + c)(dx² + ex + f):\\n` +
      `Product = ad·x⁴ + (ae + bd)x³ + (af + be + cd)x² + (bf + ce)x + cf.\\n` +
      `Each term matches the exact Vedic cross-product sums without writing multi-line scratch work!`;

    return {
      type: "urdhva_tiryagbhyam",
      sutraName: "Ūrdhva-Tiryagbhyām",
      n1, n2, maxLen, p1, p2,
      numColumns,
      stepCrossProducts,
      stepSubTotals,
      result: calculatedResult,
      steps,
      proof,
      vedicCheck: VedicEngine.beejankCheckMult(n1, n2, calculatedResult)
    };
  },

  // 4. Paravartya Yojayet: Transpose and Apply for Division
  paravartyaDivision(dividend, divisor) {
    dividend = parseInt(dividend);
    divisor = parseInt(divisor);
    if (isNaN(dividend) || isNaN(divisor) || divisor <= 0) {
      throw new Error("Valid positive dividend and divisor required.");
    }
    const divStr = String(divisor);
    const firstDigit = parseInt(divStr[0]);
    const remDigits = divStr.slice(1).split("").map(Number);
    const transDigits = remDigits.map(d => -d);

    const q = Math.floor(dividend / divisor);
    const r = dividend % divisor;

    const steps = [
      {
        title: "Step 1: Transpose Divisor Digits",
        desc: `Divisor is ${divisor}. Keep first digit ${firstDigit}, transpose subsequent digits with negative signs: [${transDigits.join(", ")}].`,
        math: `\\text{Original: } ${divisor} \\implies \\text{Transposed: } ${firstDigit} \\text{ with } [${transDigits.join(", ")}]`
      },
      {
        title: "Step 2: Partition Dividend for Remainder",
        desc: `Set apart the last ${transDigits.length} digit(s) of dividend ${dividend} for the remainder column.`,
        math: `\\text{Remainder width} = ${transDigits.length}`
      },
      {
        title: "Step 3: Transpose and Add Iterations",
        desc: `Multiply quotient digits by transposed digits and add systematically to get Quotient = ${q} and Remainder = ${r}.`,
        math: `\\text{Quotient } Q = ${q}, \\quad \\text{Remainder } R = ${r}`
      }
    ];

    return {
      type: "paravartya_division",
      sutraName: "Parāvartya Yojayet",
      dividend, divisor,
      result: `Q = ${q}, R = ${r}`,
      quotient: q,
      remainder: r,
      steps,
      proof: `Paravartya Yojayet replaces tedious long division with sign reversal and horizontal accumulation, mirroring Horner's Synthetic Division!`,
      vedicCheck: VedicEngine.beejankCheckDiv(dividend, divisor, q, r)
    };
  },

  // 4b. Paravartya in Linear Equations: ax + b = cx + d
  paravartyaLinear(a, b, c, d) {
    a = Number(a); b = Number(b); c = Number(c); d = Number(d);
    if (a === c) throw new Error("Coefficient of x on both sides cannot be equal (no unique solution).");
    const x = (d - b) / (a - c);
    return {
      type: "paravartya_linear",
      sutraName: "Parāvartya Yojayet",
      a, b, c, d,
      result: `x = ${x}`,
      steps: [
        {
          title: "Identify Equation Form",
          desc: `Given: ${a}x + (${b}) = ${c}x + (${d})`,
          math: `${a}x + ${b} = ${c}x + ${d}`
        },
        {
          title: "Apply Paravartya ('Transpose and Apply')",
          desc: `Transpose b to RHS and cx to LHS with sign reversal: x = (d - b) / (a - c).`,
          math: `x = \\frac{d - b}{a - c} = \\frac{${d} - (${b})}{${a} - ${c}} = \\frac{${d - b}}{${a - c}}`
        },
        {
          title: "Final Result",
          desc: `x = ${x}`,
          math: `x = ${x}`
        }
      ],
      proof: `ax + b = cx + d \\implies ax - cx = d - b \\implies x(a - c) = d - b \\implies x = (d - b)/(a - c).`
    };
  },

  // 5. Sunyam Samya Samuccaye: When the Collection is the Same, it is Zero
  sunyamSamyaSamuccaye(mode, params) {
    const steps = [];
    let result = 0;

    if (mode === "cubes_linear") {
      const { a, b, c } = params;
      result = c;
      steps.push({
        title: "Examine Cubes Structure",
        desc: `Equation: (x - ${a})³ + (x - ${b})³ = 2(x - ${c})³. Note (x - ${a}) + (x - ${b}) = 2x - (${a + b}) = 2(x - ${c}).`,
        math: `(x - ${a}) + (x - ${b}) = 2(x - ${c})`
      });
      steps.push({
        title: "Apply Sunyam Samya Samuccaye",
        desc: `Since the sum of base terms on LHS equals twice the RHS base term, equate the factor under the cube to zero!`,
        math: `x - ${c} = 0 \\implies x = ${c}`
      });
    }

    return {
      type: "sunyam_samya_samuccaye",
      sutraName: "Śūnyaṁ Sāmyasamuccaye",
      mode,
      params,
      resultVal: result,
      result: `x = ${result}`,
      steps,
      proof: `Consider (x - 2a)³ + (x - 2b)³ = 2(x - a - b)³.\\nExpanding and cancelling terms gives: x(a - b)² = (a + b)(a - b)² ⟹ x = a + b.\\nThe Vedic insight solves cubic equations in 1 line without expansion!`
    };
  },

  // 6. Anurupye - Sunyamanyat: If One is in Ratio, the Other is Zero
  anurupyeSunyamanyat(a1, b1, c1, a2, b2, c2) {
    a1 = Number(a1); b1 = Number(b1); c1 = Number(c1);
    a2 = Number(a2); b2 = Number(b2); c2 = Number(c2);

    const ratioY = (b1 / b2).toFixed(4);
    const ratioC = (c1 / c2).toFixed(4);
    const ratioX = (a1 / a2).toFixed(4);

    let steps = [];
    let sol = { x: 0, y: 0 };

    steps.push({
      title: "Analyze Simultaneous Equations",
      desc: `(1) ${a1}x + ${b1}y = ${c1}\\n(2) ${a2}x + ${b2}y = ${c2}`,
      math: `\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x + ${b2}y = ${c2} \\end{cases}`
    });

    if (ratioY === ratioC) {
      sol.x = 0;
      sol.y = c1 / b1;
      steps.push({
        title: "Ratio Match: y-coefficients and Constants",
        desc: `Ratio ${b1}:${b2} matches ${c1}:${c2}.`,
        math: `\\frac{b_1}{b_2} = \\frac{c_1}{c_2}`
      });
      steps.push({
        title: "Other Variable is Zero",
        desc: `By Anurupye Sunyamanyat, x = 0, and ${b1}y = ${c1} ⟹ y = ${sol.y}.`,
        math: `x = 0, \\quad y = ${sol.y}`
      });
    } else if (ratioX === ratioC) {
      sol.y = 0;
      sol.x = c1 / a1;
      steps.push({
        title: "Ratio Match: x-coefficients and Constants",
        desc: `Ratio ${a1}:${a2} matches ${c1}:${c2}.`,
        math: `\\frac{a_1}{a_2} = \\frac{c_1}{c_2}`
      });
      steps.push({
        title: "Other Variable is Zero",
        desc: `By Anurupye Sunyamanyat, y = 0, and ${a1}x = ${c1} ⟹ x = ${sol.x}.`,
        math: `y = 0, \\quad x = ${sol.x}`
      });
    }

    return {
      type: "anurupye_sunyamanyat",
      sutraName: "Ānurūpye Śūnyamanyat",
      a1, b1, c1, a2, b2, c2,
      sol,
      result: `x = ${sol.x}, y = ${sol.y}`,
      steps,
      proof: `When b₁/b₂ = c₁/c₂ = k, we have b₁ = k·b₂ and c₁ = k·c₂.\\nMultiplying Eq 2 by k: k·a₂·x + k·b₂·y = k·c₂ ⟹ k·a₂·x + b₁·y = c₁.\\nSubtracting from Eq 1: (a₁ - k·a₂)·x = 0 ⟹ x = 0!`
    };
  },

  // 7. Sankalana - Vyavakalanabhyam: By Addition and Subtraction
  sankalanaVyavakalan(a1, b1, c1, a2, b2, c2) {
    a1 = Number(a1); b1 = Number(b1); c1 = Number(c1);
    a2 = Number(a2); b2 = Number(b2); c2 = Number(c2);
    const steps = [];

    steps.push({
      title: "Identify Interchanged Coefficients",
      desc: `(1) ${a1}x + (${b1})y = ${c1}\\n(2) ${a2}x + (${b2})y = ${c2}`,
      math: `\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x + ${b2}y = ${c2} \\end{cases}`
    });

    // Add: Sankalana
    const addX = a1 + a2;
    const addY = b1 + b2;
    const addC = c1 + c2;
    const plusCoeff = Math.abs(addX);
    const plusSign = (addX * addY >= 0) ? 1 : -1;
    const plusVal = addC / plusCoeff;

    steps.push({
      title: "Step 1: Saṅkalana (Add Equations)",
      desc: `Add (1) and (2): (${a1} + ${a2})x + (${b1} + ${b2})y = ${c1} + ${c2}\\n${addX}x + (${addY})y = ${addC}`,
      math: `${addX}x + (${addY})y = ${addC}`
    });

    // Subtract: Vyavakalana
    const subX = a1 - a2;
    const subY = b1 - b2;
    const subC = c1 - c2;

    steps.push({
      title: "Step 2: Vyavakalana (Subtract Equations)",
      desc: `Subtract (2) from (1): (${a1} - ${a2})x + (${b1} - ${b2})y = ${c1} - ${c2}\\n${subX}x + (${subY})y = ${subC}`,
      math: `${subX}x + (${subY})y = ${subC}`
    });

    // Standard linear solver for the reduced 2x2
    const det = addX * subY - subX * addY;
    const finalX = (addC * subY - subC * addY) / det;
    const finalY = (addX * subC - subX * addC) / det;

    steps.push({
      title: "Step 3: Solve Reduced Equations",
      desc: `Instant mental addition & subtraction gives: x = ${finalX}, y = ${finalY}.`,
      math: `x = ${finalX}, \\quad y = ${finalY}`
    });

    return {
      type: "sankalana_vyavakalan",
      sutraName: "Saṅkalana-Vyavakalana",
      a1, b1, c1, a2, b2, c2,
      addX, addY, addC,
      subX, subY, subC,
      finalX, finalY,
      result: `x = ${finalX}, y = ${finalY}`,
      steps,
      proof: `Instead of multiplying huge coefficients (e.g. 1955 and 476), adding and subtracting once instantly reduces equations to x + y = A and x - y = B!`
    };
  },

  // 10. Ekanyunena Purvena: Multiplication by 9, 99, 999...
  ekanyunenaPurvena(multiplicand, multiplier9s) {
    multiplicand = parseInt(multiplicand);
    if (isNaN(multiplicand)) throw new Error("Invalid multiplicand");
    const multStr = String(multiplier9s);
    if (!/^9+$/.test(multStr)) {
      throw new Error("Multiplier must consist solely of 9's (e.g., 9, 99, 999, 9999).");
    }

    const mLen = String(multiplicand).length;
    const nLen = multStr.length;
    const steps = [];
    let result = 0;

    if (mLen === nLen) {
      const lhs = multiplicand - 1;
      const rhs = Number(multStr) - lhs;
      result = lhs * Math.pow(10, nLen) + rhs;

      steps.push({
        title: "Step 1: Ekanyunena (One Less on L.H.S)",
        desc: `Subtract 1 from multiplicand: ${multiplicand} - 1 = ${lhs}.`,
        math: `\\text{L.H.S} = ${multiplicand} - 1 = ${lhs}`
      });
      steps.push({
        title: "Step 2: Nikhilam Complement on R.H.S",
        desc: `Subtract L.H.S from 99...9: ${multStr} - ${lhs} = ${rhs}.`,
        math: `\\text{R.H.S} = ${multStr} - ${lhs} = ${rhs}`
      });
      steps.push({
        title: "Combine Halves",
        desc: `Result = ${result}.`,
        math: `${multiplicand} \\times ${multStr} = ${result}`
      });
    } else if (mLen < nLen) {
      const paddedStr = String(multiplicand).padStart(nLen, "0");
      const lhs = parseInt(paddedStr) - 1;
      const lhsStr = String(lhs).padStart(nLen, "0");
      const rhs = Number(multStr) - lhs;
      const rhsStr = String(rhs).padStart(nLen, "0");
      result = multiplicand * Number(multStr);

      steps.push({
        title: "Step 1: Pad with Zeros & One Less",
        desc: `Pad ${multiplicand} to length ${nLen}: ${paddedStr}. One less = ${lhsStr}.`,
        math: `\\text{L.H.S} = ${lhsStr}`
      });
      steps.push({
        title: "Step 2: 9's Complement",
        desc: `Complements from 9: ${multStr} - ${lhsStr} = ${rhsStr}.`,
        math: `\\text{R.H.S} = ${rhsStr}`
      });
      steps.push({
        title: "Final Product",
        desc: `Result = ${result}.`,
        math: `${multiplicand} \\times ${multStr} = ${result}`
      });
    } else {
      const excessPortion = parseInt(String(multiplicand).slice(0, mLen - nLen));
      const rhsPortion = parseInt(String(multiplicand).slice(mLen - nLen));
      const subtractor = excessPortion + 1;
      const lhs = multiplicand - subtractor;
      const baseR = Math.pow(10, nLen);
      const rhsComp = baseR - rhsPortion;
      result = multiplicand * Number(multStr);

      steps.push({
        title: "Multiplicand Has More Digits Than 9s",
        desc: `Partition multiplicand into Left (${excessPortion}) and Right (${rhsPortion}).`,
        math: `${excessPortion} : ${rhsPortion}`
      });
      steps.push({
        title: "Subtract Excess + 1",
        desc: `Subtract one more than excess (${excessPortion} + 1 = ${subtractor}): ${multiplicand} - ${subtractor} = ${lhs}.`,
        math: `\\text{L.H.S} = ${multiplicand} - ${subtractor} = ${lhs}`
      });
      steps.push({
        title: "Complement of Right Portion",
        desc: `Nikhilam complement of ${rhsPortion} = ${rhsComp}.`,
        math: `\\text{R.H.S} = ${baseR} - ${rhsPortion} = ${rhsComp}`
      });
      steps.push({
        title: "Final Product",
        desc: `Result = ${result}.`,
        math: `${multiplicand} \\times ${multStr} = ${result}`
      });
    }

    return {
      type: "ekanyunena_purvena",
      sutraName: "Ekanyūnena Pūrveṇa",
      multiplicand,
      multiplier: Number(multStr),
      result,
      steps,
      proof: `Algebraic Proof for (10x + y) × 99:\\n(10x + y)(100 - 1) = 100(10x + y - 1) + (100 - (10x + y)).\\nL.H.S is decreased by 1, and R.H.S is the 100's complement!`,
      vedicCheck: VedicEngine.beejankCheckMult(multiplicand, Number(multStr), result)
    };
  },

  // 11. Anurupyena: Proportionality Multiplication with Working Bases
  anurupyenaMultiply(n1, n2, workingBase = 50, multipleOf10 = 10) {
    n1 = parseInt(n1);
    n2 = parseInt(n2);
    workingBase = parseInt(workingBase);
    const d1 = n1 - workingBase;
    const d2 = n2 - workingBase;

    const crossSum = n1 + d2;
    const multRatio = workingBase / multipleOf10;
    const adjustedLhs = crossSum * multRatio;
    const rhsProd = d1 * d2;
    const expected = n1 * n2;

    const steps = [
      {
        title: "Establish Working Base",
        desc: `Numbers ${n1} and ${n2} are near base ${workingBase} = ${multRatio} × ${multipleOf10}.`,
        math: `W = ${multRatio} \\times ${multipleOf10}`
      },
      {
        title: "Calculate Deviations",
        desc: `D₁ = ${n1} - ${workingBase} = ${d1}, \\quad D₂ = ${n2} - ${workingBase} = ${d2}`,
        math: `D_1 = ${d1}, \\quad D_2 = ${d2}`
      },
      {
        title: "Cross Addition & Proportion Scaling",
        desc: `Cross sum = ${n1} + (${d2}) = ${crossSum}. Multiply by ratio (${multRatio}): ${crossSum} × ${multRatio} = ${adjustedLhs}.`,
        math: `\\text{Scaled L.H.S} = (${crossSum}) \\times ${multRatio} = ${adjustedLhs}`
      },
      {
        title: "Product of Deviations & Result",
        desc: `D₁ × D₂ = (${d1}) × (${d2}) = ${rhsProd}. Final answer = ${expected}.`,
        math: `\\text{Result} = ${expected}`
      }
    ];

    return {
      type: "anurupyena_multiplication",
      sutraName: "Ānurūpyeṇa",
      n1, n2, workingBase, multipleOf10,
      result: expected,
      steps,
      proof: `When numbers are far from 100 (e.g. 46 and 43), using base 100 gives cumbersome deviations (-54, -57). Anurupyena scales the base to 50 = 100/2 or 5x10, reducing deviations to single digits (-4, -7)!`,
      vedicCheck: VedicEngine.beejankCheckMult(n1, n2, expected)
    };
  },

  // 12. Adyamadyenantyamantyena: Rectangular Area (Feet & Inches)
  areaFeetInches(lFt, lIn, bFt, bIn) {
    lFt = Number(lFt); lIn = Number(lIn);
    bFt = Number(bFt); bIn = Number(bIn);

    const firstByFirst = lFt * bFt;
    const crossWise = lFt * bIn + bFt * lIn;
    const lastByLast = lIn * bIn;

    const sqFtFromCross = Math.floor((crossWise * 12 + lastByLast) / 144);
    const remSqIn = (crossWise * 12 + lastByLast) % 144;
    const totalSqFt = firstByFirst + sqFtFromCross;

    const steps = [
      {
        title: "First by First (Feet × Feet)",
        desc: `${lFt}' × ${bFt}' = ${firstByFirst} sq. ft.`,
        math: `\\text{First} = ${lFt} \\times ${bFt} = ${firstByFirst} \\text{ sq. ft}`
      },
      {
        title: "Last by Last (Inches × Inches)",
        desc: `${lIn}" × ${bIn}" = ${lastByLast} sq. in.`,
        math: `\\text{Last} = ${lIn} \\times ${bIn} = ${lastByLast} \\text{ sq. in}`
      },
      {
        title: "Crosswise Product",
        desc: `(${lFt} × ${bIn}) + (${bFt} × ${lIn}) = ${crossWise}.`,
        math: `\\text{Cross} = ${crossWise}`
      },
      {
        title: "Adjust Units to Base 144",
        desc: `Total: ${totalSqFt} sq. ft. ${remSqIn} sq. inches.`,
        math: `\\text{Total} = ${totalSqFt} \\text{ sq. ft. } ${remSqIn} \\text{ sq. in}`
      }
    ];

    return {
      type: "area_feet_inches",
      sutraName: "Ādyamādyenāntyamantyena",
      lFt, lIn, bFt, bIn,
      firstByFirst, crossWise, lastByLast,
      totalSqFt, remSqIn,
      result: `${totalSqFt} sq. ft. ${remSqIn} sq. in.`,
      steps,
      proof: `Carpenters multiply mixed feet and inches directly without converting everything to inches and dividing by 144!`
    };
  },

  // 12b. Adyamadyenantyamantyena: Quadratic Factorization
  factorizeQuadratic(a, b, c) {
    a = Number(a); b = Number(b); c = Number(c);
    const disc = b * b - 4 * a * c;
    if (disc < 0) throw new Error("Quadratic has complex roots.");
    const sqrtDisc = Math.round(Math.sqrt(disc));
    if (sqrtDisc * sqrtDisc !== disc) throw new Error("Discriminant is not a perfect square.");

    const ac = a * c;
    let p = 0, q = 0, found = false;
    for (let i = -Math.abs(ac); i <= Math.abs(ac); i++) {
      if (i !== 0 && ac % i === 0) {
        let j = ac / i;
        if (i + j === b) {
          p = i; q = j;
          found = true;
          break;
        }
      }
    }
    if (!found) { p = (-b + sqrtDisc) / 2; q = (-b - sqrtDisc) / 2; }

    const gcd1 = VedicEngine.gcd(a, p);
    const f1_x = a / gcd1;
    const f1_c = p / gcd1;

    const f2_x = a / f1_x;
    const f2_c = c / f1_c;

    const steps = [
      {
        title: "Split Middle Term (Anurupyena Ratio)",
        desc: `Split ${b} into ${p} and ${q} such that ${a}:${p} = ${q}:${c} = ${f1_x}:${f1_c}.`,
        math: `${a} : ${p} = ${q} : ${c} = ${f1_x} : ${f1_c}`
      },
      {
        title: "First Factor Revealed",
        desc: `First factor: (${f1_x}x + ${f1_c}).`,
        math: `\\text{Factor 1} = (${f1_x}x + ${f1_c})`
      },
      {
        title: "Second Factor by Adyamadyena",
        desc: `Divide first by first (${a} ÷ ${f1_x} = ${f2_x}) and last by last (${c} ÷ ${f1_c} = ${f2_c}): (${f2_x}x + ${f2_c}).`,
        math: `\\text{Factor 2} = (${f2_x}x + ${f2_c})`
      }
    ];

    return {
      type: "factorize_quadratic",
      sutraName: "Ādyamādyenāntyamantyena",
      a, b, c,
      f1_x, f1_c, f2_x, f2_c,
      result: `(${f1_x}x + ${f1_c})(${f2_x}x + ${f2_c})`,
      steps,
      proof: `Adyamadyenantyamantyena eliminates trial-and-error by taking the ratio of first to split part and obtaining the remaining factor by direct vertical division!`
    };
  },

  // 13. Yavadunam Tavadunikrtya Varganca Yojayet: Squaring
  yavadunamSquare(num, customBase = null) {
    const n = Math.abs(parseInt(num));
    if (isNaN(n)) throw new Error("Invalid number");

    let base = customBase || Math.pow(10, Math.round(Math.log10(n)));
    if (base < 10) base = 10;
    const numZeros = Math.round(Math.log10(base));
    const deficit = base - n;

    const lhs = n - deficit;
    const rhs = deficit * deficit;
    const result = n * n;

    const isDeficit = deficit > 0;
    const steps = [
      {
        title: "Identify Base and Difference",
        desc: `Number is ${n}. Reference base is ${base}. ${isDeficit ? "Deficit" : "Surplus"} = ${Math.abs(deficit)}.`,
        math: `\\text{Base } = ${base}, \\quad \\Delta = ${Math.abs(deficit)}`
      },
      {
        title: "Adjust Number (Yavadunam)",
        desc: `${isDeficit ? `Subtract deficit: ${n} - ${deficit} = ${lhs}` : `Add surplus: ${n} + ${Math.abs(deficit)} = ${lhs}`}.`,
        math: `\\text{L.H.S} = ${lhs}`
      },
      {
        title: "Square Difference (Varganca Yojayet)",
        desc: `(${Math.abs(deficit)})² = ${rhs}. Combine to get ${result}.`,
        math: `\\text{R.H.S} = ${rhs} \\implies ${n}^2 = ${result}`
      }
    ];

    return {
      type: "yavadunam_square",
      sutraName: "Yāvadūnaṁ Tāvadūnīkṛtya Vargañca Yojayet",
      n,
      base,
      deficit,
      isDeficit,
      lhs,
      rhs,
      result,
      steps,
      proof: `Algebraic Proof:\n(x ± y)² = x² ± 2xy + y² = x(x ± 2y) + y² = Base · (Number ± Difference) + (Difference)².`,
      vedicCheck: VedicEngine.beejankCheckSquare(n, result)
    };
  },

  // 14. Antyayor Dasakepi: When Last Digits Sum to 10
  antyayorDasakepi(n1, n2) {
    n1 = parseInt(n1); n2 = parseInt(n2);
    if (isNaN(n1) || isNaN(n2)) throw new Error("Invalid input numbers");

    const s1 = String(n1);
    const s2 = String(n2);
    const p1 = s1.slice(0, -1);
    const p2 = s2.slice(0, -1);
    const u1 = parseInt(s1.slice(-1));
    const u2 = parseInt(s2.slice(-1));

    let prefix = parseInt(p1);
    let lhs = prefix * (prefix + 1);
    let rhs = u1 * u2;
    let result = n1 * n2;

    const steps = [
      {
        title: "Condition Verification",
        desc: `Prefixes match (${prefix}), and unit digits sum to 10 (${u1} + ${u2} = 10).`,
        math: `\\text{Prefix} = ${prefix}, \\quad ${u1} + ${u2} = 10`
      },
      {
        title: "Apply Ekadhikena on Prefix",
        desc: `${prefix} × (${prefix} + 1) = ${lhs}.`,
        math: `\\text{L.H.S} = ${prefix} \\times ${prefix + 1} = ${lhs}`
      },
      {
        title: "Multiply Unit Digits",
        desc: `${u1} × ${u2} = ${rhs}. Result = ${result}.`,
        math: `\\text{R.H.S} = ${u1} \\times ${u2} = ${rhs} \\implies ${result}`
      }
    ];

    return {
      type: "antyayor_dasakepi",
      sutraName: "Antyayordaśake'pi",
      n1,
      n2,
      prefix,
      u1,
      u2,
      lhs,
      rhs,
      result,
      steps,
      proof: `(10P + a)(10P + b) = 100P² + 10P(a + b) + ab = 100P(P + 1) + ab when a + b = 10!`,
      vedicCheck: VedicEngine.beejankCheckMult(n1, n2, result)
    };
  },

  // 15. Antyayoreva: Only the Last Terms (Rational Equations)
  antyayoreva(a, b, c, d, e, f) {
    a = Number(a); b = Number(b); c = Number(c); d = Number(d); e = Number(e); f = Number(f);
    const num = b * f - d * e;
    const den = d - b;
    if (den === 0) throw new Error("Denominator evaluated to zero (d = b).");
    const x = num / den;

    const steps = [
      {
        title: "Recognize Antyayoreva Form",
        desc: `(x² + ${a}x + ${b}) / (x² + ${c}x + ${d}) = (x + ${e}) / (x + ${f}).`,
        math: `\\frac{x^2 + ${a}x + ${b}}{x^2 + ${c}x + ${d}} = \\frac{x + ${e}}{x + ${f}}`
      },
      {
        title: "Equate to Ratio of Last Independent Terms",
        desc: `By Antyayoreva: (x + ${e}) / (x + ${f}) = ${b} / ${d}.`,
        math: `\\frac{x + ${e}}{x + ${f}} = \\frac{${b}}{${d}}`
      },
      {
        title: "Solve for x",
        desc: `${d}(x + ${e}) = ${b}(x + ${f}) ⟹ (${den})x = ${num} ⟹ x = ${x}.`,
        math: `x = ${x}`
      }
    ];

    return {
      type: "antyayoreva",
      sutraName: "Antyayoreva",
      result: `x = ${x}`,
      steps,
      proof: `Let (AC + D)/(BC + E) = A/B where AC/BC = A/B.\\nCross-multiplication gives: B(AC + D) = A(BC + E) ⟹ BD = AE ⟹ A/B = D/E!`
    };
  },

  // 17. Vilokanam: By Mere Observation
  vilokanamSymmetric(p, q) {
    p = Number(p); q = Number(q);
    const sol1 = (p / q).toFixed(4).replace(/\.0000$/, "");
    const sol2 = (q / p).toFixed(4).replace(/\.0000$/, "");

    const steps = [
      {
        title: "Examine Symmetric Structure",
        desc: `x + 1/x = (${p * p + q * q}) / (${p * q}).`,
        math: `x + \\frac{1}{x} = \\frac{${p}^2 + ${q}^2}{${p} \\times ${q}}`
      },
      {
        title: "Split by Observation (Vilokanam)",
        desc: `Splits into ${p}/${q} + ${q}/${p}.`,
        math: `x + \\frac{1}{x} = \\frac{${p}}{${q}} + \\frac{${q}}{${p}}`
      },
      {
        title: "Direct Solution",
        desc: `x = ${p}/${q} (${sol1}) or x = ${q}/${p} (${sol2}).`,
        math: `x = \\frac{${p}}{${q}} \\quad \\text{or} \\quad \\frac{${q}}{${p}}`
      }
    ];

    return {
      type: "vilokanam_symmetric",
      sutraName: "Vilokanam",
      result: `x = ${p}/${q} or ${q}/${p}`,
      steps,
      proof: `Vilokanam perceives reciprocal symmetry immediately without tedious LCM cross-multiplication!`
    };
  },

  // Section III: Beejank
  calculateBeejank(num) {
    let n = Math.abs(parseInt(num));
    if (isNaN(n) || n === 0) return { num: 0, beejank: 0, breakdown: [] };
    const breakdown = [];
    let cur = n;
    while (cur >= 10) {
      const digits = String(cur).split("").map(Number);
      const nextSum = digits.reduce((a, b) => a + b, 0);
      breakdown.push({ num: cur, digits, sum: nextSum });
      cur = nextSum;
    }
    const finalBeejank = cur === 0 ? 9 : cur;
    return {
      num: n,
      beejank: finalBeejank,
      breakdown
    };
  },

  beejankCheckMult(a, b, prod) {
    const bA = VedicEngine.calculateBeejank(a).beejank;
    const bB = VedicEngine.calculateBeejank(b).beejank;
    const bProd = VedicEngine.calculateBeejank(prod).beejank;
    const expected = VedicEngine.calculateBeejank(bA * bB).beejank;
    return { bA, bB, bProd, expected, valid: bProd === expected };
  },

  beejankCheckDiv(dividend, divisor, q, r) {
    const bP = VedicEngine.calculateBeejank(dividend).beejank;
    const bD = VedicEngine.calculateBeejank(divisor).beejank;
    const bQ = VedicEngine.calculateBeejank(q).beejank;
    const bR = VedicEngine.calculateBeejank(r).beejank;
    const bQD = VedicEngine.calculateBeejank(bQ * bD).beejank;
    const expected = VedicEngine.calculateBeejank(bQD + bR).beejank;
    return { bP, bD, bQ, bR, expected, valid: bP === expected };
  },

  beejankCheckSquare(n, sq) {
    const bN = VedicEngine.calculateBeejank(n).beejank;
    const bSq = VedicEngine.calculateBeejank(sq).beejank;
    const expected = VedicEngine.calculateBeejank(bN * bN).beejank;
    return { bN, bSq, expected, valid: bSq === expected };
  },

  // Section III: Duplex Straight Squaring
  dwandwaSquare(num) {
    num = Math.abs(parseInt(num));
    if (isNaN(num)) throw new Error("Invalid number");
    const digits = String(num).split("").map(Number);
    const n = digits.length;

    function duplex(arr) {
      const len = arr.length;
      if (len === 1) return arr[0] * arr[0];
      let sum = 0;
      for (let i = 0; i < Math.floor(len / 2); i++) {
        sum += 2 * arr[i] * arr[len - 1 - i];
      }
      if (len % 2 === 1) {
        const mid = arr[Math.floor(len / 2)];
        sum += mid * mid;
      }
      return sum;
    }

    const duplexSteps = [];
    const subTotals = [];
    for (let i = 1; i <= n; i++) {
      const sub = digits.slice(0, i);
      const dVal = duplex(sub);
      subTotals.push(dVal);
      duplexSteps.push({ group: sub.join(""), dVal, desc: `D(${sub.join("")}) = ${dVal}` });
    }
    for (let i = 1; i < n; i++) {
      const sub = digits.slice(i);
      const dVal = duplex(sub);
      subTotals.push(dVal);
      duplexSteps.push({ group: sub.join(""), dVal, desc: `D(${sub.join("")}) = ${dVal}` });
    }

    let carries = 0;
    const finalDigits = [];
    for (let k = subTotals.length - 1; k >= 0; k--) {
      let tot = subTotals[k] + carries;
      finalDigits.unshift(tot % 10);
      carries = Math.floor(tot / 10);
    }
    if (carries > 0) finalDigits.unshift(carries);

    const result = parseInt(finalDigits.join(""));
    const steps = duplexSteps.map((ds, sIdx) => ({
      title: `Duplex Step ${sIdx + 1} of ${duplexSteps.length}: D(${ds.group})`,
      desc: `Calculate duplex of digit group ${ds.group}: ${ds.desc}.`,
      math: `D(${ds.group}) = ${ds.dVal}`
    }));
    steps.push({
      title: "Resolve Column Carries",
      desc: `Accumulate duplex values [${subTotals.join(", ")}] with right-to-left carry propagation: ${result}.`,
      math: `${num}^2 = ${result}`
    });

    return {
      type: "dwandwa_square",
      sutraName: "Dvandva-Yoga",
      num,
      digits,
      duplexSteps,
      subTotals,
      result,
      steps,
      proof: `(10a + b)² = 100a² + 20ab + b² = 100·D(a) + 10·D(ab) + D(b). Duplex provides universal single-line squaring!`,
      vedicCheck: VedicEngine.beejankCheckSquare(num, result)
    };
  },

  // Section III: Anurupyena Cubing
  anurupyenaCube(num) {
    num = Math.abs(parseInt(num));
    if (isNaN(num) || num < 10 || num > 99) {
      throw new Error("Anurupyena Cubing is designed for 2-digit numbers (10 to 99).");
    }
    const a = Math.floor(num / 10);
    const b = num % 10;

    const t1 = a * a * a;
    const t2 = a * a * b;
    const t3 = a * b * b;
    const t4 = b * b * b;
    const d2 = 2 * t2;
    const d3 = 2 * t3;

    const result = num * num * num;

    const steps = [
      {
        title: "Row 1: Four Terms in GP",
        desc: `Ratio ${a}:${b}. Terms [a³, a²b, ab², b³] = [${t1}, ${t2}, ${t3}, ${t4}].`,
        math: `[${t1}, ${t2}, ${t3}, ${t4}]`
      },
      {
        title: "Row 2: Double Middle Terms",
        desc: `Double middle terms: 2(a²b) = 2(${t2}) = ${d2}, 2(ab²) = 2(${t3}) = ${d3}.`,
        math: `[2a^2b, 2ab^2] = [${d2}, ${d3}]`
      },
      {
        title: "Column Sums & Carries",
        desc: `Accumulate columns with carries: ${result}.`,
        math: `${num}^3 = ${result}`
      }
    ];

    return {
      type: "anurupyena_cube",
      sutraName: "Ānurūpyeṇa Cubing",
      num,
      a,
      b,
      t1,
      t2,
      t3,
      t4,
      d2,
      d3,
      result,
      steps,
      proof: `(a + b)³ = a³ + 3a²b + 3ab² + b³!`
    };
  },

  // Coordinate Geometry: Straight Line
  straightLine2Points(x1, y1, x2, y2) {
    x1 = Number(x1); y1 = Number(y1);
    x2 = Number(x2); y2 = Number(y2);

    let aCoeff = y1 - y2;
    let bCoeff = -(x1 - x2);
    let cConst = aCoeff * x1 + bCoeff * y1;

    const g = VedicEngine.gcd(VedicEngine.gcd(Math.abs(aCoeff), Math.abs(bCoeff)), Math.abs(cConst));
    if (g > 1) {
      aCoeff /= g;
      bCoeff /= g;
      cConst /= g;
    }
    if (aCoeff < 0 || (aCoeff === 0 && bCoeff < 0)) {
      aCoeff = -aCoeff;
      bCoeff = -bCoeff;
      cConst = -cConst;
    }

    const eqStr = `${aCoeff}x ${bCoeff >= 0 ? '+ ' + bCoeff : '- ' + Math.abs(bCoeff)}y = ${cConst}`;

    const steps = [
      {
        title: "x-coefficient from y-coordinates",
        desc: `y₁ - y₂ = ${y1} - (${y2}) = ${y1 - y2}.`,
        math: `\\text{x-coeff} = ${y1 - y2}`
      },
      {
        title: "y-coefficient from x-coordinates",
        desc: `-(x₁ - x₂) = -(${x1} - ${x2}) = ${-(x1 - x2)}.`,
        math: `\\text{y-coeff} = ${-(x1 - x2)}`
      },
      {
        title: "Substitute Point for Constant",
        desc: `Equation is ${eqStr}.`,
        math: eqStr
      }
    ];

    return {
      type: "straight_line_2points",
      sutraName: "Parāvartya Yojayet (Geometry)",
      x1, y1, x2, y2,
      aCoeff, bCoeff, cConst,
      eqStr,
      result: eqStr,
      steps,
      proof: `(y - y₁) = [(y₂ - y₁)/(x₂ - x₁)](x - x₁) ⟹ (y₂ - y₁)x - (x₂ - x₁)y = Constant.`
    };
  },

  gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }
};

if (typeof window !== "undefined") window.VedicEngine = VedicEngine;
if (typeof global !== "undefined") global.VedicEngine = VedicEngine;
if (typeof module !== "undefined" && module.exports) module.exports = VedicEngine;
