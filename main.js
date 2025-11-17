// Global variables
let currentImage = null;
let originalImageData = null;

// Navigation function
function navigateTo(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load image to canvas when navigating
        if (currentImage && pageId !== 'home-page') {
            loadImageToPage(pageId);
        }
    }
}

// Load image to specific page canvas
function loadImageToPage(pageId) {
    let canvasId;
    
    switch(pageId) {
        case 'filter-page':
            canvasId = 'filter-canvas';
            break;
        case 'sobel-page':
            canvasId = 'sobel-canvas';
            break;
        case 'histogram-page':
            canvasId = 'histogram-source-canvas';
            break;
        default:
            return;
    }
    
    const canvas = document.getElementById(canvasId);
    if (canvas && currentImage) {
        drawImageOnCanvas(canvas, currentImage);
        
        // Store original image data for reset
        const ctx = canvas.getContext('2d');
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}

// Draw image on canvas
function drawImageOnCanvas(canvas, img) {
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}

// Download image
function downloadImage(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('SIPS Application Loaded');
    
    // Image upload handler
    const imageInput = document.getElementById('image-input');
    const fileInfo = document.getElementById('file-info');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    currentImage = img;
                    fileInfo.textContent = `✓ ${file.name} berhasil dimuat`;
                    fileInfo.style.color = '#2563eb';
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Check if we're on mobile
    if (window.innerWidth < 768) {
        console.log('Mobile device detected');
    }
});

// Filter functions
function applyGrayscale() {
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyInvert() {
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyBrightness(value) {
    document.getElementById('brightness-value').textContent = value;
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
    }
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const brightness = parseInt(value);
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] += brightness;
        data[i + 1] += brightness;
        data[i + 2] += brightness;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function resetFilter() {
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    if (currentImage) {
        drawImageOnCanvas(canvas, currentImage);
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    document.getElementById('brightness-slider').value = 0;
    document.getElementById('brightness-value').textContent = '0';
}

// Sobel Edge Detection
function applySobel() {
    const canvas = document.getElementById('sobel-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Convert to grayscale first
    const gray = new Uint8ClampedArray(width * height);
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        gray[i / 4] = avg;
    }
    
    // Sobel kernels
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;
            
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixel = gray[(y + ky) * width + (x + kx)];
                    gx += pixel * sobelX[ky + 1][kx + 1];
                    gy += pixel * sobelY[ky + 1][kx + 1];
                }
            }
            
            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const idx = (y * width + x) * 4;
            output[idx] = output[idx + 1] = output[idx + 2] = magnitude;
            output[idx + 3] = 255;
        }
    }
    
    for (let i = 0; i < data.length; i++) {
        data[i] = output[i];
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function resetSobel() {
    const canvas = document.getElementById('sobel-canvas');
    if (currentImage) {
        drawImageOnCanvas(canvas, currentImage);
    }
}

// Histogram functions
function calculateHistogram() {
    const canvas = document.getElementById('histogram-source-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const histR = new Array(256).fill(0);
    const histG = new Array(256).fill(0);
    const histB = new Array(256).fill(0);
    
    for (let i = 0; i < data.length; i += 4) {
        histR[data[i]]++;
        histG[data[i + 1]]++;
        histB[data[i + 2]]++;
    }
    
    drawHistogram(histR, histG, histB);
}

function drawHistogram(histR, histG, histB) {
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 768;
    canvas.height = 300;
    
    const maxVal = Math.max(...histR, ...histG, ...histB);
    const barWidth = canvas.width / 256;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Red
    ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
    for (let i = 0; i < 256; i++) {
        const barHeight = (histR[i] / maxVal) * canvas.height;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
    }
    
    // Draw Green
    ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
    for (let i = 0; i < 256; i++) {
        const barHeight = (histG[i] / maxVal) * canvas.height;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
    }
    
    // Draw Blue
    ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
    for (let i = 0; i < 256; i++) {
        const barHeight = (histB[i] / maxVal) * canvas.height;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
    }
}

function resetHistogram() {
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}