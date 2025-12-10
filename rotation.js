const Rotation = {
    rotate90Left: function() {
        const canvas = document.getElementById('rotation-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.height;
        canvas.height = window.currentImage.width;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(window.currentImage, -window.currentImage.width / 2, -window.currentImage.height / 2);
        ctx.restore();
    },
    
    rotate90Right: function() {
        const canvas = document.getElementById('rotation-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.height;
        canvas.height = window.currentImage.width;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(window.currentImage, -window.currentImage.width / 2, -window.currentImage.height / 2);
        ctx.restore();
    },
    
    rotate180: function() {
        const canvas = document.getElementById('rotation-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(window.currentImage, -window.currentImage.width / 2, -window.currentImage.height / 2);
        ctx.restore();
    },
    
    flipHorizontal: function() {
        const canvas = document.getElementById('rotation-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(window.currentImage, -canvas.width, 0);
        ctx.restore();
    },
    
    flipVertical: function() {
        const canvas = document.getElementById('rotation-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        
        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(window.currentImage, 0, -canvas.height);
        ctx.restore();
    },
    
    reset: function() {
        const canvas = document.getElementById('rotation-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.currentImage.width;
        canvas.height = window.currentImage.height;
        ctx.drawImage(window.currentImage, 0, 0);
    }
};