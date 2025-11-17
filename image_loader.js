// Image loader utility functions

// Draw image on canvas
function drawImageOnCanvas(canvas, image) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0);
}

// Download image from canvas
function downloadImage(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) {
        alert('Canvas tidak ditemukan!');
        return;
    }
    
    // Create download link
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
    });
}

// Get image data from canvas
function getImageData(canvas) {
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Put image data to canvas
function putImageData(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}