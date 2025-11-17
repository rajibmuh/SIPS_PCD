// Sobel service - Edge detection algorithm

// Sobel kernels (3x3)
const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
];

const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
];

// Sobel edge detection
function sobelEdgeDetection(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Convert to grayscale first
    const grayData = new Uint8ClampedArray(width * height);
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        grayData[i / 4] = gray;
    }
    
    // Apply Sobel operator
    const result = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0;
            let gy = 0;
            
            // Apply convolution with Sobel kernels
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelIndex = (y + ky) * width + (x + kx);
                    const pixelValue = grayData[pixelIndex];
                    
                    gx += pixelValue * sobelX[ky + 1][kx + 1];
                    gy += pixelValue * sobelY[ky + 1][kx + 1];
                }
            }
            
            // Calculate gradient magnitude
            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const clampedMagnitude = Math.min(255, magnitude);
            
            const index = (y * width + x) * 4;
            result[index] = clampedMagnitude;     // R
            result[index + 1] = clampedMagnitude; // G
            result[index + 2] = clampedMagnitude; // B
            result[index + 3] = 255;              // A
        }
    }
    
    // Create new ImageData
    const outputImageData = new ImageData(result, width, height);
    return outputImageData;
}