const Histogram = {
    calculate: function() {
        const canvas = document.getElementById('histogram-source-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        
        ctx.drawImage(window.currentImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const histogram = {
            red: new Array(256).fill(0),
            green: new Array(256).fill(0),
            blue: new Array(256).fill(0)
        };
        
        for (let i = 0; i < data.length; i += 4) {
            histogram.red[data[i]]++;
            histogram.green[data[i + 1]]++;
            histogram.blue[data[i + 2]]++;
        }
        
        const mode = document.querySelector('input[name="histogram-mode"]:checked')?.value || 'overlay';
        
        if (mode === 'overlay') {
            this._drawHistogramOverlay(histogram);
        } else {
            this._drawHistogramSeparated(histogram);
        }
    },
    
    reset: function() {
        const canvas = document.getElementById('histogram-source-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
        
        const histCanvas = document.getElementById('histogram-canvas');
        const histCtx = histCanvas.getContext('2d');
        histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);
    },
    
    _drawHistogramOverlay: function(histogram) {
        const canvas = document.getElementById('histogram-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 800;
        canvas.height = 400;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const chartWidth = canvas.width - margin.left - margin.right;
        const chartHeight = canvas.height - margin.top - margin.bottom;
        
        const maxRed = Math.max(...histogram.red);
        const maxGreen = Math.max(...histogram.green);
        const maxBlue = Math.max(...histogram.blue);
        const maxValue = Math.max(maxRed, maxGreen, maxBlue);
        
        const barWidth = chartWidth / 256;
        const heightScale = chartHeight / maxValue;
        
        ctx.save();
        ctx.translate(margin.left, margin.top);
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#333';
        ctx.font = '11px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        const ySteps = 10;
        for (let i = 0; i <= ySteps; i++) {
            const y = chartHeight * (i / ySteps);
            const value = Math.round(maxValue * (ySteps - i) / ySteps);
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(chartWidth, y);
            ctx.stroke();
            
            ctx.fillText(value.toString(), -5, y);
        }
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, chartHeight);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, chartHeight);
        ctx.lineTo(chartWidth, chartHeight);
        ctx.stroke();
        
        for (let i = 0; i < 256; i++) {
            const x = i * barWidth;
            
            if (histogram.red[i] > 0) {
                const redHeight = histogram.red[i] * heightScale;
                ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
                ctx.fillRect(x, chartHeight - redHeight, barWidth, redHeight);
            }
            
            if (histogram.green[i] > 0) {
                const greenHeight = histogram.green[i] * heightScale;
                ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
                ctx.fillRect(x, chartHeight - greenHeight, barWidth, greenHeight);
            }
            
            if (histogram.blue[i] > 0) {
                const blueHeight = histogram.blue[i] * heightScale;
                ctx.fillStyle = 'rgba(0, 0, 255, 0.6)';
                ctx.fillRect(x, chartHeight - blueHeight, barWidth, blueHeight);
            }
        }
        
        ctx.fillStyle = '#333';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const xLabels = [0, 64, 128, 192, 255];
        xLabels.forEach(value => {
            const x = (value / 255) * chartWidth;
            
            ctx.beginPath();
            ctx.moveTo(x, chartHeight);
            ctx.lineTo(x, chartHeight + 5);
            ctx.stroke();
            
            ctx.fillText(value.toString(), x, chartHeight + 8);
        });
        
        ctx.restore();
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        
        ctx.fillText('Intensitas Pixel (0-255)', canvas.width / 2, canvas.height - 15);
        
        ctx.save();
        ctx.translate(20, margin.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Frekuensi', 0, 0);
        ctx.restore();
        
        const legendX = margin.left + 10;
        const legendY = margin.top + 10;
        
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(legendX, legendY, 15, 15);
        ctx.fillStyle = '#000';
        ctx.fillText('Red', legendX + 20, legendY + 7.5);
        
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(legendX, legendY + 20, 15, 15);
        ctx.fillStyle = '#000';
        ctx.fillText('Green', legendX + 20, legendY + 27.5);
        
        ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
        ctx.fillRect(legendX, legendY + 40, 15, 15);
        ctx.fillStyle = '#000';
        ctx.fillText('Blue', legendX + 20, legendY + 47.5);
    },
    
    _drawHistogramSeparated: function(histogram) {
        const canvas = document.getElementById('histogram-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 800;
        canvas.height = 700;
        
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const maxRed = Math.max(...histogram.red);
        const maxGreen = Math.max(...histogram.green);
        const maxBlue = Math.max(...histogram.blue);
        
        const chartWidth = 700;
        const chartHeight = 160;
        const marginLeft = 50;
        const startY = 40;
        const spacing = 80;
        
        this._drawSingleChannel(ctx, histogram.red, 'Red Channel', '#ff4444', 
            marginLeft, startY, chartWidth, chartHeight, maxRed);
        
        this._drawSingleChannel(ctx, histogram.green, 'Green Channel', '#44cc44', 
            marginLeft, startY + chartHeight + spacing, chartWidth, chartHeight, maxGreen);
        
        this._drawSingleChannel(ctx, histogram.blue, 'Blue Channel', '#4444ff', 
            marginLeft, startY + (chartHeight + spacing) * 2, chartWidth, chartHeight, maxBlue);
    },
    
    _drawSingleChannel: function(ctx, data, title, color, x, y, width, height, maxValue) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-10, -30, width + 20, height + 50);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(-10, -30, width + 20, height + 50);
        
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(title, 0, -40);
        
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Max: ${maxValue.toLocaleString()}`, width, -40);
        
        const barWidth = width / 256;
        const heightScale = (height - 30) / maxValue;
        
        ctx.fillStyle = color + '40';
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        
        for (let i = 0; i < 256; i++) {
            const barHeight = data[i] * heightScale;
            const xPos = i * barWidth;
            const yPos = height - 20 - barHeight;
            ctx.lineTo(xPos, yPos);
        }
        
        ctx.lineTo(width, height - 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        
        for (let i = 0; i < 256; i++) {
            const barHeight = data[i] * heightScale;
            const xPos = i * barWidth;
            const yPos = height - 20 - barHeight;
            
            if (i === 0) {
                ctx.moveTo(xPos, yPos);
            } else {
                ctx.lineTo(xPos, yPos);
            }
        }
        ctx.stroke();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        ctx.lineTo(width, height - 20);
        ctx.stroke();
        
        ctx.fillStyle = '#666';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        
        const labels = [0, 64, 128, 192, 255];
        labels.forEach(label => {
            const xPos = (label / 255) * width;
            
            ctx.beginPath();
            ctx.moveTo(xPos, height - 20);
            ctx.lineTo(xPos, height - 15);
            ctx.stroke();
            
            ctx.fillText(label.toString(), xPos, height - 10);
        });
        
        ctx.restore();
    }
};