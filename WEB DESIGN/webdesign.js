document.addEventListener('DOMContentLoaded', function() {
   
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    
    const lightboxCaption = document.createElement('div');
    lightboxCaption.className = 'lightbox-caption';
    
    const closeButton = document.createElement('span');
    closeButton.className = 'lightbox-close';
    closeButton.innerHTML = '&times;';
    
    // My lightbox structure
    lightbox.appendChild(closeButton);
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(lightboxCaption);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    const images = document.querySelectorAll('.grid-item img, .featured-image img');
    
    images.forEach(image => {
        image.style.cursor = 'pointer';
        
        image.addEventListener('click', function() {
            
            lightbox.style.display = 'flex';
          
            lightboxImage.src = this.src;
            

            const figcaption = this.closest('figure').querySelector('figcaption');
            if (figcaption) {
                lightboxCaption.textContent = figcaption.textContent;
                lightboxCaption.style.display = 'block';
            } else {
                lightboxCaption.style.display = 'none';
            }
            
        
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeButton.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
   
    document.addEventListener('keydown', function(event) {
      
        if (event.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    

    images.forEach(image => {
        image.setAttribute('aria-haspopup', 'dialog');
        image.setAttribute('title', 'Click to enlarge');
    });
    
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');
    closeButton.setAttribute('aria-label', 'Close image viewer');
});