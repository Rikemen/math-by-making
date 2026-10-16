const calculateCanvasSize = (containerWidth, viewportWidth) => {
    const maxSize = 600;
    const horizontalGutter = 32;
    const safeViewportWidth = Number.isFinite(viewportWidth) && viewportWidth > 0
        ? viewportWidth
        : maxSize + horizontalGutter;
    const viewportAvailable = Math.max(1, Math.floor(safeViewportWidth - horizontalGutter));
    const containerAvailable = Number.isFinite(containerWidth) && containerWidth > 0
        ? Math.floor(containerWidth)
        : viewportAvailable;

    return Math.max(1, Math.min(containerAvailable, viewportAvailable, maxSize));
};

globalThis.MathByMakingCanvas = Object.freeze({ calculateCanvasSize });
