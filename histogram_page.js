// Histogram page functions

function calculateHistogram() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('histogram-source-canvas');
    const imageData = getImageData(canvas);
    
    // Calculate RGB histogram
    const histogram = computeHistogram(imageData);
    
    // Draw histogram
    drawHistogram(histogram);
}

function resetHistogram() {
    if (!currentImage) {
        return;
    }
    
    const canvas = document.getElementById('histogram-source-canvas');
    drawImageOnCanvas(canvas, currentImage);
    
    const ctx = canvas.getContext('2d');
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Clear histogram canvas
    const histCanvas = document.getElementById('histogram-canvas');
    const histCtx = histCanvas.getContext('2d');
    histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);
}