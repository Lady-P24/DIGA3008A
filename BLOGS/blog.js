document.addEventListener('DOMContentLoaded', function() {
    // Get all the "See More" buttons
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    
    // Add click event listener to each button
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the ID of the content element this button controls
            const targetId = this.getAttribute('data-target');
            const contentElement = document.getElementById(targetId);
            
            // Toggle the condensed class to show or hide content
            if (contentElement.classList.contains('condensed')) {
                // Expand the content
                contentElement.classList.remove('condensed');
                this.textContent = 'See Less';
            } else {
                // Collapse the content
                contentElement.classList.add('condensed');
                this.textContent = 'See More';
                
                // Scroll back to the top of the post for better user experience
                contentElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    //Add animation when scrolling to elements
    function animateOnScroll() {
        const blogPosts = document.querySelectorAll('.blog-item');
        
        blogPosts.forEach(post => {
            const postPosition = post.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (postPosition < screenPosition) {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize styles for animation 
    const blogPosts = document.querySelectorAll('.blog-item');
    blogPosts.forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation function on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
});

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
            
            // Set caption if available
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
    
    // Close lightbox when clicking the close button
    closeButton.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle keyboard events
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