// 行列累乗の計算量・実行時間比較グラフ (p5.js)

// 状態管理
let currentMode = 'operations'; // 'operations' (計算回数) | 'time' (実測時間)
let isBenchmarking = false;

// サンプル行列 A = [[2, 1], [1, 2]], P = [[1, -1], [1, 1]], 固有値 = [3, 1]
const matrixA = new Matrix(2, 2);
matrixA.set([[2, 1], [1, 2]]);

const matrixP = new Matrix(2, 2);
matrixP.set([[1, -1], [1, 1]]);

const eigenvalues = [3, 1];

// 計算回数モードのデータ (n = 1 .. 50)
const opNValues = [];
for (let n = 1; n <= 50; n++) {
    opNValues.push(n);
}

// 実測時間モードの n 値 (1, 5, 10, ..., 50)
const timeNValues = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const benchmarkRuns = 1000;

// 実測時間の初期キャッシュ（初回計測前の初期目安値、計測後に上書き）
let benchmarkDirectTimes = timeNValues.map(n => Number((0.0035 * n).toFixed(3)));
let benchmarkDiagonalTimes = timeNValues.map(() => 0.025);

// ホバー追従
let hoveredNIndex = -1;

function getResponsiveCanvasSize() {
    const container = document.getElementById('diagonalization-canvas');
    const width = MathByMakingCanvas.calculateCanvasSize(container ? container.clientWidth : 0, window.innerWidth);
    // アスペクト比: 幅に応じて高さを 320px〜380px に設定
    const height = Math.max(300, Math.min(380, Math.floor(width * 0.62)));
    return { width, height };
}

function updateStatusText(message) {
    const statusEl = document.getElementById('canvas-benchmark-status');
    if (statusEl) {
        statusEl.textContent = message;
    }
}

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

// 実測ベンチマーク実行
function executeBenchmark() {
    if (isBenchmarking) return;
    isBenchmarking = true;
    updateStatusText(`ベンチマーク計測中... (${benchmarkRuns}回反復)`);

    const runBtn = document.getElementById('btn-run-benchmark');
    if (runBtn) runBtn.disabled = true;

    // UIの描画更新を阻害しないよう setTimeout で非同期実行
    setTimeout(() => {
        const directTimes = [];
        const diagonalTimes = [];

        // ウォームアップ
        powerDirect(matrixA, 5);
        powerDiagonalized(matrixP, eigenvalues, 5);

        for (const n of timeNValues) {
            // 直接法の計測
            const t0 = performance.now();
            for (let r = 0; r < benchmarkRuns; r++) {
                powerDirect(matrixA, n);
            }
            const t1 = performance.now();
            directTimes.push(Number((t1 - t0).toFixed(2)));

            // 対角化法の計測
            const t2 = performance.now();
            for (let r = 0; r < benchmarkRuns; r++) {
                powerDiagonalized(matrixP, eigenvalues, n);
            }
            const t3 = performance.now();
            diagonalTimes.push(Number((t3 - t2).toFixed(2)));
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
        redraw();
    }, 50);
}

function setup() {
    const { width: w, height: h } = getResponsiveCanvasSize();
    const canvas = createCanvas(w, h);
    canvas.parent('diagonalization-canvas');
    canvas.attribute('aria-label', '累乗計算における直接法と対角化法の計算量・実行時間比較グラフ');

    setupDomControls();
    updateStatusText('表示中: 計算回数（乗算回数）の理論値比較。グラフ上で詳細を確認できます。');
    noLoop(); // 静的グラフ。ホバーやモード切り替え時に redraw() を呼ぶ
}

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
            hoveredNIndex = -1;
            updateStatusText('表示中: 計算回数（乗算回数）の理論値比較。直接法は O(n) で増加、対角化法は O(1) で一定。');
            redraw();
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
            hoveredNIndex = -1;
            updateStatusText(`表示中: ブラウザ実測時間 (${benchmarkRuns}回反復)。「実測ベンチマークを実行」で再測定できます。`);
            redraw();
        });
    }

    if (btnRun) {
        btnRun.addEventListener('click', () => {
            // 自動的に実測時間モードに切り替えて実行
            if (btnTime && !btnTime.classList.contains('active')) {
                btnTime.click();
            }
            executeBenchmark();
        });
    }
}

function windowResized() {
    const { width: w, height: h } = getResponsiveCanvasSize();
    resizeCanvas(w, h);
    redraw();
}

function mouseMoved() {
    handlePointer(mouseX, mouseY);
}

function touchMoved() {
    if (touches.length > 0) {
        handlePointer(touches[0].x, touches[0].y);
    }
    // ページ全体のスクロールを阻害しないよう false を返さない（ブラウザの縦スクロールを許可）
}

function handlePointer(px, py) {
    const padLeft = 64;
    const padRight = 24;
    const padTop = 44;
    const padBottom = 48;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    if (px >= padLeft && px <= padLeft + plotW && py >= padTop && py <= padTop + plotH) {
        const nList = currentMode === 'operations' ? opNValues : timeNValues;
        const normX = (px - padLeft) / plotW;
        const targetN = normX * (nList[nList.length - 1] - nList[0]) + nList[0];

        // 最も近い n を探す
        let closestIdx = 0;
        let minDiff = Infinity;
        for (let i = 0; i < nList.length; i++) {
            const diff = Math.abs(nList[i] - targetN);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = i;
            }
        }

        if (hoveredNIndex !== closestIdx) {
            hoveredNIndex = closestIdx;
            redraw();
        }
    } else if (hoveredNIndex !== -1) {
        hoveredNIndex = -1;
        redraw();
    }
}

function draw() {
    background(248, 250, 252); // var(--color-surface-soft)

    const padLeft = 64;
    const padRight = 24;
    const padTop = 44;
    const padBottom = 48;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const nList = currentMode === 'operations' ? opNValues : timeNValues;
    const maxN = nList[nList.length - 1];

    let maxY = 420;
    let yUnit = '回';
    if (currentMode === 'operations') {
        maxY = 420; // 8 * 50 = 400 + 余白
        yUnit = '乗算回数 (回)';
    } else {
        const maxTime = Math.max(...benchmarkDirectTimes, ...benchmarkDiagonalTimes, 0.1);
        maxY = Math.ceil(maxTime * 1.25 * 10) / 10;
        yUnit = `実行時間 (ms / ${benchmarkRuns}回)`;
    }

    // 1. グリッド線とY軸ラベル
    stroke(226, 232, 240);
    strokeWeight(1);
    fill(100, 116, 139);
    textSize(11);
    textAlign(RIGHT, CENTER);

    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
        const val = (maxY / yTicks) * i;
        const y = padTop + plotH - (plotH / yTicks) * i;
        line(padLeft, y, padLeft + plotW, y);
        noStroke();
        text(currentMode === 'operations' ? Math.round(val) : val.toFixed(1), padLeft - 8, y);
        stroke(226, 232, 240);
    }

    // 2. X軸目盛りとラベル
    textAlign(CENTER, TOP);
    const xStep = currentMode === 'operations' ? 10 : 10;
    for (let n = 0; n <= maxN; n += xStep) {
        const x = padLeft + (n / maxN) * plotW;
        line(x, padTop, x, padTop + plotH);
        noStroke();
        text(n, x, padTop + plotH + 8);
        stroke(226, 232, 240);
    }

    // 3. 軸タイトル
    noStroke();
    fill(71, 85, 105);
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('累乗数 n', padLeft + plotW / 2, padTop + plotH + 26);

    textAlign(LEFT, BOTTOM);
    text(yUnit, padLeft, padTop - 12);
    textStyle(NORMAL);

    // 4. 折れ線グラフのプロット
    // (A) 直接法 (赤色)
    stroke(239, 68, 68);
    strokeWeight(2.5);
    noFill();
    beginShape();
    for (let i = 0; i < nList.length; i++) {
        const n = nList[i];
        const val = currentMode === 'operations' ? (8 * n) : benchmarkDirectTimes[i];
        const x = padLeft + (n / maxN) * plotW;
        const y = padTop + plotH - (val / maxY) * plotH;
        vertex(x, y);
    }
    endShape();

    // 直接法のポイント描画
    fill(239, 68, 68);
    for (let i = 0; i < nList.length; i++) {
        const n = nList[i];
        const val = currentMode === 'operations' ? (8 * n) : benchmarkDirectTimes[i];
        const x = padLeft + (n / maxN) * plotW;
        const y = padTop + plotH - (val / maxY) * plotH;
        if (currentMode === 'time' || n % 5 === 0 || n === 1) {
            circle(x, y, 5);
        }
    }

    // (B) 対角化法 (ブランドブルー)
    stroke(37, 99, 235);
    strokeWeight(2.5);
    noFill();
    beginShape();
    for (let i = 0; i < nList.length; i++) {
        const n = nList[i];
        const val = currentMode === 'operations' ? 18 : benchmarkDiagonalTimes[i];
        const x = padLeft + (n / maxN) * plotW;
        const y = padTop + plotH - (val / maxY) * plotH;
        vertex(x, y);
    }
    endShape();

    // 対角化法のポイント描画
    fill(37, 99, 235);
    for (let i = 0; i < nList.length; i++) {
        const n = nList[i];
        const val = currentMode === 'operations' ? 18 : benchmarkDiagonalTimes[i];
        const x = padLeft + (n / maxN) * plotW;
        const y = padTop + plotH - (val / maxY) * plotH;
        if (currentMode === 'time' || n % 5 === 0 || n === 1) {
            circle(x, y, 5);
        }
    }

    // 5. 凡例 (右上)
    const legendX = padLeft + plotW - 170;
    const legendY = padTop - 28;
    textSize(11);
    textAlign(LEFT, CENTER);

    // 直接法
    stroke(239, 68, 68);
    strokeWeight(3);
    line(legendX, legendY, legendX + 16, legendY);
    noStroke();
    fill(71, 85, 105);
    text('直接計算 O(n)', legendX + 22, legendY);

    // 対角化法
    stroke(37, 99, 235);
    strokeWeight(3);
    line(legendX + 90, legendY, legendX + 106, legendY);
    noStroke();
    fill(71, 85, 105);
    text('対角化 O(1)', legendX + 112, legendY);

    // 6. ホバーインジケータとツールチップ
    if (hoveredNIndex >= 0 && hoveredNIndex < nList.length) {
        const n = nList[hoveredNIndex];
        const x = padLeft + (n / maxN) * plotW;

        const directVal = currentMode === 'operations' ? (8 * n) : benchmarkDirectTimes[hoveredNIndex];
        const diagVal = currentMode === 'operations' ? 18 : benchmarkDiagonalTimes[hoveredNIndex];

        const directY = padTop + plotH - (directVal / maxY) * plotH;
        const diagY = padTop + plotH - (diagVal / maxY) * plotH;

        // 垂直ガイドライン
        stroke(148, 163, 184);
        strokeWeight(1);
        drawingContext.setLineDash([4, 4]);
        line(x, padTop, x, padTop + plotH);
        drawingContext.setLineDash([]);

        // ポイント強調
        stroke(255);
        strokeWeight(2);
        fill(239, 68, 68);
        circle(x, directY, 9);
        fill(37, 99, 235);
        circle(x, diagY, 9);

        // ツールチップカード描画
        drawTooltip(x, directY, diagY, n, directVal, diagVal, padLeft, padRight, plotW);
    }
}

function drawTooltip(targetX, y1, y2, n, directVal, diagVal, padLeft, padRight, plotW) {
    const tipW = 160;
    const tipH = 74;

    // ツールチップの左右位置調整（端ではみ出さないよう反転）
    let tipX = targetX + 12;
    if (tipX + tipW > padLeft + plotW) {
        tipX = targetX - tipW - 12;
    }

    const tipY = Math.max(48, Math.min(height - tipH - 52, (y1 + y2) / 2 - tipH / 2));

    // カードの影
    noStroke();
    fill(0, 0, 0, 15);
    rect(tipX + 2, tipY + 2, tipW, tipH, 6);

    // カード本体
    stroke(191, 219, 254);
    strokeWeight(1);
    fill(255);
    rect(tipX, tipY, tipW, tipH, 6);

    // タイトル
    noStroke();
    fill(15, 23, 42);
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, TOP);
    text(`累乗数 n = ${n}`, tipX + 10, tipY + 8);

    // 各値の表示
    textStyle(NORMAL);
    textSize(10.5);

    // 直接法
    fill(239, 68, 68);
    const directLabel = currentMode === 'operations' ? `${directVal} 回` : `${directVal} ms`;
    text(`● 直接計算: ${directLabel}`, tipX + 10, tipY + 26);

    // 対角化
    fill(37, 99, 235);
    const diagLabel = currentMode === 'operations' ? `${diagVal} 回` : `${diagVal} ms`;
    text(`● 対角化法: ${diagLabel}`, tipX + 10, tipY + 41);

    // 削減率 / 高速化率
    fill(71, 85, 105);
    let ratioText = '';
    if (currentMode === 'operations') {
        const reduction = directVal > 0 ? (((directVal - diagVal) / directVal) * 100).toFixed(1) : 0;
        ratioText = `削減率: ${reduction}% 減`;
    } else {
        const speedup = diagVal > 0 ? (directVal / diagVal).toFixed(1) : '-';
        ratioText = `速度: 約 ${speedup} 倍高速`;
    }
    text(`→ ${ratioText}`, tipX + 10, tipY + 56);
}
