// Histogram calculator service

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

// Draw histogram on canvas
function drawHistogram(histogram) {
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 768;
    canvas.height = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Find max value for scaling
    const maxRed = Math.max(...histogram.red);
    const maxGreen = Math.max(...histogram.green);
    const maxBlue = Math.max(...histogram.blue);
    const maxValue = Math.max(maxRed, maxGreen, maxBlue);
    
    const barWidth = canvas.width / 256;
    const heightScale = (canvas.height - 40) / maxValue;
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const y = (canvas.height - 20) * (i / 10) + 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw histograms with transparency
    drawChannel(ctx, histogram.red, 'rgba(255, 0, 0, 0.5)', barWidth, heightScale);
    drawChannel(ctx, histogram.green, 'rgba(0, 255, 0, 0.5)', barWidth, heightScale);
    drawChannel(ctx, histogram.blue, 'rgba(0, 0, 255, 0.5)', barWidth, heightScale);
    
    // Draw legend
    ctx.font = '14px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('● Red', 10, canvas.height - 5);
    ctx.fillStyle = 'green';
    ctx.fillText('● Green', 80, canvas.height - 5);
    ctx.fillStyle = 'blue';
    ctx.fillText('● Blue', 160, canvas.height - 5);
}

// Draw single channel histogram
function drawChannel(ctx, data, color, barWidth, heightScale) {
    ctx.fillStyle = color;
    
    for (let i = 0; i < 256; i++) {
        const value = data[i];
        const barHeight = value * heightScale;
        const x = i * barWidth;
        const y = ctx.canvas.height - 20 - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
    }
}