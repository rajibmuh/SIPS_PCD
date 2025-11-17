// Sobel page functions

function applySobel() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('sobel-canvas');
    const imageData = getImageData(canvas);
    
    // Apply sobel edge detection
    const edgeData = sobelEdgeDetection(imageData);
    putImageData(canvas, edgeData);
}

function resetSobel() {
    if (!currentImage) {
        return;
    }
    
    const canvas = document.getElementById('sobel-canvas');
    drawImageOnCanvas(canvas, currentImage);
    
    const ctx = canvas.getContext('2d');
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}