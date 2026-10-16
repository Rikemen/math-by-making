/**
 * 行列の対角化 第2回: 固有値と固有ベクトルの幾何学的意味
 * p5.js インスタンスモードによる可視化スケッチ
 */

(function () {
    'use strict';

    // 行列 A = [[2, 1], [1, 2]]
    const matrixA = [
        [2, 1],
        [1, 2]
    ];

    // 理論上の固有値と固有ベクトル
    const EIGEN_VALUES = [3, 1];
    const EIGEN_VECTORS = [
        { x: 1 / Math.SQRT2, y: 1 / Math.SQRT2, lambda: 3, label: 'v₁ (λ=3)' },
        { x: -1 / Math.SQRT2, y: 1 / Math.SQRT2, lambda: 1, label: 'v₂ (λ=1)' }
    ];

    // アプリケーション状態
    const state = {
        mode: 'vector', // 'vector' | 'circle'
        angle: Math.PI / 6, // ベクトル x の現在の角度（ラジアン）
        length: 1.2, // ベクトル x の長さ
        isDragging: false,
        isAutoRotating: false,
        autoRotateSpeed: 0.01
    };

    function multiply(matrix, vec) {
        return {
            x: matrix[0][0] * vec.x + matrix[0][1] * vec.y,
            y: matrix[1][0] * vec.x + matrix[1][1] * vec.y
        };
    }

    // 平行判定と固有値倍率の計算
    function analyzeEigen(xVec, axVec) {
        const lenX = Math.hypot(xVec.x, xVec.y);
        const lenAx = Math.hypot(axVec.x, axVec.y);
        if (lenX < 1e-6) {
            return { isParallel: false, lambda: 0, angleDiffDeg: 0 };
        }

        // 外積 (2D: x1 * y2 - x2 * y1)
        const cross = xVec.x * axVec.y - xVec.y * axVec.x;
        // 内積
        const dot = xVec.x * axVec.x + xVec.y * axVec.y;

        const cosTheta = Math.max(-1, Math.min(1, dot / (lenX * lenAx)));
        const angleDiffRad = Math.acos(cosTheta);
        const angleDiffDeg = (angleDiffRad * 180) / Math.PI;

        // 平行判定（外積が極小、または角度差がほぼ0度か180度）
        const normalizedCross = Math.abs(cross) / (lenX * lenAx);
        const isParallel = normalizedCross < 0.05 || angleDiffDeg < 2 || Math.abs(angleDiffDeg - 180) < 2;

        let lambda = lenAx / lenX;
        if (dot < 0) {
            lambda = -lambda; // 逆向きの場合は負
        }

        return {
            isParallel,
            lambda,
            angleDiffDeg
        };
    }

    // DOM要素の参照キャッシュ
    let domElements = null;

    function getDomElements() {
        if (!domElements) {
            domElements = {
                statusText: document.getElementById('canvas-eigen-status'),
                valX: document.getElementById('val-vector-x'),
                valAx: document.getElementById('val-vector-ax'),
                valAngle: document.getElementById('val-angle-diff'),
                valLambda: document.getElementById('val-lambda'),
                statLambda: document.getElementById('stat-lambda-card'),
                btnPresetEigen1: document.getElementById('btn-preset-eigen1'),
                btnPresetEigen2: document.getElementById('btn-preset-eigen2'),
                btnPresetGeneral: document.getElementById('btn-preset-general'),
                btnModeVector: document.getElementById('btn-mode-vector'),
                btnModeCircle: document.getElementById('btn-mode-circle'),
                btnToggleRotate: document.getElementById('btn-toggle-rotate'),
                btnResetVector: document.getElementById('btn-reset-vector')
            };
        }
        return domElements;
    }

    function updateDomInfo(xVec, axVec, analysis) {
        const dom = getDomElements();
        if (!dom.valX) return;

        dom.valX.textContent = `(${xVec.x.toFixed(2)}, ${xVec.y.toFixed(2)})`;
        dom.valAx.textContent = `(${axVec.x.toFixed(2)}, ${axVec.y.toFixed(2)})`;
        dom.valAngle.textContent = `${analysis.angleDiffDeg.toFixed(1)}°`;

        if (analysis.isParallel) {
            dom.valLambda.textContent = `≈ ${analysis.lambda.toFixed(2)} 倍 (固有ベクトル)`;
            if (dom.statLambda) dom.statLambda.classList.add('vector-stat--eigen');
            if (dom.statusText) {
                dom.statusText.textContent = `【固有ベクトルを検出】A x と x が平行です（倍率 λ ≈ ${analysis.lambda.toFixed(2)}）`;
            }
        } else {
            dom.valLambda.textContent = `方向が変化 (非平行)`;
            if (dom.statLambda) dom.statLambda.classList.remove('vector-stat--eigen');
            if (dom.statusText) {
                dom.statusText.textContent = state.mode === 'vector'
                    ? 'ベクトル先端をドラッグ、またはプリセットボタンで固有ベクトルの方向を確認できます'
                    : '単位円（青点線）が A によって楕円（赤）に引き伸ばされています';
            }
        }
    }

    // p5スケッチインスタンス定義
    const sketch = function (p) {
        let containerElement = null;
        let scaleFactor = 60; // 1単位あたりのピクセル数

        function updateCanvasDimensions() {
            containerElement = document.getElementById('eigen-canvas');
            const clientWidth = containerElement ? containerElement.clientWidth : 0;
            const size = MathByMakingCanvas.calculateCanvasSize(clientWidth, window.innerWidth);
            p.resizeCanvas(size, size);
            scaleFactor = size / 8.5; // [-4, 4] 程度の範囲を表示
        }

        p.setup = function () {
            containerElement = document.getElementById('eigen-canvas');
            const clientWidth = containerElement ? containerElement.clientWidth : 0;
            const size = MathByMakingCanvas.calculateCanvasSize(clientWidth, window.innerWidth);

            const canvas = p.createCanvas(size, size);
            canvas.parent('eigen-canvas');
            canvas.attribute('aria-label', '行列 A によるベクトルの変換と固有直線の幾何学的可視化');

            scaleFactor = size / 8.5;
            p.angleMode(p.RADIANS);

            setupDomHandlers();
        };

        p.windowResized = function () {
            updateCanvasDimensions();
        };

        p.draw = function () {
            p.background(255);

            // 自動回転
            if (state.isAutoRotating && !state.isDragging) {
                state.angle += state.autoRotateSpeed;
                if (state.angle > Math.PI * 2) {
                    state.angle -= Math.PI * 2;
                }
            }

            // 現在のベクトル x
            const xVec = {
                x: state.length * Math.cos(state.angle),
                y: state.length * Math.sin(state.angle)
            };
            // 変換後のベクトル Ax
            const axVec = multiply(matrixA, xVec);
            const analysis = analyzeEigen(xVec, axVec);

            updateDomInfo(xVec, axVec, analysis);

            const cx = p.width / 2;
            const cy = p.height / 2;

            // 数学座標系へ（中心を原点、Y軸上向き）
            p.push();
            p.translate(cx, cy);
            p.scale(1, -1);

            // グリッドと座標軸
            drawGrid(scaleFactor);

            // 固有直線（λ=3: y=x, λ=1: y=-x）の描画
            drawEigenLines(scaleFactor);

            if (state.mode === 'circle') {
                // 単位円と楕円の変換表示
                drawCircleTransformation(scaleFactor);
            }

            // ベクトル x と Ax の描画
            drawVectors(xVec, axVec, analysis, scaleFactor);

            p.pop();

            // キャンバス上の補助テキスト（画面座標系）
            drawCanvasOverlay(analysis);
        };

        // グリッドと座標軸の描画
        function drawGrid(scale) {
            p.stroke(240);
            p.strokeWeight(1);

            const maxCoord = Math.ceil(p.width / (2 * scale));
            for (let i = -maxCoord; i <= maxCoord; i++) {
                if (i === 0) continue;
                p.line(i * scale, -p.height / 2, i * scale, p.height / 2);
                p.line(-p.width / 2, i * scale, p.width / 2, i * scale);
            }

            // 軸線
            p.stroke(200);
            p.strokeWeight(1.5);
            p.line(-p.width / 2, 0, p.width / 2, 0);
            p.line(0, -p.height / 2, 0, p.height / 2);
        }

        // 固有直線（不変部分空間）の描画
        function drawEigenLines(scale) {
            const len = Math.max(p.width, p.height);

            // λ1 = 3 の固有直線: y = x
            p.stroke(59, 130, 246, 120); // 青半透明
            p.strokeWeight(2);
            p.drawingContext.setLineDash([6, 6]);
            p.line(-len, -len, len, len);

            // λ2 = 1 の固有直線: y = -x
            p.stroke(16, 185, 129, 120); // 緑半透明
            p.line(-len, len, len, -len);

            p.drawingContext.setLineDash([]); // 点線リセット
        }

        // 単位円写像（円が楕円に歪む様子の描画）
        function drawCircleTransformation(scale) {
            const steps = 72;

            // 1. 単位円（破線青）
            p.noFill();
            p.stroke(147, 197, 253);
            p.strokeWeight(1.5);
            p.drawingContext.setLineDash([4, 4]);
            p.ellipse(0, 0, 2 * scale, 2 * scale);
            p.drawingContext.setLineDash([]);

            // 2. 変換後の楕円（薄い塗り＋赤枠）
            p.fill(239, 68, 68, 25);
            p.stroke(239, 68, 68, 180);
            p.strokeWeight(2);
            p.beginShape();
            for (let i = 0; i <= steps; i++) {
                const th = (i * Math.PI * 2) / steps;
                const pt = multiply(matrixA, { x: Math.cos(th), y: Math.sin(th) });
                p.vertex(pt.x * scale, pt.y * scale);
            }
            p.endShape(p.CLOSE);

            // 固有ベクトル主軸のガイド
            p.stroke(59, 130, 246, 200);
            p.strokeWeight(2.5);
            // v1 (λ=3 方向)
            const v1Pt = multiply(matrixA, { x: 1 / Math.SQRT2, y: 1 / Math.SQRT2 });
            drawArrow(0, 0, v1Pt.x * scale, v1Pt.y * scale, 8);

            // v2 (λ=1 方向)
            p.stroke(16, 185, 129, 200);
            const v2Pt = multiply(matrixA, { x: -1 / Math.SQRT2, y: 1 / Math.SQRT2 });
            drawArrow(0, 0, v2Pt.x * scale, v2Pt.y * scale, 8);
        }

        // ベクトル x と Ax の描画
        function drawVectors(xVec, axVec, analysis, scale) {
            const screenX = xVec.x * scale;
            const screenY = xVec.y * scale;
            const screenAx = axVec.x * scale;
            const screenAy = axVec.y * scale;

            // 平行時のハイライト帯
            if (analysis.isParallel) {
                p.stroke(245, 158, 11, 80);
                p.strokeWeight(14);
                p.line(0, 0, screenAx, screenAy);
            }

            // 変換後ベクトル Ax（赤色）
            p.stroke(220, 38, 38);
            p.strokeWeight(3.5);
            drawArrow(0, 0, screenAx, screenAy, 12);

            // 元のベクトル x（青色）
            p.stroke(37, 99, 235);
            p.strokeWeight(3.5);
            drawArrow(0, 0, screenX, screenY, 12);

            // ベクトル x 先端のドラッグ用ハンドル
            p.fill(255);
            p.stroke(37, 99, 235);
            p.strokeWeight(2);
            p.circle(screenX, screenY, 14);

            if (analysis.isParallel) {
                p.fill(245, 158, 11);
                p.circle(screenX, screenY, 6);
            }
        }

        // 矢印の描画ヘルパー
        function drawArrow(x1, y1, x2, y2, arrowSize) {
            p.line(x1, y1, x2, y2);
            const angle = Math.atan2(y2 - y1, x2 - x1);
            p.push();
            p.translate(x2, y2);
            p.rotate(angle);
            p.noStroke();
            p.fill(p.drawingContext.strokeStyle);
            p.triangle(0, 0, -arrowSize, arrowSize * 0.45, -arrowSize, -arrowSize * 0.45);
            p.pop();
        }

        // キャンバス上の補助ラベル描画
        function drawCanvasOverlay(analysis) {
            p.fill(71, 85, 105);
            p.noStroke();
            p.textSize(12);
            p.textAlign(p.LEFT, p.TOP);

            // 凡例
            const pad = 12;
            p.text('青: 入力ベクトル x', pad, pad);
            p.text('赤: 変換後ベクトル A x', pad, pad + 18);
            p.text('青破線: 固有直線 (λ = 3, y = x)', pad, pad + 36);
            p.text('緑破線: 固有直線 (λ = 1, y = -x)', pad, pad + 54);

            if (analysis.isParallel) {
                p.fill(180, 83, 9);
                p.textSize(14);
                p.textStyle(p.BOLD);
                p.textAlign(p.RIGHT, p.TOP);
                p.text(`★ 固有ベクトル (λ ≈ ${analysis.lambda.toFixed(2)})`, p.width - pad, pad);
                p.textStyle(p.NORMAL);
            }
        }

        // マウス/タッチ座標から角度と長さを計算
        function handlePointerMove(clientX, clientY) {
            const rect = containerElement.getBoundingClientRect();
            const relX = clientX - rect.left - p.width / 2;
            const relY = -(clientY - rect.top - p.height / 2); // 数学座標系（上向き正）

            state.angle = Math.atan2(relY, relX);
            const dist = Math.hypot(relX, relY) / scaleFactor;
            state.length = Math.max(0.4, Math.min(dist, 2.2));
        }

        // ポインターイベントのハンドリング（操作スコープの局所化・スクロール保護）
        p.mousePressed = function () {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                const cx = p.width / 2;
                const cy = p.height / 2;
                const targetX = cx + state.length * Math.cos(state.angle) * scaleFactor;
                const targetY = cy - state.length * Math.sin(state.angle) * scaleFactor;
                const d = p.dist(p.mouseX, p.mouseY, targetX, targetY);

                // ハンドルの近傍、またはキャンバスをクリック
                if (d < 30 || p.dist(p.mouseX, p.mouseY, cx, cy) < p.width / 2) {
                    state.isDragging = true;
                    state.isAutoRotating = false;
                    updateRotateButton();
                    handlePointerMove(p.mouseX + containerElement.getBoundingClientRect().left, p.mouseY + containerElement.getBoundingClientRect().top);
                }
            }
        };

        p.mouseDragged = function () {
            if (state.isDragging) {
                handlePointerMove(p.mouseX + containerElement.getBoundingClientRect().left, p.mouseY + containerElement.getBoundingClientRect().top);
            }
        };

        p.mouseReleased = function () {
            state.isDragging = false;
        };

        // スクロール保護: グローバルスクロールを絶対にブロックしない
        // touchMoved 等で return false を返さない（ブラウザの縦スクロールを維持）
    };

    function updateRotateButton() {
        const dom = getDomElements();
        if (dom.btnToggleRotate) {
            dom.btnToggleRotate.textContent = state.isAutoRotating ? '一時停止' : '自動回転';
            dom.btnToggleRotate.classList.toggle('active', state.isAutoRotating);
        }
    }

    // UIボタンハンドラーの登録
    function setupDomHandlers() {
        const dom = getDomElements();

        // 固有ベクトル1 (λ=3: (1, 1))
        if (dom.btnPresetEigen1) {
            dom.btnPresetEigen1.addEventListener('click', function () {
                state.angle = Math.PI / 4; // 45度 (y=x)
                state.length = 1.0;
                state.isAutoRotating = false;
                updateRotateButton();
            });
        }

        // 固有ベクトル2 (λ=1: (-1, 1))
        if (dom.btnPresetEigen2) {
            dom.btnPresetEigen2.addEventListener('click', function () {
                state.angle = (3 * Math.PI) / 4; // 135度 (y=-x)
                state.length = 1.0;
                state.isAutoRotating = false;
                updateRotateButton();
            });
        }

        // 一般ベクトル (例: (1, 0) - 回転が起きる)
        if (dom.btnPresetGeneral) {
            dom.btnPresetGeneral.addEventListener('click', function () {
                state.angle = 0; // x軸方向
                state.length = 1.2;
                state.isAutoRotating = false;
                updateRotateButton();
            });
        }

        // ベクトル検証モード
        if (dom.btnModeVector) {
            dom.btnModeVector.addEventListener('click', function () {
                state.mode = 'vector';
                dom.btnModeVector.classList.add('active');
                if (dom.btnModeCircle) dom.btnModeCircle.classList.remove('active');
            });
        }

        // 単位円写像モード
        if (dom.btnModeCircle) {
            dom.btnModeCircle.addEventListener('click', function () {
                state.mode = 'circle';
                dom.btnModeCircle.classList.add('active');
                if (dom.btnModeVector) dom.btnModeVector.classList.remove('active');
            });
        }

        // 自動回転切り替え
        if (dom.btnToggleRotate) {
            dom.btnToggleRotate.addEventListener('click', function () {
                state.isAutoRotating = !state.isAutoRotating;
                updateRotateButton();
            });
        }

        // リセット
        if (dom.btnResetVector) {
            dom.btnResetVector.addEventListener('click', function () {
                state.angle = Math.PI / 6;
                state.length = 1.2;
                state.mode = 'vector';
                state.isAutoRotating = false;
                updateRotateButton();
                if (dom.btnModeVector) dom.btnModeVector.classList.add('active');
                if (dom.btnModeCircle) dom.btnModeCircle.classList.remove('active');
            });
        }
    }

    // 初期化実行
    window.addEventListener('DOMContentLoaded', function () {
        const container = document.getElementById('eigen-canvas');
        if (container) {
            new p5(sketch, container);
        }
    });

})();
