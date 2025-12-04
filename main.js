// main.js - VERSI FINAL SIPS
// Simple Image Processing Studio

// ===== GLOBAL VARIABLES =====
let currentImage = null;
let originalImageData = null;

// ===== NAVIGATION & INITIALIZATION =====

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
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        alert('Canvas tidak ditemukan!');
        return;
    }
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ===== FILTER FUNCTIONS =====

// Grayscale Filter
function applyGrayscale() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
        // Alpha unchanged
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Invert Filter
function applyInvert() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
        // Alpha unchanged
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Sepia Filter
function applySepia() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Sepia formula
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Brightness Filter
function applyBrightness(value) {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    document.getElementById('brightness-value').textContent = value;
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    
    // Restore original image first
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
    }
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const brightness = parseInt(value);
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = clamp(data[i] + brightness);         // R
        data[i + 1] = clamp(data[i + 1] + brightness); // G
        data[i + 2] = clamp(data[i + 2] + brightness); // B
        // Alpha unchanged
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Helper function to clamp value between 0-255
function clamp(value) {
    return Math.max(0, Math.min(255, value));
}

// Reset Filter
function resetFilter() {
    if (!currentImage) {
        alert('Belum ada gambar yang dimuat!');
        return;
    }
    
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    
    drawImageOnCanvas(canvas, currentImage);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Reset brightness slider
    document.getElementById('brightness-slider').value = 0;
    document.getElementById('brightness-value').textContent = '0';
}

// ===== SOBEL EDGE DETECTION =====

// Apply Sobel Edge Detection
function applySobel() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('sobel-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Convert to grayscale first
    const gray = new Uint8ClampedArray(width * height);
    for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        gray[i / 4] = avg;
    }
    
    // Sobel kernels
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;
            
            // Apply convolution with Sobel kernels
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixel = gray[(y + ky) * width + (x + kx)];
                    gx += pixel * sobelX[ky + 1][kx + 1];
                    gy += pixel * sobelY[ky + 1][kx + 1];
                }
            }
            
            // Calculate gradient magnitude
            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const idx = (y * width + x) * 4;
            const clampedMagnitude = Math.min(255, magnitude);
            
            output[idx] = clampedMagnitude;     // R
            output[idx + 1] = clampedMagnitude; // G
            output[idx + 2] = clampedMagnitude; // B
            output[idx + 3] = 255;              // A
        }
    }
    
    // Copy output to canvas
    for (let i = 0; i < data.length; i++) {
        data[i] = output[i];
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Reset Sobel
function resetSobel() {
    if (!currentImage) {
        alert('Belum ada gambar yang dimuat!');
        return;
    }
    
    const canvas = document.getElementById('sobel-canvas');
    drawImageOnCanvas(canvas, currentImage);
}

// ===== HISTOGRAM FUNCTIONS =====

// Calculate Histogram
function calculateHistogram() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('histogram-source-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Initialize histogram arrays
    const histogram = {
        red: new Array(256).fill(0),
        green: new Array(256).fill(0),
        blue: new Array(256).fill(0)
    };
    
    // Count frequency of each pixel value
    for (let i = 0; i < data.length; i += 4) {
        histogram.red[data[i]]++;
        histogram.green[data[i + 1]]++;
        histogram.blue[data[i + 2]]++;
    }
    
    // Check which mode is selected
    const mode = document.querySelector('input[name="histogram-mode"]:checked')?.value || 'overlay';
    
    if (mode === 'overlay') {
        drawHistogramOverlay(histogram);
    } else {
        drawHistogramSeparated(histogram);
    }
}

// MODE 1: Histogram Overlay (3 colors combined)
function drawHistogramOverlay(histogram) {
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 900;
    canvas.height = 400;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Define margins
    const margin = { top: 30, right: 30, bottom: 60, left: 70 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    // Find max value for scaling
    const maxRed = Math.max(...histogram.red);
    const maxGreen = Math.max(...histogram.green);
    const maxBlue = Math.max(...histogram.blue);
    const maxValue = Math.max(maxRed, maxGreen, maxBlue);
    
    const barWidth = chartWidth / 256;
    const heightScale = chartHeight / maxValue;
    
    // Save context and translate to chart area
    ctx.save();
    ctx.translate(margin.left, margin.top);
    
    // Draw grid and Y-axis labels
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    const ySteps = 10;
    for (let i = 0; i <= ySteps; i++) {
        const y = chartHeight * (i / ySteps);
        const value = Math.round(maxValue * (ySteps - i) / ySteps);
        
        // Draw grid line
        ctx.strokeStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartWidth, y);
        ctx.stroke();
        
        // Draw Y-axis label
        ctx.fillStyle = '#333';
        ctx.fillText(value.toLocaleString('id-ID'), -10, y);
    }
    
    // Draw Y-axis line
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, chartHeight);
    ctx.stroke();
    
    // Draw X-axis line
    ctx.beginPath();
    ctx.moveTo(0, chartHeight);
    ctx.lineTo(chartWidth, chartHeight);
    ctx.stroke();
    
    // Draw histograms with transparency
    for (let i = 0; i < 256; i++) {
        const x = i * barWidth;
        
        // Red
        const redHeight = histogram.red[i] * heightScale;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.fillRect(x, chartHeight - redHeight, barWidth, redHeight);
        
        // Green
        const greenHeight = histogram.green[i] * heightScale;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
        ctx.fillRect(x, chartHeight - greenHeight, barWidth, greenHeight);
        
        // Blue
        const blueHeight = histogram.blue[i] * heightScale;
        ctx.fillStyle = 'rgba(0, 0, 255, 0.6)';
        ctx.fillRect(x, chartHeight - blueHeight, barWidth, blueHeight);
    }
    
    // Draw X-axis labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const xSteps = 8;
    for (let i = 0; i <= xSteps; i++) {
        const value = Math.round(255 * i / xSteps);
        const x = (chartWidth * i / xSteps);
        
        // Draw tick mark
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, chartHeight);
        ctx.lineTo(x, chartHeight + 5);
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.fillText(value, x, chartHeight + 10);
    }
    
    ctx.restore();
    
    // Draw axis titles
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // X-axis title
    ctx.fillText('Intensitas (0-255)', margin.left + chartWidth / 2, canvas.height - 20);
    
    // Y-axis title (rotated)
    ctx.save();
    ctx.translate(20, margin.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Frekuensi Pixel', 0, 0);
    ctx.restore();
    
    // Draw legend
    const legendX = margin.left + chartWidth - 160;
    const legendY = margin.top + 15;
    
    ctx.font = '13px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Red
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fillRect(legendX, legendY, 18, 18);
    ctx.fillStyle = '#000';
    ctx.fillText('Red Channel', legendX + 25, legendY + 9);
    
    // Green
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(legendX, legendY + 25, 18, 18);
    ctx.fillStyle = '#000';
    ctx.fillText('Green Channel', legendX + 25, legendY + 34);
    
    // Blue
    ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
    ctx.fillRect(legendX, legendY + 50, 18, 18);
    ctx.fillStyle = '#000';
    ctx.fillText('Blue Channel', legendX + 25, legendY + 59);
}

// MODE 2: Histogram Separated (3 separate charts)
function drawHistogramSeparated(histogram) {
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 850;
    canvas.height = 750;
    
    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Find max values
    const maxRed = Math.max(...histogram.red);
    const maxGreen = Math.max(...histogram.green);
    const maxBlue = Math.max(...histogram.blue);
    
    // Draw each channel
    const chartHeight = 200;
    const chartWidth = 800;
    const marginLeft = 30;
    const startY = 30;
    const spacing = 40;
    
    // Red Channel
    drawSingleChannel(ctx, histogram.red, 'Red Channel', '#FF5252', 
        marginLeft, startY, chartWidth, chartHeight, maxRed);
    
    // Green Channel
    drawSingleChannel(ctx, histogram.green, 'Green Channel', '#4CAF50', 
        marginLeft, startY + chartHeight + spacing, chartWidth, chartHeight, maxGreen);
    
    // Blue Channel
    drawSingleChannel(ctx, histogram.blue, 'Blue Channel', '#2196F3', 
        marginLeft, startY + (chartHeight + spacing) * 2, chartWidth, chartHeight, maxBlue);
}

// Helper function for single channel histogram
function drawSingleChannel(ctx, data, title, color, x, y, width, height, maxValue) {
    ctx.save();
    ctx.translate(x, y);
    
    // Draw white background card
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-15, -15, width + 30, height + 35);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(-15, -15, width + 30, height + 35);
    
    // Draw title
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title, 0, -35);
    
    // Draw max value
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Max: ' + maxValue.toLocaleString('id-ID'), width, -35);
    
    // Calculate scaling
    const barWidth = width / 256;
    const heightScale = (height - 25) / maxValue;
    
    // Draw area chart with opacity
    ctx.fillStyle = color + '80'; // Add transparency (80 = 50% opacity in hex)
    ctx.beginPath();
    ctx.moveTo(0, height - 25);
    
    for (let i = 0; i < 256; i++) {
        const barHeight = data[i] * heightScale;
        const xPos = i * barWidth;
        const yPos = height - 25 - barHeight;
        ctx.lineTo(xPos, yPos);
    }
    
    ctx.lineTo(width, height - 25);
    ctx.closePath();
    ctx.fill();
    
    // Draw line on top
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 25);
    
    for (let i = 0; i < 256; i++) {
        const barHeight = data[i] * heightScale;
        const xPos = i * barWidth;
        const yPos = height - 25 - barHeight;
        ctx.lineTo(xPos, yPos);
    }
    ctx.stroke();
    
    // Draw X-axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height - 25);
    ctx.lineTo(width, height - 25);
    ctx.stroke();
    
    // Draw X-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    const labels = [0, 128, 255];
    labels.forEach(label => {
        const xPos = (label / 255) * width;
        ctx.fillText(label, xPos, height - 20);
    });
    
    ctx.restore();
}

// Reset Histogram
function resetHistogram() {
    if (!currentImage) {
        alert('Belum ada gambar yang dimuat!');
        return;
    }
    
    const canvas = document.getElementById('histogram-source-canvas');
    if (canvas && currentImage) {
        drawImageOnCanvas(canvas, currentImage);
    }
    
    const histCanvas = document.getElementById('histogram-canvas');
    const histCtx = histCanvas.getContext('2d');
    histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);
}

// ===== INITIALIZATION =====

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SIPS - Simple Image Processing Studio Loaded');
    
    // Image upload handler
    const imageInput = document.getElementById('image-input');
    const fileInfo = document.getElementById('file-info');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Mohon pilih file gambar yang valid! (JPG, PNG, GIF, etc.)');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    currentImage = img;
                    fileInfo.textContent = `✓ ${file.name} (${img.width}x${img.height}px)`;
                    fileInfo.style.color = '#2563eb';
                    fileInfo.style.fontWeight = 'bold';
                    
                    console.log(`Image loaded: ${img.width}x${img.height}`);
                };
                img.onerror = function() {
                    alert('Gagal memuat gambar! File mungkin rusak.');
                };
                img.src = event.target.result;
            };
            reader.onerror = function() {
                alert('Gagal membaca file!');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Check if we're on mobile
    if (window.innerWidth < 768) {
        console.log('Mobile device detected - optimizing performance');
    }
    
    // Initial console message
    console.log('SIPS ready!');
    console.log('Features available:');
    console.log('1. Basic Filters (Grayscale, Invert, Sepia, Brightness)');
    console.log('2. Sobel Edge Detection');
    console.log('3. RGB Histogram Analysis');
});