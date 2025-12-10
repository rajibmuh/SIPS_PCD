const Filters = {
    applyGrayscale: function() {
        const canvas = document.getElementById('filter-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
        
        ctx.putImageData(imageData, 0, 0);
    },
    
    applyInvert: function() {
        const canvas = document.getElementById('filter-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        
        ctx.putImageData(imageData, 0, 0);
    },
    
    applySepia: function() {
        const canvas = document.getElementById('filter-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        
        ctx.putImageData(imageData, 0, 0);
    },
    
    applyBrightness: function(value) {
        const canvas = document.getElementById('filter-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const brightness = parseInt(value);
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, data[i] + brightness));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
        }
        
        ctx.putImageData(imageData, 0, 0);
        document.getElementById('brightness-value').textContent = value;
    },
    
    reset: function() {
        const canvas = document.getElementById('filter-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
        
        document.getElementById('brightness-slider').value = 0;
        document.getElementById('brightness-value').textContent = '0';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', function(e) {
            if (window.currentImage && Filters && Filters.applyBrightness) {
                Filters.applyBrightness(e.target.value);
            }
        });
    }
});