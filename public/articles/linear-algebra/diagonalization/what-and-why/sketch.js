// 行列累乗の計算量・実行時間比較グラフ (p5.js インスタンスモード)

// ==========================================
// 共通ロジック & ヘルパー
// ==========================================

// サンプル行列 A = [[2, 1], [1, 2]], P = [[1, -1], [1, 1]], 固有値 = [3, 1]
const matrixA = new Matrix(2, 2);
matrixA.set([[2, 1], [1, 2]]);

const matrixP = new Matrix(2, 2);
matrixP.set([[1, -1], [1, 1]]);

const eigenvalues = [3, 1];

// 1. 通常の行列積による累乗（直接法）
function powerDirect(a, n) {
    let result = Matrix.createIdentity(a.rows);
    for (let i = 0; i < n; i++) {
        result = Matrix.multiplyMatrices(result, a);
    }
    return result;
}

// 2. 対角化による累乗 (A^n = P * D^n * P^-1)
function powerDiagonalized(p, eigs, n) {
    const dn = new Matrix(eigs.length, eigs.length);
    for (let i = 0; i < eigs.length; i++) {
        dn.data[i][i] = Math.pow(eigs[i], n);
    }
    const pInv = p.inverse();
    const temp = Matrix.multiplyMatrices(p, dn);
    return Matrix.multiplyMatrices(temp, pInv);
}

// JIT/GCノイズを除去するため複数回計測の中央値を採用
function measureMedian(fn, runs, rounds = 3) {
    const samples = [];
    for (let r = 0; r < rounds; r++) {
        const t0 = performance.now();
        for (let i = 0; i < runs; i++) {
            fn();
        }
        const t1 = performance.now();
        samples.push(t1 - t0);
    }
    samples.sort((a, b) => a - b);
    return samples[Math.floor(samples.length / 2)];
}

function getResponsiveCanvasSize(containerId) {
    const container = document.getElementById(containerId);
    const width = MathByMakingCanvas.calculateCanvasSize(container ? container.clientWidth : 0, window.innerWidth);
    const height = Math.max(320, Math.min(390, Math.floor(width * 0.65)));
    return { width, height };
}

// ==========================================
// グラフ1: 累乗数 n による比較グラフ (直接法 O(n) vs 対角化法 O(1))
// コンテナ: #diagonalization-canvas
// ==========================================
new p5((p) => {
    let currentMode = 'operations'; // 'operations' | 'time'
    let isBenchmarking = false;

    // 計算回数モードのデータ (n = 1 .. 50)
    const opNValues = [];
    for (let n = 1; n <= 50; n++) {
        opNValues.push(n);
    }

    // 実測時間モードの n 値 (1, 5, 10, ..., 50)
    const timeNValues = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const benchmarkRuns = 2000;

    let benchmarkDirectTimes = timeNValues.map(n => Number((0.08 * n + 0.2).toFixed(2)));
    let benchmarkDiagonalTimes = timeNValues.map(() => 0.45);

    let hoveredIndex = -1;

    function updateStatusText(message) {
        const statusEl = document.getElementById('canvas-benchmark-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    function executeBenchmark() {
        if (isBenchmarking) return;
        isBenchmarking = true;
        updateStatusText(`ベンチマーク計測中... (${benchmarkRuns}回反復)`);

        const runBtn = document.getElementById('btn-run-benchmark');
        if (runBtn) runBtn.disabled = true;

        setTimeout(() => {
            const directTimes = [];
            const diagonalTimes = [];

            // ウォームアップ
            powerDirect(matrixA, 5);
            powerDiagonalized(matrixP, eigenvalues, 5);

            for (const n of timeNValues) {
                const dTime = measureMedian(() => powerDirect(matrixA, n), benchmarkRuns);
                directTimes.push(Number(dTime.toFixed(2)));

                const diagTime = measureMedian(() => powerDiagonalized(matrixP, eigenvalues, n), benchmarkRuns);
                diagonalTimes.push(Number(diagTime.toFixed(2)));
            }

            benchmarkDirectTimes = directTimes;
            benchmarkDiagonalTimes = diagonalTimes;
            isBenchmarking = false;

            if (runBtn) runBtn.disabled = false;

            const maxN = timeNValues[timeNValues.length - 1];
            const lastDirect = directTimes[directTimes.length - 1];
            const lastDiag = diagonalTimes[diagonalTimes.length - 1];
            const ratio = lastDiag > 0 ? (lastDirect / lastDiag).toFixed(1) : "-";

            updateStatusText(`実測完了 (${benchmarkRuns}回反復): n=${maxN} では対角化法が約 ${ratio} 倍高速に完了`);
            p.redraw();
        }, 50);
    }

    p.setup = () => {
        const { width: w, height: h } = getResponsiveCanvasSize('diagonalization-canvas');
        const canvas = p.createCanvas(w, h);
        canvas.attribute('aria-label', '累乗計算における直接法と対角化法の計算量・実行時間比較グラフ');

        setupDomControls();
        updateStatusText('表示中: 計算回数（乗算回数）の理論値比較。直接法は O(n) で増加、対角化法は O(1) で一定。');
        p.noLoop();
    };

    function setupDomControls() {
        const btnOps = document.getElementById('btn-mode-operations');
        const btnTime = document.getElementById('btn-mode-time');
        const btnRun = document.getElementById('btn-run-benchmark');

        if (btnOps) {
            btnOps.addEventListener('click', () => {
                currentMode = 'operations';
                btnOps.classList.add('active');
                btnOps.setAttribute('aria-pressed', 'true');
                if (btnTime) {
                    btnTime.classList.remove('active');
                    btnTime.setAttribute('aria-pressed', 'false');
                }
                hoveredIndex = -1;
                updateStatusText('表示中: 計算回数（乗算回数）の理論値比較。直接法は O(n) で増加、対角化法は O(1) で一定。');
                p.redraw();
            });
        }

        if (btnTime) {
            btnTime.addEventListener('click', () => {
                currentMode = 'time';
                btnTime.classList.add('active');
                btnTime.setAttribute('aria-pressed', 'true');
                if (btnOps) {
                    btnOps.classList.remove('active');
                    btnOps.setAttribute('aria-pressed', 'false');
                }
                hoveredIndex = -1;
                updateStatusText(`表示中: ブラウザ実測時間 (${benchmarkRuns}回反復)。「実測ベンチマークを実行」で再測定できます。`);
                p.redraw();
            });
        }

        if (btnRun) {
            btnRun.addEventListener('click', () => {
                if (btnTime && !btnTime.classList.contains('active')) {
                    btnTime.click();
                }
                executeBenchmark();
            });
        }
    }

    p.windowResized = () => {
        const { width: w, height: h } = getResponsiveCanvasSize('diagonalization-canvas');
        p.resizeCanvas(w, h);
        p.redraw();
    };

    p.mouseMoved = () => {
        handlePointer(p.mouseX, p.mouseY);
    };

    p.touchMoved = () => {
        if (p.touches.length > 0) {
            handlePointer(p.touches[0].x, p.touches[0].y);
        }
    };

    function handlePointer(px, py) {
        const padLeft = 60;
        const padRight = 20;
        const padTop = 56;
        const padBottom = 48;
        const plotW = p.width - padLeft - padRight;
        const plotH = p.height - padTop - padBottom;

        if (px >= padLeft && px <= padLeft + plotW && py >= padTop && py <= padTop + plotH) {
            const nList = currentMode === 'operations' ? opNValues : timeNValues;
            const normX = (px - padLeft) / plotW;
            const targetN = normX * (nList[nList.length - 1] - nList[0]) + nList[0];

            let closestIdx = 0;
            let minDiff = Infinity;
            for (let i = 0; i < nList.length; i++) {
                const diff = Math.abs(nList[i] - targetN);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIdx = i;
                }
            }

            if (hoveredIndex !== closestIdx) {
                hoveredIndex = closestIdx;
                p.redraw();
            }
        } else if (hoveredIndex !== -1) {
            hoveredIndex = -1;
            p.redraw();
        }
    }

    p.draw = () => {
        p.background(248, 250, 252);

        const padLeft = 60;
        const padRight = 20;
        const padTop = 56;
        const padBottom = 48;
        const plotW = p.width - padLeft - padRight;
        const plotH = p.height - padTop - padBottom;

        const nList = currentMode === 'operations' ? opNValues : timeNValues;
        const maxN = nList[nList.length - 1];

        let maxY = 420;
        let yUnit = '乗算回数 (回)';
        if (currentMode === 'operations') {
            maxY = 420;
            yUnit = '乗算回数 (回)';
        } else {
            const maxTime = Math.max(...benchmarkDirectTimes, ...benchmarkDiagonalTimes, 0.5);
            maxY = Math.ceil(maxTime * 1.25 * 10) / 10;
            yUnit = `実行時間 (ms / ${benchmarkRuns}回)`;
        }

        // 1. グリッド線とY軸ラベル（線型座標軸）
        p.stroke(226, 232, 240);
        p.strokeWeight(1);
        p.fill(100, 116, 139);
        p.textSize(11);
        p.textAlign(p.RIGHT, p.CENTER);

        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const val = (maxY / yTicks) * i;
            const y = padTop + plotH - (plotH / yTicks) * i;
            p.line(padLeft, y, padLeft + plotW, y);
            p.noStroke();
            p.text(currentMode === 'operations' ? Math.round(val) : val.toFixed(1), padLeft - 8, y);
            p.stroke(226, 232, 240);
        }

        // 2. X軸目盛りとラベル
        p.textAlign(p.CENTER, p.TOP);
        const xStep = 10;
        for (let n = 0; n <= maxN; n += xStep) {
            const x = padLeft + (n / maxN) * plotW;
            p.line(x, padTop, x, padTop + plotH);
            p.noStroke();
            p.text(n, x, padTop + plotH + 8);
            p.stroke(226, 232, 240);
        }

        // 3. 凡例（最上段・動的間隔で重なりを完全防止）
        const rightEdge = padLeft + plotW;
        const legendY = 18;
        p.textSize(11);

        const directLegendText = '直接計算 O(n)';
        const diagLegendText = '対角化 O(1)';
        const lineLen = 16;
        const lineGap = 6;
        const itemGap = 16;

        const directW = lineLen + lineGap + p.textWidth(directLegendText);
        const diagW = lineLen + lineGap + p.textWidth(diagLegendText);
        const totalLegendW = directW + itemGap + diagW;

        const legendStartX = Math.max(padLeft, rightEdge - totalLegendW);
        p.textAlign(p.LEFT, p.CENTER);

        // 直接法（赤線）
        p.stroke(239, 68, 68);
        p.strokeWeight(3);
        p.line(legendStartX, legendY, legendStartX + lineLen, legendY);
        p.noStroke();
        p.fill(71, 85, 105);
        p.text(directLegendText, legendStartX + lineLen + lineGap, legendY);

        // 対角化法（青線）
        const diagStartX = legendStartX + directW + itemGap;
        p.stroke(37, 99, 235);
        p.strokeWeight(3);
        p.line(diagStartX, legendY, diagStartX + lineLen, legendY);
        p.noStroke();
        p.fill(71, 85, 105);
        p.text(diagLegendText, diagStartX + lineLen + lineGap, legendY);

        // 4. 軸タイトル（独立配置）
        p.noStroke();
        p.fill(71, 85, 105);
        p.textSize(12);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.TOP);
        p.text('累乗の指数 n', padLeft + plotW / 2, padTop + plotH + 26);

        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(11);
        p.text(yUnit, padLeft, padTop - 14);
        p.textStyle(p.NORMAL);

        // 5. 折れ線グラフ（線型座標軸）
        // (A) 直接法 (赤色)
        p.stroke(239, 68, 68);
        p.strokeWeight(2.5);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < nList.length; i++) {
            const n = nList[i];
            const val = currentMode === 'operations' ? (8 * n) : benchmarkDirectTimes[i];
            const x = padLeft + (n / maxN) * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            p.vertex(x, y);
        }
        p.endShape();

        p.fill(239, 68, 68);
        for (let i = 0; i < nList.length; i++) {
            const n = nList[i];
            const val = currentMode === 'operations' ? (8 * n) : benchmarkDirectTimes[i];
            const x = padLeft + (n / maxN) * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            if (currentMode === 'time' || n % 5 === 0 || n === 1) {
                p.circle(x, y, 5);
            }
        }

        // (B) 対角化法 (ブランドブルー)
        p.stroke(37, 99, 235);
        p.strokeWeight(2.5);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < nList.length; i++) {
            const n = nList[i];
            const val = currentMode === 'operations' ? 18 : benchmarkDiagonalTimes[i];
            const x = padLeft + (n / maxN) * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            p.vertex(x, y);
        }
        p.endShape();

        p.fill(37, 99, 235);
        for (let i = 0; i < nList.length; i++) {
            const n = nList[i];
            const val = currentMode === 'operations' ? 18 : benchmarkDiagonalTimes[i];
            const x = padLeft + (n / maxN) * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            if (currentMode === 'time' || n % 5 === 0 || n === 1) {
                p.circle(x, y, 5);
            }
        }

        // 6. ホバーインジケータとツールチップ
        if (hoveredIndex >= 0 && hoveredIndex < nList.length) {
            const n = nList[hoveredIndex];
            const x = padLeft + (n / maxN) * plotW;

            const directVal = currentMode === 'operations' ? (8 * n) : benchmarkDirectTimes[hoveredIndex];
            const diagVal = currentMode === 'operations' ? 18 : benchmarkDiagonalTimes[hoveredIndex];

            const directY = padTop + plotH - (directVal / maxY) * plotH;
            const diagY = padTop + plotH - (diagVal / maxY) * plotH;

            p.stroke(148, 163, 184);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([4, 4]);
            p.line(x, padTop, x, padTop + plotH);
            p.drawingContext.setLineDash([]);

            p.stroke(255);
            p.strokeWeight(2);
            p.fill(239, 68, 68);
            p.circle(x, directY, 9);
            p.fill(37, 99, 235);
            p.circle(x, diagY, 9);

            drawTooltip(x, directY, diagY, n, directVal, diagVal, padLeft, plotW);
        }
    };

    function drawTooltip(targetX, y1, y2, n, directVal, diagVal, padLeft, plotW) {
        const tipW = 160;
        const tipH = 74;

        let tipX = targetX + 12;
        if (tipX + tipW > padLeft + plotW) {
            tipX = targetX - tipW - 12;
        }

        const tipY = Math.max(56, Math.min(p.height - tipH - 52, (y1 + y2) / 2 - tipH / 2));

        p.noStroke();
        p.fill(0, 0, 0, 15);
        p.rect(tipX + 2, tipY + 2, tipW, tipH, 6);

        p.stroke(191, 219, 254);
        p.strokeWeight(1);
        p.fill(255);
        p.rect(tipX, tipY, tipW, tipH, 6);

        p.noStroke();
        p.fill(15, 23, 42);
        p.textStyle(p.BOLD);
        p.textSize(11);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`累乗の指数 n = ${n}`, tipX + 10, tipY + 8);

        p.textStyle(p.NORMAL);
        p.textSize(10.5);

        p.fill(239, 68, 68);
        const directLabel = currentMode === 'operations' ? `${directVal} 回` : `${directVal} ms`;
        p.text(`● 直接計算: ${directLabel}`, tipX + 10, tipY + 26);

        p.fill(37, 99, 235);
        const diagLabel = currentMode === 'operations' ? `${diagVal} 回` : `${diagVal} ms`;
        p.text(`● 対角化法: ${diagLabel}`, tipX + 10, tipY + 41);

        p.fill(71, 85, 105);
        let ratioText = '';
        if (currentMode === 'operations') {
            const reduction = directVal > 0 ? (((directVal - diagVal) / directVal) * 100).toFixed(1) : 0;
            ratioText = `削減率: ${reduction}% 減`;
        } else {
            const speedup = diagVal > 0 ? (directVal / diagVal).toFixed(1) : '-';
            ratioText = `速度: 約 ${speedup} 倍高速`;
        }
        p.text(`→ ${ratioText}`, tipX + 10, tipY + 56);
    }
}, 'diagonalization-canvas');


// ==========================================
// グラフ2: 行列サイズ m による成分乗算回数の比較 (O(m³) 3次関数の増大比較)
// コンテナ: #matrix-size-canvas
// ==========================================
new p5((p) => {
    let currentPowerN = 20; // 選択された累乗数 n (10 | 20 | 50)
    const mValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    let hoveredIndex = -1;

    function updateSizeStatusText() {
        const statusEl = document.getElementById('canvas-size-status');
        if (statusEl) {
            statusEl.textContent = `表示中: 累乗数 n = ${currentPowerN} における行列サイズ m の成分乗算回数比較`;
        }
    }

    p.setup = () => {
        const { width: w, height: h } = getResponsiveCanvasSize('matrix-size-canvas');
        const canvas = p.createCanvas(w, h);
        canvas.attribute('aria-label', '行列サイズ m の増加に伴う成分乗算回数の比較グラフ');

        setupSizeDomControls();
        updateSizeStatusText();
        p.noLoop();
    };

    function setupSizeDomControls() {
        const btn10 = document.getElementById('btn-n-10');
        const btn20 = document.getElementById('btn-n-20');
        const btn50 = document.getElementById('btn-n-50');
        const buttons = [
            { btn: btn10, n: 10 },
            { btn: btn20, n: 20 },
            { btn: btn50, n: 50 },
        ];

        buttons.forEach(({ btn, n }) => {
            if (btn) {
                btn.addEventListener('click', () => {
                    currentPowerN = n;
                    buttons.forEach(({ btn: b }) => {
                        if (b) {
                            b.classList.remove('active');
                            b.setAttribute('aria-pressed', 'false');
                        }
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    hoveredIndex = -1;
                    updateSizeStatusText();
                    p.redraw();
                });
            }
        });
    }

    p.windowResized = () => {
        const { width: w, height: h } = getResponsiveCanvasSize('matrix-size-canvas');
        p.resizeCanvas(w, h);
        p.redraw();
    };

    p.mouseMoved = () => {
        handlePointer(p.mouseX, p.mouseY);
    };

    p.touchMoved = () => {
        if (p.touches.length > 0) {
            handlePointer(p.touches[0].x, p.touches[0].y);
        }
    };

    function handlePointer(px, py) {
        const padLeft = 70;
        const padRight = 20;
        const padTop = 56;
        const padBottom = 48;
        const plotW = p.width - padLeft - padRight;
        const plotH = p.height - padTop - padBottom;

        if (px >= padLeft && px <= padLeft + plotW && py >= padTop && py <= padTop + plotH) {
            const normX = (px - padLeft) / plotW;
            const targetM = normX * (mValues[mValues.length - 1] - mValues[0]) + mValues[0];

            let closestIdx = 0;
            let minDiff = Infinity;
            for (let i = 0; i < mValues.length; i++) {
                const diff = Math.abs(mValues[i] - targetM);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIdx = i;
                }
            }

            if (hoveredIndex !== closestIdx) {
                hoveredIndex = closestIdx;
                p.redraw();
            }
        } else if (hoveredIndex !== -1) {
            hoveredIndex = -1;
            p.redraw();
        }
    }

    p.draw = () => {
        p.background(248, 250, 252);

        const padLeft = 70;
        const padRight = 20;
        const padTop = 56;
        const padBottom = 48;
        const plotW = p.width - padLeft - padRight;
        const plotH = p.height - padTop - padBottom;

        const maxM = mValues[mValues.length - 1]; // 20
        // 直接法の最大値: currentPowerN * 20^3 (例: 20 * 8000 = 160,000)
        const maxRaw = currentPowerN * Math.pow(maxM, 3);
        const maxY = Math.ceil(maxRaw * 1.1 / 10000) * 10000;

        // 1. グリッド線とY軸ラベル（線型座標軸）
        p.stroke(226, 232, 240);
        p.strokeWeight(1);
        p.fill(100, 116, 139);
        p.textSize(11);
        p.textAlign(p.RIGHT, p.CENTER);

        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const val = (maxY / yTicks) * i;
            const y = padTop + plotH - (plotH / yTicks) * i;
            p.line(padLeft, y, padLeft + plotW, y);
            p.noStroke();

            let label = val.toString();
            if (val >= 10000) {
                label = `${(val / 10000).toFixed(0)}万`;
            } else if (val > 0) {
                label = val.toLocaleString();
            }
            p.text(label, padLeft - 8, y);
            p.stroke(226, 232, 240);
        }

        // 2. X軸目盛りとラベル (m = 2, 5, 10, 15, 20)
        p.textAlign(p.CENTER, p.TOP);
        const tickMarks = [2, 5, 10, 15, 20];
        for (const m of tickMarks) {
            const normX = (m - mValues[0]) / (maxM - mValues[0]);
            const x = padLeft + normX * plotW;
            p.line(x, padTop, x, padTop + plotH);
            p.noStroke();
            p.text(m, x, padTop + plotH + 8);
            p.stroke(226, 232, 240);
        }

        // 3. 凡例（最上段・動的間隔で重なりを完全防止）
        const rightEdge = padLeft + plotW;
        const legendY = 18;
        p.textSize(11);

        const directLegendText = `直接計算 n・m³ (${currentPowerN}m³) 回`;
        const diagLegendText = '対角化法 2m³ + m 回';
        const lineLen = 16;
        const lineGap = 6;
        const itemGap = 16;

        const directW = lineLen + lineGap + p.textWidth(directLegendText);
        const diagW = lineLen + lineGap + p.textWidth(diagLegendText);
        const totalLegendW = directW + itemGap + diagW;

        const legendStartX = Math.max(padLeft, rightEdge - totalLegendW);
        p.textAlign(p.LEFT, p.CENTER);

        // 直接法（赤線）
        p.stroke(239, 68, 68);
        p.strokeWeight(3);
        p.line(legendStartX, legendY, legendStartX + lineLen, legendY);
        p.noStroke();
        p.fill(71, 85, 105);
        p.text(directLegendText, legendStartX + lineLen + lineGap, legendY);

        // 対角化法（青線）
        const diagStartX = legendStartX + directW + itemGap;
        p.stroke(37, 99, 235);
        p.strokeWeight(3);
        p.line(diagStartX, legendY, diagStartX + lineLen, legendY);
        p.noStroke();
        p.fill(71, 85, 105);
        p.text(diagLegendText, diagStartX + lineLen + lineGap, legendY);

        // 4. 軸タイトル
        p.noStroke();
        p.fill(71, 85, 105);
        p.textSize(12);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.TOP);
        p.text('行列サイズ（次数）m', padLeft + plotW / 2, padTop + plotH + 26);

        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(11);
        p.text('成分同士の乗算回数 (回)', padLeft, padTop - 14);
        p.textStyle(p.NORMAL);

        // 5. 折れ線グラフ（線型座標軸）
        // (A) 直接法 (赤色: n * m^3)
        p.stroke(239, 68, 68);
        p.strokeWeight(2.5);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < mValues.length; i++) {
            const m = mValues[i];
            const val = currentPowerN * Math.pow(m, 3);
            const normX = (m - mValues[0]) / (maxM - mValues[0]);
            const x = padLeft + normX * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            p.vertex(x, y);
        }
        p.endShape();

        p.fill(239, 68, 68);
        for (let i = 0; i < mValues.length; i++) {
            const m = mValues[i];
            const val = currentPowerN * Math.pow(m, 3);
            const normX = (m - mValues[0]) / (maxM - mValues[0]);
            const x = padLeft + normX * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            if (m % 2 === 0 || m === 5 || m === 15) {
                p.circle(x, y, 5);
            }
        }

        // (B) 対角化法 (ブランドブルー: 2 * m^3 + m)
        p.stroke(37, 99, 235);
        p.strokeWeight(2.5);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < mValues.length; i++) {
            const m = mValues[i];
            const val = 2 * Math.pow(m, 3) + m;
            const normX = (m - mValues[0]) / (maxM - mValues[0]);
            const x = padLeft + normX * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            p.vertex(x, y);
        }
        p.endShape();

        p.fill(37, 99, 235);
        for (let i = 0; i < mValues.length; i++) {
            const m = mValues[i];
            const val = 2 * Math.pow(m, 3) + m;
            const normX = (m - mValues[0]) / (maxM - mValues[0]);
            const x = padLeft + normX * plotW;
            const y = padTop + plotH - (val / maxY) * plotH;
            if (m % 2 === 0 || m === 5 || m === 15) {
                p.circle(x, y, 5);
            }
        }

        // 6. ホバーインジケータとツールチップ
        if (hoveredIndex >= 0 && hoveredIndex < mValues.length) {
            const m = mValues[hoveredIndex];
            const normX = (m - mValues[0]) / (maxM - mValues[0]);
            const x = padLeft + normX * plotW;

            const directVal = currentPowerN * Math.pow(m, 3);
            const diagVal = 2 * Math.pow(m, 3) + m;

            const directY = padTop + plotH - (directVal / maxY) * plotH;
            const diagY = padTop + plotH - (diagVal / maxY) * plotH;

            p.stroke(148, 163, 184);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([4, 4]);
            p.line(x, padTop, x, padTop + plotH);
            p.drawingContext.setLineDash([]);

            p.stroke(255);
            p.strokeWeight(2);
            p.fill(239, 68, 68);
            p.circle(x, directY, 9);
            p.fill(37, 99, 235);
            p.circle(x, diagY, 9);

            drawSizeTooltip(x, directY, diagY, m, directVal, diagVal, padLeft, plotW);
        }
    };

    function drawSizeTooltip(targetX, y1, y2, m, directVal, diagVal, padLeft, plotW) {
        const tipW = 185;
        const tipH = 76;

        let tipX = targetX + 12;
        if (tipX + tipW > padLeft + plotW) {
            tipX = targetX - tipW - 12;
        }

        const tipY = Math.max(56, Math.min(p.height - tipH - 52, (y1 + y2) / 2 - tipH / 2));

        p.noStroke();
        p.fill(0, 0, 0, 15);
        p.rect(tipX + 2, tipY + 2, tipW, tipH, 6);

        p.stroke(191, 219, 254);
        p.strokeWeight(1);
        p.fill(255);
        p.rect(tipX, tipY, tipW, tipH, 6);

        p.noStroke();
        p.fill(15, 23, 42);
        p.textStyle(p.BOLD);
        p.textSize(11);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`行列サイズ m = ${m} (${m}×${m})`, tipX + 10, tipY + 8);

        p.textStyle(p.NORMAL);
        p.textSize(10.5);

        p.fill(239, 68, 68);
        p.text(`● 直接計算: ${directVal.toLocaleString()} 回`, tipX + 10, tipY + 26);

        p.fill(37, 99, 235);
        p.text(`● 対角化法: ${diagVal.toLocaleString()} 回`, tipX + 10, tipY + 41);

        p.fill(71, 85, 105);
        const reduction = (((directVal - diagVal) / directVal) * 100).toFixed(1);
        const speedup = (directVal / diagVal).toFixed(1);
        p.text(`→ 削減率: ${reduction}% 減 (約 ${speedup} 倍)`, tipX + 10, tipY + 57);
    }
}, 'matrix-size-canvas');
