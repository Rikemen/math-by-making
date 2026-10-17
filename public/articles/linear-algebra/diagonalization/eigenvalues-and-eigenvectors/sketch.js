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

    // アプリケーション状態
    const state = {
        mode: 'vector', // 'vector' | 'decomp-std' | 'decomp-eigen' | 'circle'
        angle: 0, // 初期状態: x軸方向 (1, 0)
        length: 1.0, // ベクトル x の長さ
        isDragging: false,
        isAutoRotating: false,
        autoRotateSpeed: 0.008
    };

    function multiply(matrix, vec) {
        return {
            x: matrix[0][0] * vec.x + matrix[0][1] * vec.y,
            y: matrix[1][0] * vec.x + matrix[1][1] * vec.y
        };
    }

    // 固有基底での係数 c1, c2 の計算 (x = c1*v1 + c2*v2, v1=(1,1), v2=(-1,1))
    function getEigenCoordinates(xVec) {
        return {
            c1: (xVec.x + xVec.y) / 2,
            c2: (-xVec.x + xVec.y) / 2
        };
    }

    // 平行判定・角度・長さ・固有値倍率の計算
    function analyzeEigen(xVec, axVec) {
        const lenX = Math.hypot(xVec.x, xVec.y);
        const lenAx = Math.hypot(axVec.x, axVec.y);
        if (lenX < 1e-6) {
            return {
                isParallel: false,
                lambda: 0,
                angleDiffDeg: 0,
                lenX: 0,
                lenAx: 0,
                angleXDeg: 0,
                angleAxDeg: 0,
                eigenType: null
            };
        }

        // 角度（0〜360度）
        const angleXRad = Math.atan2(xVec.y, xVec.x);
        const angleAxRad = Math.atan2(axVec.y, axVec.x);
        const angleXDeg = ((angleXRad * 180) / Math.PI + 360) % 360;
        const angleAxDeg = ((angleAxRad * 180) / Math.PI + 360) % 360;

        // 外積 (2D: x1 * y2 - x2 * y1) と 内積
        const cross = xVec.x * axVec.y - xVec.y * axVec.x;
        const dot = xVec.x * axVec.x + xVec.y * axVec.y;

        const cosTheta = Math.max(-1, Math.min(1, dot / (lenX * lenAx)));
        const angleDiffRad = Math.acos(cosTheta);
        const angleDiffDeg = (angleDiffRad * 180) / Math.PI;

        // 平行判定
        const normalizedCross = Math.abs(cross) / (lenX * lenAx);
        const isParallel = normalizedCross < 0.05 || angleDiffDeg < 2.0 || Math.abs(angleDiffDeg - 180) < 2.0;

        let lambda = lenAx / lenX;
        if (dot < 0) {
            lambda = -lambda;
        }

        let eigenType = null;
        if (isParallel) {
            if (Math.abs(lambda - 3) < 0.3) {
                eigenType = 1; // λ = 3 (y = x)
            } else if (Math.abs(lambda - 1) < 0.3) {
                eigenType = 2; // λ = 1 (y = -x)
            }
        }

        return {
            isParallel,
            lambda,
            angleDiffDeg,
            angleXRad,
            angleAxRad,
            angleXDeg,
            angleAxDeg,
            lenX,
            lenAx,
            eigenType
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
                valLenX: document.getElementById('val-len-x'),
                valLenAx: document.getElementById('val-len-ax'),
                valAngleX: document.getElementById('val-angle-x'),
                valAngleAx: document.getElementById('val-angle-ax'),
                explanationText: document.getElementById('vector-explanation-text'),
                explanationTitle: document.getElementById('vector-explanation-title'),
                explanationCard: document.getElementById('vector-explanation-card'),
                btnPresetEigen1: document.getElementById('btn-preset-eigen1'),
                btnPresetEigen2: document.getElementById('btn-preset-eigen2'),
                btnPresetGeneral: document.getElementById('btn-preset-general'),
                btnModeVector: document.getElementById('btn-mode-vector'),
                btnModeDecompStd: document.getElementById('btn-mode-decomp-std'),
                btnModeDecompEigen: document.getElementById('btn-mode-decomp-eigen'),
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

        if (dom.valLenX) dom.valLenX.textContent = analysis.lenX.toFixed(2);
        if (dom.valLenAx) dom.valLenAx.textContent = analysis.lenAx.toFixed(2);
        if (dom.valAngleX) dom.valAngleX.textContent = `${analysis.angleXDeg.toFixed(1)}°`;
        if (dom.valAngleAx) dom.valAngleAx.textContent = `${analysis.angleAxDeg.toFixed(1)}°`;

        const eigenCoords = getEigenCoordinates(xVec);

        // 1. 単位円写像モード
        if (state.mode === 'circle') {
            dom.valLambda.textContent = `単位円 → 楕円変形`;
            if (dom.statLambda) dom.statLambda.classList.remove('vector-stat--eigen');
            if (dom.statusText) {
                dom.statusText.textContent = '単位円（青破線）が A によって楕円（赤）に引き伸ばされています';
            }
            if (dom.explanationTitle) {
                dom.explanationTitle.textContent = '単位円写像（楕円変形）の幾何学的解釈';
            }
            if (dom.explanationText) {
                dom.explanationText.textContent =
                    '半径 1 の青い単位円が、行列 A によって赤い楕円に変形しています。楕円の最も伸びている長軸は λ₁ = 3 の固有直線（y = x）方向に長さ 3 まで伸び、最も縮んでいる短軸は λ₂ = 1 の固有直線（y = -x）方向に長さ 1 のまま維持されています。';
            }
            if (dom.explanationCard) {
                dom.explanationCard.className = 'vector-explanation-card vector-explanation-card--circle';
            }
            return;
        }

        // 2. 標準基底での分解モード
        if (state.mode === 'decomp-std') {
            dom.valLambda.textContent = `成分の干渉・混合`;
            if (dom.statLambda) dom.statLambda.classList.remove('vector-stat--eigen');
            if (dom.statusText) {
                dom.statusText.textContent = '標準基底での分解: 直交軸が斜めに歪み、x と y の成分が互いに混ざり合います';
            }
            if (dom.explanationTitle) {
                dom.explanationTitle.textContent = '【標準基底での分解】軸の歪みと成分の干渉（混ざり合い）';
            }
            if (dom.explanationText) {
                dom.explanationText.textContent =
                    `入力ベクトル x = ${xVec.x.toFixed(2)} e₁ + ${xVec.y.toFixed(2)} e₂ に対し、変換後ベクトルは A x = ${xVec.x.toFixed(2)}(A e₁) + ${xVec.y.toFixed(2)}(A e₂) = (${axVec.x.toFixed(2)}) e₁ + (${axVec.y.toFixed(2)}) e₂ となります。もとの直角の基底軸が A によって斜めに傾くため、第1成分に (2x + y)、第2成分に (x + 2y) が入り、x 成分と y 成分が混ざり合って互いに干渉します。`;
            }
            if (dom.explanationCard) {
                dom.explanationCard.className = 'vector-explanation-card vector-explanation-card--std';
            }
            return;
        }

        // 3. 固有基底での分解モード
        if (state.mode === 'decomp-eigen') {
            dom.valLambda.textContent = `独立伸縮 (非干渉)`;
            if (dom.statLambda) dom.statLambda.classList.add('vector-stat--eigen');
            if (dom.statusText) {
                dom.statusText.textContent = '固有基底での分解: 軸の向きが不変のまま、各軸方向に独立して 3 倍と 1 倍に伸縮します';
            }
            if (dom.explanationTitle) {
                dom.explanationTitle.textContent = '★【固有ベクトル基底での分解】完全な独立伸縮（対角化の本質）';
            }
            if (dom.explanationText) {
                dom.explanationText.textContent =
                    `入力ベクトル x を固有基底で表すと x = ${eigenCoords.c1.toFixed(2)} v₁ + ${eigenCoords.c2.toFixed(2)} v₂ です。変換後は A x = (3 × ${eigenCoords.c1.toFixed(2)}) v₁ + (1 × ${eigenCoords.c2.toFixed(2)}) v₂ = ${(3 * eigenCoords.c1).toFixed(2)} v₁ + ${(1 * eigenCoords.c2).toFixed(2)} v₂ となります。基底の軸が一切傾かず、v₁ 方向に単独で 3 倍、v₂ 方向に単独で 1 倍されるだけで、成分同士が全く干渉しません！`;
            }
            if (dom.explanationCard) {
                dom.explanationCard.className = 'vector-explanation-card vector-explanation-card--eigen';
            }
            return;
        }

        // 4. 通常の単一ベクトルモード
        if (analysis.isParallel) {
            dom.valLambda.textContent = `≈ ${analysis.lambda.toFixed(2)} 倍 (固有ベクトル)`;
            if (dom.statLambda) dom.statLambda.classList.add('vector-stat--eigen');
            if (dom.statusText) {
                dom.statusText.textContent = `【固有ベクトルを検出】A x と x が平行です（倍率 λ ≈ ${analysis.lambda.toFixed(2)}）`;
            }

            if (analysis.eigenType === 1) {
                if (dom.explanationTitle) dom.explanationTitle.textContent = '★ 固有ベクトル λ₁ = 3（直線 y = x）の挙動';
                if (dom.explanationText) {
                    dom.explanationText.textContent =
                        `入力ベクトル x と変換後ベクトル A x はともに直線 y = x（角度約 45.0°）上にあり、向きが回転しません（回転角 Δθ = ${analysis.angleDiffDeg.toFixed(1)}°）。長さのみが ${analysis.lenX.toFixed(2)} から ${analysis.lenAx.toFixed(2)} へと、ちょうど固有値倍（約 ${analysis.lambda.toFixed(2)} 倍）に引き伸ばされています。`;
                }
            } else if (analysis.eigenType === 2) {
                if (dom.explanationTitle) dom.explanationTitle.textContent = '★ 固有ベクトル λ₂ = 1（直線 y = -x）の挙動';
                if (dom.explanationText) {
                    dom.explanationText.textContent =
                        `入力ベクトル x と変換後ベクトル A x はともに直線 y = -x（角度約 135.0°）上にあり、向きが回転しません（回転角 Δθ = ${analysis.angleDiffDeg.toFixed(1)}°）。長さも ${analysis.lenX.toFixed(2)} のまま等倍（約 ${analysis.lambda.toFixed(2)} 倍）で維持されています。`;
                }
            } else {
                if (dom.explanationTitle) dom.explanationTitle.textContent = `★ 固有ベクトルの検出（λ ≈ ${analysis.lambda.toFixed(2)}）`;
                if (dom.explanationText) {
                    dom.explanationText.textContent =
                        `入力ベクトル x と変換後ベクトル A x が同一直線上に並びました。回転角 Δθ = ${analysis.angleDiffDeg.toFixed(1)}°（向き不変）であり、長さが ${analysis.lenX.toFixed(2)} から ${analysis.lenAx.toFixed(2)} へと ${analysis.lambda.toFixed(2)} 倍に変化しています。`;
                }
            }

            if (dom.explanationCard) {
                dom.explanationCard.className = 'vector-explanation-card vector-explanation-card--eigen';
            }
        } else {
            dom.valLambda.textContent = `方向が変化 (非平行)`;
            if (dom.statLambda) dom.statLambda.classList.remove('vector-stat--eigen');
            if (dom.statusText) {
                dom.statusText.textContent = 'ベクトル先端をドラッグ、またはプリセットボタンで固有ベクトルの方向を確認できます';
            }

            const isStandardE1 = Math.abs(xVec.x - 1.0) < 0.1 && Math.abs(xVec.y - 0.0) < 0.1;
            if (isStandardE1) {
                if (dom.explanationTitle) dom.explanationTitle.textContent = '一般ベクトル（標準基底 e₁ = (1, 0)ᵀ）の幾何学的変化';
                if (dom.explanationText) {
                    dom.explanationText.textContent =
                        `元のベクトル x は x 軸正の向き（角度 0.0°）を向いていましたが、変換後のベクトル A x は角度約 ${analysis.angleAxDeg.toFixed(1)}° の方向を向き、長さも ${analysis.lenX.toFixed(2)} から ${analysis.lenAx.toFixed(2)}（√5 ≈ 2.24）へと変化しました（回転角 Δθ = ${analysis.angleDiffDeg.toFixed(1)}°）。このように、一般のベクトルに行列を掛けると「長さ」だけでなく「向き（角度）」も回転して変化します。`;
                }
            } else {
                if (dom.explanationTitle) dom.explanationTitle.textContent = '一般ベクトルの幾何学的変化（回転と伸縮）';
                if (dom.explanationText) {
                    dom.explanationText.textContent =
                        `入力ベクトル x（角度 ${analysis.angleXDeg.toFixed(1)}°、長さ ${analysis.lenX.toFixed(2)}）に対し、変換後のベクトル A x は角度約 ${analysis.angleAxDeg.toFixed(1)}° の方向を向き、長さも ${analysis.lenX.toFixed(2)} から ${analysis.lenAx.toFixed(2)} へと変化しました（回転角 Δθ = ${analysis.angleDiffDeg.toFixed(1)}°）。向きが変化するため固有ベクトルではありません。`;
                }
            }

            if (dom.explanationCard) {
                dom.explanationCard.className = 'vector-explanation-card';
            }
        }
    }

    // p5スケッチインスタンス定義
    const sketch = function (p) {
        let containerElement = null;
        let scaleFactor = 60;

        function updateCanvasDimensions() {
            containerElement = document.getElementById('eigen-canvas');
            const clientWidth = containerElement ? containerElement.clientWidth : 0;
            const size = MathByMakingCanvas.calculateCanvasSize(clientWidth, window.innerWidth);
            p.resizeCanvas(size, size);
            scaleFactor = size / 8.5;
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

            // 数学座標系へ
            p.push();
            p.translate(cx, cy);
            p.scale(1, -1);

            // グリッドと座標軸
            drawGrid(scaleFactor);

            // 固有直線（λ=3: y=x, λ=1: y=-x）の描画
            drawEigenLines(scaleFactor);

            if (state.mode === 'circle') {
                drawCircleTransformation(scaleFactor);
            } else if (state.mode === 'decomp-std') {
                drawStandardDecomposition(xVec, axVec, scaleFactor);
            } else if (state.mode === 'decomp-eigen') {
                drawEigenDecomposition(xVec, axVec, scaleFactor);
            }

            // 回転アークと主ベクトル描画
            drawRotationArc(xVec, axVec, analysis, scaleFactor);
            drawVectors(xVec, axVec, analysis, scaleFactor);

            p.pop();

            // オーバーレイ表示
            drawCanvasOverlay(analysis, xVec, axVec);
        };

        // グリッドと座標軸
        function drawGrid(scale) {
            p.stroke(242);
            p.strokeWeight(1);

            const maxCoord = Math.ceil(p.width / (2 * scale));
            for (let i = -maxCoord; i <= maxCoord; i++) {
                if (i === 0) continue;
                p.line(i * scale, -p.height / 2, i * scale, p.height / 2);
                p.line(-p.width / 2, i * scale, p.width / 2, i * scale);
            }

            p.stroke(205);
            p.strokeWeight(1.5);
            p.line(-p.width / 2, 0, p.width / 2, 0);
            p.line(0, -p.height / 2, 0, p.height / 2);
        }

        // 固有直線
        function drawEigenLines(scale) {
            const len = Math.max(p.width, p.height);

            // y = x (λ = 3)
            p.stroke(59, 130, 246, 110);
            p.strokeWeight(2);
            p.drawingContext.setLineDash([6, 6]);
            p.line(-len, -len, len, len);

            // y = -x (λ = 1)
            p.stroke(16, 185, 129, 110);
            p.line(-len, len, len, -len);

            p.drawingContext.setLineDash([]);
        }

        // 1. 標準基底での分解描画 (decomp-std)
        function drawStandardDecomposition(xVec, axVec, scale) {
            // x の成分: (x, 0) と (0, y)
            const x1 = { x: xVec.x, y: 0 };
            const x2 = { x: 0, y: xVec.y };

            // Ax の標準基底成分: x*(Ae1) = x*(2, 1) と y*(Ae2) = y*(1, 2)
            const ax1 = { x: xVec.x * 2, y: xVec.x * 1 };
            const ax2 = { x: xVec.y * 1, y: xVec.y * 2 };

            // 1. x の分解（青破線長方形）
            p.stroke(37, 99, 235, 120);
            p.strokeWeight(1.5);
            p.drawingContext.setLineDash([3, 3]);
            p.line(x1.x * scale, 0, xVec.x * scale, xVec.y * scale);
            p.line(0, x2.y * scale, xVec.x * scale, xVec.y * scale);

            // 成分矢印 (青系統)
            p.stroke(96, 165, 250);
            p.strokeWeight(2.5);
            drawArrow(0, 0, x1.x * scale, 0, 8);
            drawArrow(0, 0, 0, x2.y * scale, 8);

            // 2. Ax の分解（赤破線平行四辺形: 基底が歪んでいる！）
            p.stroke(220, 38, 38, 120);
            p.strokeWeight(1.5);
            p.drawingContext.setLineDash([3, 3]);
            p.line(ax1.x * scale, ax1.y * scale, axVec.x * scale, axVec.y * scale);
            p.line(ax2.x * scale, ax2.y * scale, axVec.x * scale, axVec.y * scale);

            // 変換後基底成分矢印（赤系）
            p.stroke(248, 113, 113);
            p.strokeWeight(2.5);
            drawArrow(0, 0, ax1.x * scale, ax1.y * scale, 8);
            drawArrow(0, 0, ax2.x * scale, ax2.y * scale, 8);

            p.drawingContext.setLineDash([]);
        }

        // 2. 固有ベクトル基底での分解描画 (decomp-eigen)
        function drawEigenDecomposition(xVec, axVec, scale) {
            const coords = getEigenCoordinates(xVec);

            // x の固有基底成分: c1*v1 と c2*v2 (v1=(1,1), v2=(-1,1))
            const w1 = { x: coords.c1 * 1, y: coords.c1 * 1 };
            const w2 = { x: coords.c2 * -1, y: coords.c2 * 1 };

            // Ax の固有基底成分: 3*c1*v1 と 1*c2*v2 (軸が変わらない！)
            const aw1 = { x: 3 * coords.c1 * 1, y: 3 * coords.c1 * 1 };
            const aw2 = { x: 1 * coords.c2 * -1, y: 1 * coords.c2 * 1 };

            // 1. x の分解（斜交平行四辺形）
            p.stroke(37, 99, 235, 130);
            p.strokeWeight(1.5);
            p.drawingContext.setLineDash([4, 4]);
            p.line(w1.x * scale, w1.y * scale, xVec.x * scale, xVec.y * scale);
            p.line(w2.x * scale, w2.y * scale, xVec.x * scale, xVec.y * scale);

            // 成分ベクトル矢印
            p.stroke(59, 130, 246);
            p.strokeWeight(2.5);
            drawArrow(0, 0, w1.x * scale, w1.y * scale, 8);
            p.stroke(16, 185, 129);
            drawArrow(0, 0, w2.x * scale, w2.y * scale, 8);

            // 2. Ax の分解（同じ固有直線上で単に 3倍と 1倍に伸びる！）
            p.stroke(220, 38, 38, 130);
            p.strokeWeight(1.5);
            p.drawingContext.setLineDash([4, 4]);
            p.line(aw1.x * scale, aw1.y * scale, axVec.x * scale, axVec.y * scale);
            p.line(aw2.x * scale, aw2.y * scale, axVec.x * scale, axVec.y * scale);

            // 変換後の固有軸成分
            p.stroke(37, 99, 235, 220); // λ=3 軸上の成分 (3倍)
            p.strokeWeight(3.5);
            drawArrow(0, 0, aw1.x * scale, aw1.y * scale, 9);

            p.stroke(16, 185, 129, 220); // λ=1 軸上の成分 (1倍)
            p.strokeWeight(3.5);
            drawArrow(0, 0, aw2.x * scale, aw2.y * scale, 9);

            p.drawingContext.setLineDash([]);
        }

        // 3. 単位円写像描画
        function drawCircleTransformation(scale) {
            const steps = 72;

            p.noFill();
            p.stroke(147, 197, 253);
            p.strokeWeight(1.5);
            p.drawingContext.setLineDash([4, 4]);
            p.ellipse(0, 0, 2 * scale, 2 * scale);
            p.drawingContext.setLineDash([]);

            p.fill(239, 68, 68, 22);
            p.stroke(239, 68, 68, 180);
            p.strokeWeight(2);
            p.beginShape();
            for (let i = 0; i <= steps; i++) {
                const th = (i * Math.PI * 2) / steps;
                const pt = multiply(matrixA, { x: Math.cos(th), y: Math.sin(th) });
                p.vertex(pt.x * scale, pt.y * scale);
            }
            p.endShape(p.CLOSE);

            p.stroke(59, 130, 246, 200);
            p.strokeWeight(2.5);
            const v1Pt = multiply(matrixA, { x: 1 / Math.SQRT2, y: 1 / Math.SQRT2 });
            drawArrow(0, 0, v1Pt.x * scale, v1Pt.y * scale, 8);

            p.stroke(16, 185, 129, 200);
            const v2Pt = multiply(matrixA, { x: -1 / Math.SQRT2, y: 1 / Math.SQRT2 });
            drawArrow(0, 0, v2Pt.x * scale, v2Pt.y * scale, 8);
        }

        // 回転角アーク
        function drawRotationArc(xVec, axVec, analysis, scale) {
            if (analysis.isParallel || analysis.angleDiffDeg < 1.0) return;

            const arcRadius = Math.min(scale * 0.7, 45);
            let startAng = analysis.angleXRad;
            let endAng = analysis.angleAxRad;

            let diff = endAng - startAng;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            p.noFill();
            p.stroke(245, 158, 11, 200);
            p.strokeWeight(2);
            p.drawingContext.setLineDash([3, 3]);

            if (diff >= 0) {
                p.arc(0, 0, arcRadius * 2, arcRadius * 2, startAng, startAng + diff);
            } else {
                p.arc(0, 0, arcRadius * 2, arcRadius * 2, startAng + diff, startAng);
            }
            p.drawingContext.setLineDash([]);
        }

        // ベクトル x と Ax の描画
        function drawVectors(xVec, axVec, analysis, scale) {
            const screenX = xVec.x * scale;
            const screenY = xVec.y * scale;
            const screenAx = axVec.x * scale;
            const screenAy = axVec.y * scale;

            if (analysis.isParallel) {
                p.stroke(245, 158, 11, 75);
                p.strokeWeight(14);
                p.line(0, 0, screenAx, screenAy);
            }

            // Ax (赤)
            p.stroke(220, 38, 38);
            p.strokeWeight(3.5);
            drawArrow(0, 0, screenAx, screenAy, 12);

            // x (青)
            p.stroke(37, 99, 235);
            p.strokeWeight(3.5);
            drawArrow(0, 0, screenX, screenY, 12);

            // 先端ハンドル
            p.fill(255);
            p.stroke(37, 99, 235);
            p.strokeWeight(2);
            p.circle(screenX, screenY, 14);

            if (analysis.isParallel) {
                p.fill(245, 158, 11);
                p.circle(screenX, screenY, 6);
            }
        }

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

        // オーバーレイ
        function drawCanvasOverlay(analysis, xVec, axVec) {
            const cx = p.width / 2;
            const cy = p.height / 2;
            const screenX = cx + xVec.x * scaleFactor;
            const screenY = cy - xVec.y * scaleFactor;
            const screenAx = cx + axVec.x * scaleFactor;
            const screenAy = cy - axVec.y * scaleFactor;

            p.textSize(11);
            p.textStyle(p.BOLD);

            p.fill(37, 99, 235);
            p.noStroke();
            p.textAlign(p.LEFT, p.BOTTOM);
            p.text(`x (${analysis.lenX.toFixed(2)}, ${analysis.angleXDeg.toFixed(1)}°)`, screenX + 8, screenY - 6);

            p.fill(220, 38, 38);
            p.textAlign(p.LEFT, p.TOP);
            p.text(`Ax (${analysis.lenAx.toFixed(2)}, ${analysis.angleAxDeg.toFixed(1)}°)`, screenAx + 8, screenAy + 6);

            p.textStyle(p.NORMAL);

            // 凡例表示（左上）
            p.fill(71, 85, 105);
            p.textSize(12);
            p.textAlign(p.LEFT, p.TOP);

            const pad = 12;
            p.text('青: 入力ベクトル x', pad, pad);
            p.text('赤: 変換後ベクトル A x', pad, pad + 18);
            p.text('青破線: 固有直線 (λ = 3, y = x)', pad, pad + 36);
            p.text('緑破線: 固有直線 (λ = 1, y = -x)', pad, pad + 54);

            // 右上ステータス
            if (state.mode === 'decomp-std') {
                p.fill(194, 65, 12);
                p.textSize(12);
                p.textStyle(p.BOLD);
                p.textAlign(p.RIGHT, p.TOP);
                p.text('標準基底: 軸の歪みと成分の干渉', p.width - pad, pad);
                p.textSize(11);
                p.text('x と y が両方の軸に混ざる', p.width - pad, pad + 18);
                p.textStyle(p.NORMAL);
            } else if (state.mode === 'decomp-eigen') {
                p.fill(6, 95, 70);
                p.textSize(12);
                p.textStyle(p.BOLD);
                p.textAlign(p.RIGHT, p.TOP);
                p.text('★ 固有基底: 完全な独立伸縮', p.width - pad, pad);
                p.textSize(11);
                p.text('v₁ 方向 3倍 / v₂ 方向 1倍 (非干渉)', p.width - pad, pad + 18);
                p.textStyle(p.NORMAL);
            } else if (analysis.isParallel) {
                p.fill(180, 83, 9);
                p.textSize(13);
                p.textStyle(p.BOLD);
                p.textAlign(p.RIGHT, p.TOP);
                p.text(`★ 固有ベクトル (λ ≈ ${analysis.lambda.toFixed(2)})`, p.width - pad, pad);
                p.textSize(11);
                p.text(`回転なし: Δθ = 0.0° (${analysis.lenX.toFixed(2)} → ${analysis.lenAx.toFixed(2)})`, p.width - pad, pad + 18);
                p.textStyle(p.NORMAL);
            } else {
                p.fill(180, 83, 9);
                p.textSize(12);
                p.textStyle(p.BOLD);
                p.textAlign(p.RIGHT, p.TOP);
                p.text(`回転角 Δθ = ${analysis.angleDiffDeg.toFixed(1)}°`, p.width - pad, pad);
                p.textSize(11);
                p.text(`長: ${analysis.lenX.toFixed(2)} → ${analysis.lenAx.toFixed(2)}`, p.width - pad, pad + 18);
                p.textStyle(p.NORMAL);
            }
        }

        function handlePointerMove(clientX, clientY) {
            const rect = containerElement.getBoundingClientRect();
            const relX = clientX - rect.left - p.width / 2;
            const relY = -(clientY - rect.top - p.height / 2);

            state.angle = Math.atan2(relY, relX);
            const dist = Math.hypot(relX, relY) / scaleFactor;
            state.length = Math.max(0.4, Math.min(dist, 2.2));
        }

        p.mousePressed = function () {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                const cx = p.width / 2;
                const cy = p.height / 2;
                const targetX = cx + state.length * Math.cos(state.angle) * scaleFactor;
                const targetY = cy - state.length * Math.sin(state.angle) * scaleFactor;
                const d = p.dist(p.mouseX, p.mouseY, targetX, targetY);

                if (d < 35 || p.dist(p.mouseX, p.mouseY, cx, cy) < p.width / 2) {
                    state.isDragging = true;
                    state.isAutoRotating = false;
                    updateRotateButton();
                    handlePointerMove(
                        p.mouseX + containerElement.getBoundingClientRect().left,
                        p.mouseY + containerElement.getBoundingClientRect().top
                    );
                }
            }
        };

        p.mouseDragged = function () {
            if (state.isDragging) {
                handlePointerMove(
                    p.mouseX + containerElement.getBoundingClientRect().left,
                    p.mouseY + containerElement.getBoundingClientRect().top
                );
            }
        };

        p.mouseReleased = function () {
            state.isDragging = false;
        };
    };

    function updateRotateButton() {
        const dom = getDomElements();
        if (dom.btnToggleRotate) {
            dom.btnToggleRotate.textContent = state.isAutoRotating ? '一時停止' : '自動回転';
            dom.btnToggleRotate.classList.toggle('active', state.isAutoRotating);
        }
    }

    function setActiveModeButton(activeBtn) {
        const dom = getDomElements();
        const modeButtons = [
            dom.btnModeVector,
            dom.btnModeDecompStd,
            dom.btnModeDecompEigen,
            dom.btnModeCircle
        ];
        modeButtons.forEach(function (btn) {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
    }

    // UIボタンハンドラーの登録
    function setupDomHandlers() {
        const dom = getDomElements();

        if (dom.btnPresetEigen1) {
            dom.btnPresetEigen1.addEventListener('click', function () {
                state.angle = Math.PI / 4;
                state.length = 1.0;
                state.isAutoRotating = false;
                updateRotateButton();
            });
        }

        if (dom.btnPresetEigen2) {
            dom.btnPresetEigen2.addEventListener('click', function () {
                state.angle = (3 * Math.PI) / 4;
                state.length = 1.0;
                state.isAutoRotating = false;
                updateRotateButton();
            });
        }

        if (dom.btnPresetGeneral) {
            dom.btnPresetGeneral.addEventListener('click', function () {
                state.angle = 0;
                state.length = 1.0;
                state.isAutoRotating = false;
                updateRotateButton();
            });
        }

        // 単一ベクトルモード
        if (dom.btnModeVector) {
            dom.btnModeVector.addEventListener('click', function () {
                state.mode = 'vector';
                setActiveModeButton(dom.btnModeVector);
            });
        }

        // 標準基底での分解モード
        if (dom.btnModeDecompStd) {
            dom.btnModeDecompStd.addEventListener('click', function () {
                state.mode = 'decomp-std';
                setActiveModeButton(dom.btnModeDecompStd);
            });
        }

        // 固有基底での分解モード
        if (dom.btnModeDecompEigen) {
            dom.btnModeDecompEigen.addEventListener('click', function () {
                state.mode = 'decomp-eigen';
                setActiveModeButton(dom.btnModeDecompEigen);
            });
        }

        // 単位円写像モード
        if (dom.btnModeCircle) {
            dom.btnModeCircle.addEventListener('click', function () {
                state.mode = 'circle';
                setActiveModeButton(dom.btnModeCircle);
            });
        }

        if (dom.btnToggleRotate) {
            dom.btnToggleRotate.addEventListener('click', function () {
                state.isAutoRotating = !state.isAutoRotating;
                updateRotateButton();
            });
        }

        if (dom.btnResetVector) {
            dom.btnResetVector.addEventListener('click', function () {
                state.angle = 0;
                state.length = 1.0;
                state.mode = 'vector';
                state.isAutoRotating = false;
                updateRotateButton();
                setActiveModeButton(dom.btnModeVector);
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
