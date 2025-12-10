const Sobel = {
    apply: function() {
        const canvas = document.getElementById('sobel-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        const gray = new Uint8ClampedArray(width * height);
        for (let i = 0; i < data.length; i += 4) {
            const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            gray[i / 4] = avg;
        }
        
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
                const clampedMagnitude = Math.min(255, magnitude);
                
                output[idx] = clampedMagnitude;
                output[idx + 1] = clampedMagnitude;
                output[idx + 2] = clampedMagnitude;
                output[idx + 3] = 255;
            }
        }
        
        for (let i = 0; i < data.length; i++) {
            data[i] = output[i];
        }
        
        ctx.putImageData(imageData, 0, 0);
    },
    
    reset: function() {
        const canvas = document.getElementById('sobel-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
    }
};