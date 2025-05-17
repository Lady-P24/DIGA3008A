document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.querySelector('.lightbox');
    const lightboxMedia = document.querySelector('.lightbox-media');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');
    let currentIndex = 0;
    let filteredItems = [...galleryItems];
    
    // Animation on page load
    setTimeout(() => {
        document.body.classList.add('loaded');
        animateGalleryItems();
    }, 100);
    
    // Filter gallery items
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter the items
            galleryItems.forEach(item => {
                const itemType = item.getAttribute('data-type');
                
                // First add the fade-out class
                if (filterValue !== 'all' && itemType !== filterValue) {
                    item.classList.add('fade-out');
                } else {
                    item.classList.remove('fade-out');
                    item.classList.remove('hidden');
                }
            });
            
            // After animation completes, hide the items
            setTimeout(() => {
                galleryItems.forEach(item => {
                    const itemType = item.getAttribute('data-type');
                    
                    if (filterValue !== 'all' && itemType !== filterValue) {
                        item.classList.add('hidden');
                    } else {
                        item.classList.remove('hidden');
                    }
                });
                
                // Update filtered items array
                filteredItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
            }, 500);
        });
    });
    
    // Open lightbox when clicking on gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(item, index);
        });
    });
    
    // Close lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        
        // Remove content after fade out animation
        setTimeout(() => {
            lightboxMedia.innerHTML = '';
        }, 300);
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
        
        // Navigate with arrow keys
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }
    });
    
    // Navigate lightbox
    prevBtn.addEventListener('click', () => navigateLightbox('prev'));
    nextBtn.addEventListener('click', () => navigateLightbox('next'));
    
    // Functions
    function openLightbox(item, index) {
        const itemType = item.getAttribute('data-type');
        const mediaElement = item.querySelector('video, img').cloneNode(true);
        const captionText = item.querySelector('.item-caption').textContent;
        
        // Update the current index
        currentIndex = filteredItems.indexOf(item);
        
        // Clear previous content
        lightboxMedia.innerHTML = '';
        
        // Add new content
        lightboxMedia.appendChild(mediaElement);
        lightboxCaption.textContent = captionText;
        
        // If it's a video, add controls and autoplay
        if (itemType === 'video') {
            mediaElement.controls = true;
            mediaElement.autoplay = true;
        }
        
        // Show lightbox
        lightbox.classList.add('active');
    }
    
    function navigateLightbox(direction) {
        // Get currently visible items
        if (filteredItems.length <= 1) return;
        
        // Calculate new index
        if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        } else {
            currentIndex = (currentIndex + 1) % filteredItems.length;
        }
        
        // Get new item and update lightbox
        const newItem = filteredItems[currentIndex];
        const itemType = newItem.getAttribute('data-type');
        const mediaElement = newItem.querySelector('video, img').cloneNode(true);
        const captionText = newItem.querySelector('.item-caption').textContent;
        
        // Fade out current content
        lightboxMedia.style.opacity = 0;
        lightboxCaption.style.opacity = 0;
        
        // After fade out, update content
        setTimeout(() => {
            // Clear and add new content
            lightboxMedia.innerHTML = '';
            lightboxMedia.appendChild(mediaElement);
            lightboxCaption.textContent = captionText;
            
            // If it's a video, add controls and autoplay
            if (itemType === 'video') {
                mediaElement.controls = true;
                mediaElement.autoplay = true;
            }
            
            // Fade in new content
            lightboxMedia.style.opacity = 1;
            lightboxCaption.style.opacity = 1;
        }, 200);
    }
    
    function animateGalleryItems() {
        galleryItems.forEach((item, index) => {
            // Add initial invisible state
            item.style.opacity = 0;
            item.style.transform = 'translateY(20px)';
            
            // Animate items with delay
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = 1;
                item.style.transform = 'translateY(0)';
            }, 100 + index * 100);
        });
    }
    
    // Handle videos - pause when not visible
    const videos = document.querySelectorAll('video');
    
    // Intersection Observer to pause videos when not visible
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (!entry.isIntersecting && !video.paused) {
                video.pause();
            }
        });
    }, { threshold: 0.3 });
    
    videos.forEach(video => {
        videoObserver.observe(video);
        
        // Pause videos when lightbox opens (if not the active video)
        closeLightbox.addEventListener('click', () => {
            if (!video.paused) {
                video.pause();
            }
        });
    });
});