/**
 * ベクトル空間の要素（VectorSpace Element）が満たすべき共通インターフェース
 */
class VectorSpaceElement {
    add(other) {
        throw new Error("add(other) メソッドを実装してください");
    }

    scale(scalar) {
        throw new Error("scale(scalar) メソッドを実装してください");
    }

    toArray() {
        throw new Error("toArray() メソッドを実装してください");
    }

    static getDimension(elements) {
        if (!elements || elements.length === 0) return 0;
        let vectors = elements.map(e => e.toArray());
        let maxDim = Math.max(...vectors.map(v => v.length));
        vectors = vectors.map(v => {
            let padded = [...v];
            while (padded.length < maxDim) padded.push(0);
            return padded;
        });

        let matrix = new Matrix(vectors.length, maxDim);
        matrix.set(vectors);
        return matrix.rank();
    }

    static isLinearlyIndependent(elements) {
        if (!elements || elements.length === 0) return true;
        return this.getDimension(elements) === elements.length;
    }

    static isBasis(elements, spaceDimension) {
        if (!elements) return false;
        if (elements.length !== spaceDimension) return false;
        return this.getDimension(elements) === spaceDimension;
    }

    static getChangeOfBasisMatrix(newBasis, oldBasis = null) {
        if (!newBasis || newBasis.length === 0) {
            throw new Error("新しい基底が指定されていません。");
        }

        const createMatrixFromBasis = (basis) => {
            const vectors = basis.map(e => e.toArray());
            const rows = vectors[0].length;
            const cols = basis.length;
            const matrix = new Matrix(rows, cols);
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    matrix.data[i][j] = vectors[j][i];
                }
            }
            return matrix;
        };

        const eNew = createMatrixFromBasis(newBasis);
        if (!oldBasis) {
            return eNew;
        }

        const eOld = createMatrixFromBasis(oldBasis);
        const eOldInv = eOld.inverse();
        return Matrix.multiplyMatrices(eOldInv, eNew);
    }
}
