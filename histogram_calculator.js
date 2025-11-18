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

// Draw histogram on canvas with separated channels
function drawHistogram(histogram) {
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size - taller for 3 separate charts
    canvas.width = 900;
    canvas.height = 800;
    
    // Clear canvas with light background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Find max values for each channel
    const maxRed = Math.max(...histogram.red);
    const maxGreen = Math.max(...histogram.green);
    const maxBlue = Math.max(...histogram.blue);
    
    // Draw each channel separately
    const chartHeight = 220;
    const chartWidth = 800;
    const marginLeft = 50;
    const marginTop = 30;
    const spacing = 30;
    
    // Red Channel
    drawSingleChannelHistogram(ctx, histogram.red, 'Red Channel', 'rgba(255, 82, 82, 1)', 
        marginLeft, marginTop, chartWidth, chartHeight, maxRed);
    
    // Green Channel
    drawSingleChannelHistogram(ctx, histogram.green, 'Green Channel', 'rgba(76, 175, 80, 1)', 
        marginLeft, marginTop + chartHeight + spacing, chartWidth, chartHeight, maxGreen);
    
    // Blue Channel
    drawSingleChannelHistogram(ctx, histogram.blue, 'Blue Channel', 'rgba(33, 150, 243, 1)', 
        marginLeft, marginTop + (chartHeight + spacing) * 2, chartWidth, chartHeight, maxBlue);
}

// Draw single channel histogram
function drawSingleChannelHistogram(ctx, data, title, color, x, y, width, height, maxValue) {
    ctx.save();
    ctx.translate(x, y);
    
    // Draw background card
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -10, width + 20, height + 40);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(-10, -10, width + 20, height + 40);
    
    // Draw title
    ctx.fillStyle = color;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title, 5, -25);
    
    // Draw max value
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Max: ' + maxValue.toLocaleString('id-ID'), width - 5, -25);
    
    // Calculate scaling
    const barWidth = width / 256;
    const heightScale = (height - 30) / maxValue;
    
    // Draw histogram area with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height - 30);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color.replace('1)', '0.3)'));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, height - 30);
    
    for (let i = 0; i < 256; i++) {
        const value = data[i];
        const barHeight = value * heightScale;
        const xPos = i * barWidth;
        const yPos = height - 30 - barHeight;
        
        if (i === 0) {
            ctx.lineTo(xPos, yPos);
        } else {
            ctx.lineTo(xPos, yPos);
        }
    }
    
    ctx.lineTo(width, height - 30);
    ctx.closePath();
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 30);
    
    for (let i = 0; i < 256; i++) {
        const value = data[i];
        const barHeight = value * heightScale;
        const xPos = i * barWidth;
        const yPos = height - 30 - barHeight;
        ctx.lineTo(xPos, yPos);
    }
    
    ctx.stroke();
    
    // Draw X-axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 30);
    ctx.lineTo(width, height - 30);
    ctx.stroke();
    
    // Draw X-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    const xLabels = [0, 128, 255];
    xLabels.forEach(label => {
        const xPos = (label / 255) * width;
        ctx.fillText(label, xPos, height - 10);
    });
    
    ctx.restore();
}