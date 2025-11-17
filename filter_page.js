// Filter page functions

function applyGrayscale() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('filter-canvas');
    const imageData = getImageData(canvas);
    const filtered = grayscaleFilter(imageData);
    putImageData(canvas, filtered);
}

function applyInvert() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('filter-canvas');
    const imageData = getImageData(canvas);
    const filtered = invertFilter(imageData);
    putImageData(canvas, filtered);
}

function applyBrightness(value) {
    if (!currentImage || !originalImageData) {
        return;
    }
    
    document.getElementById('brightness-value').textContent = value;
    
    const canvas = document.getElementById('filter-canvas');
    const imageData = cloneImageData(originalImageData);
    const filtered = brightnessFilter(imageData, parseInt(value));
    putImageData(canvas, filtered);
}

function resetFilter() {
    if (!currentImage) {
        return;
    }
    
    const canvas = document.getElementById('filter-canvas');
    drawImageOnCanvas(canvas, currentImage);
    
    const ctx = canvas.getContext('2d');
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Reset brightness slider
    document.getElementById('brightness-slider').value = 0;
    document.getElementById('brightness-value').textContent = '0';
}

// Helper function to clone image data
function cloneImageData(imageData) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}