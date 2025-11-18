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

// ===== HISTOGRAM FUNCTIONS - UPDATED VERSION WITH 2 MODES =====

// Compute RGB histogram
function computeHistogram(imageData) {
    const data = imageData.data;
    
    // Initialize histogram arrays (0-255 for each channel)
    const histogram = {
        red: new Array(256).fill(0),
        green: new Array(256).fill(0),
        blue: new Array(256).fill(0)
    };
    
    // Count frequency of each pixel value
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        histogram.red[r]++;
        histogram.green[g]++;
        histogram.blue[b]++;
    }
    
    return histogram;
}

// Calculate histogram - fungsi utama yang dipanggil dari HTML
function calculateHistogram() {
    if (!currentImage) {
        alert('Mohon import gambar terlebih dahulu!');
        return;
    }
    
    const canvas = document.getElementById('histogram-source-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Calculate RGB histogram
    const histogram = computeHistogram(imageData);
    
    // Check which mode is selected
    const mode = document.querySelector('input[name="histogram-mode"]:checked')?.value || 'overlay';
    
    if (mode === 'overlay') {
        drawHistogramOverlay(histogram);
    } else {
        drawHistogramSeparated(histogram);
    }
}

// MODE 1: Histogram Overlay (3 warna jadi satu dengan label lengkap)
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
    
    // Draw grid and Y-axis labels (frequency)
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
    drawChannel(ctx, histogram.red, 'rgba(255, 0, 0, 0.6)', barWidth, heightScale, chartHeight);
    drawChannel(ctx, histogram.green, 'rgba(0, 255, 0, 0.6)', barWidth, heightScale, chartHeight);
    drawChannel(ctx, histogram.blue, 'rgba(0, 0, 255, 0.6)', barWidth, heightScale, chartHeight);
    
    // Draw X-axis labels (intensity values 0-255)
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
    
    // Draw legend with border
    const legendX = margin.left + chartWidth - 160;
    const legendY = margin.top + 15;
    const legendWidth = 150;
    const legendHeight = 75;
    
    // Legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(legendX - 5, legendY - 5, legendWidth, legendHeight);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 5, legendY - 5, legendWidth, legendHeight);
    
    ctx.font = '13px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Red
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fillRect(legendX, legendY, 18, 18);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(legendX, legendY, 18, 18);
    ctx.fillStyle = '#000';
    ctx.fillText('Red Channel', legendX + 25, legendY + 9);
    
    // Green
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(legendX, legendY + 25, 18, 18);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(legendX, legendY + 25, 18, 18);
    ctx.fillStyle = '#000';
    ctx.fillText('Green Channel', legendX + 25, legendY + 34);
    
    // Blue
    ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
    ctx.fillRect(legendX, legendY + 50, 18, 18);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(legendX, legendY + 50, 18, 18);
    ctx.fillStyle = '#000';
    ctx.fillText('Blue Channel', legendX + 25, legendY + 59);
}

// Draw single channel for overlay mode
function drawChannel(ctx, data, color, barWidth, heightScale, chartHeight) {
    ctx.fillStyle = color;
    
    for (let i = 0; i < 256; i++) {
        const value = data[i];
        const barHeight = value * heightScale;
        const x = i * barWidth;
        const y = chartHeight - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
    }
}

// MODE 2: Histogram Separated (3 grafik terpisah)
function drawHistogramSeparated(histogram) {
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size - tinggi untuk 3 chart terpisah
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

// Draw single channel for separated mode
function drawSingleChannel(ctx, data, title, color, x, y, width, height, maxValue) {
    ctx.save();
    ctx.translate(x, y);
    
    // Draw white background card
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-15, -15, width + 30, height + 35);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(-15, -15, width + 30, height + 35);
    
    // Draw title (left)
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(title, 0, -35);
    
    // Draw max value (right)
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Max: ' + maxValue.toLocaleString('id-ID'), width, -35);
    
    // Calculate scaling
    const barWidth = width / 256;
    const heightScale = (height - 25) / maxValue;
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height - 25);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + '40'); // Add transparency
    
    // Draw area chart
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, height - 25);
    
    for (let i = 0; i < 256; i++) {
        const value = data[i];
        const barHeight = value * heightScale;
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
        const value = data[i];
        const barHeight = value * heightScale;
        const xPos = i * barWidth;
        const yPos = height - 25 - barHeight;
        ctx.lineTo(xPos, yPos);
    }
    ctx.stroke();
    
    // Draw X-axis line
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
    ctx.textBaseline = 'top';
    
    const labels = [0, 128, 255];
    labels.forEach(label => {
        const xPos = (label / 255) * width;
        ctx.fillText(label, xPos, height - 20);
    });
    
    ctx.restore();
}

// Reset histogram
function resetHistogram() {
    if (!currentImage) {
        return;
    }
    
    const canvas = document.getElementById('histogram-source-canvas');
    if (canvas && currentImage) {
        drawImageOnCanvas(canvas, currentImage);
        const ctx = canvas.getContext('2d');
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    // Clear histogram
    const histCanvas = document.getElementById('histogram-canvas');
    const histCtx = histCanvas.getContext('2d');
    histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);
}