let currentImage = null;

function goToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + '-page').classList.add('active');
    
    if (currentImage && page !== 'home') {
        loadImageToCanvas(page);
    }
}

function loadImageToCanvas(page) {
    let canvasId;
    switch(page) {
        case 'rotation': canvasId = 'rotation-canvas'; break;
        case 'filter': canvasId = 'filter-canvas'; break;
        case 'sobel': canvasId = 'sobel-canvas'; break;
        case 'histogram': canvasId = 'histogram-source-canvas'; break;
        default: return;
    }
    
    const canvas = document.getElementById(canvasId);
    if (canvas && currentImage) {
        const ctx = canvas.getContext('2d');
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;
        ctx.drawImage(currentImage, 0, 0);
    }
}

function saveImage(canvasId, filename) {
    if (!currentImage) {
        alert('Upload gambar dulu!');
        return;
    }
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function updateHistogram() {
    if (currentImage && Histogram && Histogram.calculate) {
        Histogram.calculate();
    }
}

document.getElementById('image-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Pilih file gambar!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;
            window.currentImage = img;
            document.getElementById('file-info').textContent = 
                `${file.name} (${img.width}x${img.height})`;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});