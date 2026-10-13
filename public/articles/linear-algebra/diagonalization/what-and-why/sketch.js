let isAnimating = true;
let currentT = 0;
let animationDirection = 1;

// 行列 A = [[2, 1], [1, 2]]
// 固有値: λ1 = 3, λ2 = 1
// 固有ベクトル: v1 = [1, 1]^T, v2 = [-1, 1]^T
const matrixA = [
    [2, 1],
    [1, 2]
];

function getResponsiveCanvasSize() {
    const container = document.getElementById('diagonalization-canvas');
    return MathByMakingCanvas.calculateCanvasSize(container ? container.clientWidth : 0, window.innerWidth);
}

function updateAnimationStatus() {
    const container = document.getElementById('diagonalization-canvas');
    const status = document.getElementById('canvas-animation-status');

    if (container) container.dataset.animationState = isAnimating ? 'playing' : 'paused';
    if (status) status.textContent = `アニメーション: ${isAnimating ? '再生中' : '一時停止中'}`;
}

function toggleAnimation() {
    isAnimating = !isAnimating;
    updateAnimationStatus();
}

function setup() {
    const canvasSize = getResponsiveCanvasSize();
    const canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('diagonalization-canvas');
    canvas.attribute('aria-label', '固有ベクトル方向への拡大縮小と対角化の幾何学的アニメーション');
    canvas.elt.addEventListener('click', toggleAnimation);
    updateAnimationStatus();

    // 行列演算のデモ計算をコンソールに出力
    demonstrateMatrixDiagonalization();
}

function demonstrateMatrixDiagonalization() {
    const A = new Matrix(2, 2);
    A.set([[2, 1], [1, 2]]);

    // P = [[1, -1], [1, 1]] (固有ベクトルを並べた行列)
    const P = new Matrix(2, 2);
    P.set([[1, -1], [1, 1]]);

    const P_inv = P.inverse();

    // D = P^-1 * A * P
    const temp = Matrix.multiplyMatrices(P_inv, A);
    const D = Matrix.multiplyMatrices(temp, P);

    console.log("=== 行列 A の対角化検証 ===");
    console.log("元の行列 A:");
    console.table(A.data);
    console.log("固有ベクトルを並べた行列 P:");
    console.table(P.data);
    console.log("対角化後の行列 D = P⁻¹AP (対角成分が固有値 3, 1):");
    console.table(D.data);
}

function windowResized() {
    const canvasSize = getResponsiveCanvasSize();
    resizeCanvas(canvasSize, canvasSize);
}

function draw() {
    background(248, 250, 252); // var(--color-surface-soft)

    if (isAnimating) {
        currentT += 0.008 * animationDirection;
        if (currentT >= 1) {
            currentT = 1;
            animationDirection = -1;
        } else if (currentT <= 0) {
            currentT = 0;
            animationDirection = 1;
        }
    }

    // 補間イージング (smoothstep)
    const t = currentT * currentT * (3 - 2 * currentT);

    const halfW = width / 2;
    const halfH = height / 2;
    const scaleFactor = width / 10; // 空間の単位スケール (1目盛り)

    push();
    translate(halfW, halfH);
    scale(1, -1); // 数学のデカルト座標系（上が +y）にする

    // 現在の補間行列 M(t) = (1 - t) * I + t * A
    const m00 = 1 + (matrixA[0][0] - 1) * t;
    const m01 = 0 + (matrixA[0][1] - 0) * t;
    const m10 = 0 + (matrixA[1][0] - 0) * t;
    const m11 = 1 + (matrixA[1][1] - 1) * t;

    // 1. 変形グリッドを描画
    drawTransformedGrid(m00, m01, m10, m11, scaleFactor);

    // 2. 固有ベクトルの軸（特等席の軸）を描画
    drawEigenAxes(scaleFactor);

    // 3. 標準基底ベクトル (e1, e2) の行き先を描画
    drawVector(m00 * scaleFactor, m10 * scaleFactor, color(239, 68, 68), 'e₁'); // 赤
    drawVector(m01 * scaleFactor, m11 * scaleFactor, color(34, 197, 94), 'e₂'); // 緑

    // 4. 固有ベクトル (v1, v2) の行き先を描画
    // v1 = [1, 1] -> A*v1 = [3, 3]
    const v1x = (m00 * 1 + m01 * 1) * scaleFactor;
    const v1y = (m10 * 1 + m11 * 1) * scaleFactor;
    drawVector(v1x, v1y, color(29, 78, 216), 'v₁ (λ=3)', 3); // 濃い青

    // v2 = [-1, 1] -> A*v2 = [-1, 1]
    const v2x = (m00 * (-1) + m01 * 1) * scaleFactor;
    const v2y = (m10 * (-1) + m11 * 1) * scaleFactor;
    drawVector(v2x, v2y, color(147, 51, 234), 'v₂ (λ=1)', 3); // 紫

    pop();

    // 画面左上に状態ラベルを描画
    drawOverlayLabels(t);
}

function drawTransformedGrid(m00, m01, m10, m11, scaleFactor) {
    stroke(203, 213, 225, 120); // 薄いスレート
    strokeWeight(1);

    const range = 5;
    for (let i = -range; i <= range; i++) {
        // x = i の垂直線
        const x1 = (m00 * i + m01 * (-range)) * scaleFactor;
        const y1 = (m10 * i + m11 * (-range)) * scaleFactor;
        const x2 = (m00 * i + m01 * range) * scaleFactor;
        const y2 = (m10 * i + m11 * range) * scaleFactor;
        line(x1, y1, x2, y2);

        // y = i の水平線
        const hx1 = (m00 * (-range) + m01 * i) * scaleFactor;
        const hy1 = (m10 * (-range) + m11 * i) * scaleFactor;
        const hx2 = (m00 * range + m01 * i) * scaleFactor;
        const hy2 = (m10 * range + m11 * i) * scaleFactor;
        line(hx1, hy1, hx2, hy2);
    }
}

function drawEigenAxes(scaleFactor) {
    // 固有ベクトル1の方向 (y = x)
    stroke(29, 78, 216, 80);
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    line(-scaleFactor * 5, -scaleFactor * 5, scaleFactor * 5, scaleFactor * 5);

    // 固有ベクトル2の方向 (y = -x)
    stroke(147, 51, 234, 80);
    line(-scaleFactor * 5, scaleFactor * 5, scaleFactor * 5, -scaleFactor * 5);

    drawingContext.setLineDash([]); // 点線リセット
}

function drawVector(x, y, col, labelText, sw = 2.5) {
    stroke(col);
    strokeWeight(sw);
    fill(col);

    // ベクトル本体
    line(0, 0, x, y);

    // 矢印の先端
    const angle = atan2(y, x);
    const arrowSize = 8;
    push();
    translate(x, y);
    rotate(angle);
    triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
    pop();

    // ラベル（数学座標系に合わせて文字は反転を戻す）
    push();
    translate(x, y);
    scale(1, -1);
    noStroke();
    fill(col);
    textSize(11);
    textStyle(BOLD);
    text(labelText, 8, -6);
    pop();
}

function drawOverlayLabels(t) {
    noStroke();
    fill(15, 23, 42); // slate-900
    textSize(12);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);

    const percent = Math.round(t * 100);
    text(`変換の進行: ${percent}% (クリックで停止/再生)`, 16, 16);

    textSize(11);
    fill(29, 78, 216);
    text(`● v₁=[1, 1]ᵀ 方向: 3倍にまっすぐ伸縮 (λ=3)`, 16, 36);

    fill(147, 51, 234);
    text(`● v₂=[-1, 1]ᵀ 方向: 1倍（変化なし） (λ=1)`, 16, 52);
}
