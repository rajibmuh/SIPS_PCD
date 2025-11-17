// Filter service - Image processing algorithms

// Grayscale filter
// Formula: Gray = 0.299*R + 0.587*G + 0.114*B (luminosity method)
function grayscaleFilter(imageData) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate grayscale value using luminosity method
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        data[i] = gray;     // R
        data[i + 1] = gray; // G
        data[i + 2] = gray; // B
        // Alpha (i+3) unchanged
    }
    
    return imageData;
}

// Invert filter
// Formula: Inverted = 255 - Original
function invertFilter(imageData) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
        // Alpha (i+3) unchanged
    }
    
    return imageData;
}

// Brightness filter
// Formula: New = Original + brightness_value
function brightnessFilter(imageData, brightness) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = clamp(data[i] + brightness);         // R
        data[i + 1] = clamp(data[i + 1] + brightness); // G
        data[i + 2] = clamp(data[i + 2] + brightness); // B
        // Alpha (i+3) unchanged
    }
    
    return imageData;
}

// Clamp value between 0 and 255
function clamp(value) {
    return Math.max(0, Math.min(255, value));
}