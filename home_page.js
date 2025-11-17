// Home page functionality
document.getElementById('image-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                currentImage = img;
                document.getElementById('file-info').textContent = `✓ ${file.name} (${img.width}x${img.height}px)`;
                document.getElementById('file-info').style.color = '#667eea';
                document.getElementById('file-info').style.fontWeight = 'bold';
            };
            img.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
    } else {
        alert('Mohon pilih file gambar yang valid!');
    }
});