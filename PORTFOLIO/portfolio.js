document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    
    // Initialize all components
    initializeFiltering();
    initializeLightbox();
    initializeNavigation();
    
    
    setTimeout(() => initializeLazyLoading(), 100);
    setTimeout(() => initializeMediaHandling(), 200);
    setTimeout(() => initializeSmoothScroll(), 300);

    //  The resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });

    //  handling scroll
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(handleScroll, 10);
    });
});

function handleResize() {
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        gallery.style.opacity = '1';
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    const header = document.querySelector('header');
    
    if (header) {
        if (scrollY > 100) {
            header.style.transform = 'translateY(-5px)';
            header.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = 'none';
        }
    }
}

function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // an Updated active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            
            filterItems(galleryItems, filter);
        });
    });
}

function filterItems(items, filter) {
    items.forEach(item => {
        const itemType = item.getAttribute('data-type');
        const shouldShow = filter === 'all' || filter === itemType;

        if (shouldShow) {
            item.classList.remove('hidden');
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'none';
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
            
            // Stop any playing videos when hiding items
            const video = item.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
    });
}

function initializeLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxMedia = document.querySelector('.lightbox-media');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');

    if (!lightbox || !lightboxMedia || !lightboxCaption) {
        console.warn('Lightbox elements not found');
        return;
    }

    
    let xCloseBtn = lightbox.querySelector('.lightbox-close-x');
    if (!xCloseBtn) {
        xCloseBtn = document.createElement('button');
        xCloseBtn.className = 'lightbox-close-x';
        xCloseBtn.innerHTML = '✕';
        xCloseBtn.setAttribute('aria-label', 'Close lightbox');
        lightbox.appendChild(xCloseBtn);
    }

    let currentIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => 
            !item.classList.contains('hidden')
        );
    }

    // An Enhanced function to stop all videos except lightbox videos
    function stopAllVideos() {
        // Stop all videos in the gallery and other areas, but NOT in lightbox
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            // Only stop videos that are not in the lightbox
            if (!video.closest('.lightbox-media')) {
                try {
                    video.pause();
                    video.currentTime = 0;
                    video.muted = true; // Also mute to prevent audio
                } catch (error) {
                    console.warn('Could not pause video:', error);
                }
            }
        });
        
        const galleryVideos = document.querySelectorAll('.gallery-item video');
        galleryVideos.forEach(video => {
            try {
                video.pause();
                video.currentTime = 0;
                video.muted = true;
            
                video.removeAttribute('autoplay');
            } catch (error) {
                console.warn('Could not pause gallery video:', error);
            }
        });
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', function(e) {
            //video stopping on click
            stopAllVideos();
            
            updateVisibleItems();
            currentIndex = visibleItems.indexOf(this);
            if (currentIndex !== -1) {
                
                setTimeout(() => {
                    openLightbox(currentIndex);
                }, 50);
            }
        });
    });

    // Event listeners for closing lightbox
    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxHandler);
    }
    
    xCloseBtn.addEventListener('click', closeLightboxHandler);
    
    
    xCloseBtn.addEventListener('mouseenter', function() {
        this.classList.add('hover');
    });
    
    xCloseBtn.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxHandler();
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAllVideos(); // Stop current video before switching
            currentIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
            updateLightboxContent();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAllVideos(); // Stop current video before switching
            currentIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
            updateLightboxContent();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightboxHandler();
                break;
            case 'ArrowLeft':
                if (prevBtn) prevBtn.click();
                break;
            case 'ArrowRight':
                if (nextBtn) nextBtn.click();
                break;
        }
    });

    function openLightbox(index) {
        // Stop all videos before opening
        stopAllVideos();
        
        currentIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
      
        document.body.classList.add('lightbox-active');
        
        updateLightboxContent();
    }

    function closeLightboxHandler() {
        // Stop any playing videos when closing
        stopAllVideos();
        
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.body.classList.remove('lightbox-active');
        
        // Clear lightbox media with delay to prevent flicker
        setTimeout(() => {
            lightboxMedia.innerHTML = '';
        }, 300);
    }

    function updateLightboxContent() {
        if (visibleItems.length === 0) return;
        
        // Stop videos before updating content
        stopAllVideos();
        
        const currentItem = visibleItems[currentIndex];
        const media = currentItem.querySelector('video, img');
        const captionElement = currentItem.querySelector('.item-caption');
        const caption = captionElement ? captionElement.textContent : '';

        lightboxMedia.innerHTML = '';
        
        if (media) {
            if (media.tagName === 'VIDEO') {
                const video = document.createElement('video');
                video.controls = true;
                video.preload = 'metadata';
                video.muted = false;
                video.autoplay = false; // Explicitly disable autoplay
                video.loop = false; // Disable loop
                
                // Additional attributes to prevent autoplay
                video.setAttribute('playsinline', 'true');
                video.setAttribute('webkit-playsinline', 'true');
                
                const source = media.querySelector('source');
                if (source) {
                    video.src = source.src;
                } else {
                    video.src = media.src;
                }
                
                // Ensure video starts paused but allow user control
                video.addEventListener('loadedmetadata', function() {
                    this.pause();
                    this.currentTime = 0;
                    this.muted = false; 
                });
                
                video.addEventListener('loadeddata', function() {
                    this.pause();
                    this.currentTime = 0;
                });
                
                video.addEventListener('canplay', function() {
                    this.pause();
                });
                
                video.addEventListener('canplaythrough', function() {
                    this.pause();
                });
                
                // Allow video to play in lightbox, but not elsewhere
                video.addEventListener('play', function(e) {
                    // Allow play only if video is in lightbox
                    if (!this.closest('.lightbox-media')) {
                        e.preventDefault();
                        this.pause();
                    }
                });
                
                lightboxMedia.appendChild(video);
            } else if (media.tagName === 'IMG') {
                const img = document.createElement('img');
                img.src = media.src;
                img.alt = media.alt || '';
                lightboxMedia.appendChild(img);
            }
        }

        lightboxCaption.textContent = caption;
        
        // Show/hide navigation buttons
        if (prevBtn) prevBtn.style.display = visibleItems.length > 1 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = visibleItems.length > 1 ? 'flex' : 'none';
    }
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.navigation');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath && (
            currentPath.includes(linkPath.replace('../', '').replace('.html', '')) || 
            (currentPath.includes('portfolio') && linkPath.includes('portfolio'))
        )) {
            link.classList.add('current');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('current')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

function initializeSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

function initializeLazyLoading() {
    const mediaElements = document.querySelectorAll('img[data-src], video');
    
    if (!mediaElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const media = entry.target;
                
                if (media.tagName === 'IMG' && media.dataset.src) {
                    media.src = media.dataset.src;
                    media.removeAttribute('data-src');
                } else if (media.tagName === 'VIDEO') {
                    media.load();
                  
                    media.pause();
                }
                
                observer.unobserve(media);
            }
        });
    }, { 
        rootMargin: '50px',
        threshold: 0.1
    });

    mediaElements.forEach(media => observer.observe(media));
}

function initializeMediaHandling() {
    const videos = document.querySelectorAll('video');
    const images = document.querySelectorAll('img');

    videos.forEach(video => {
        const parentElement = video.parentElement;
        
        // Remove any autoplay attributes
        video.removeAttribute('autoplay');
        video.autoplay = false;
        
        video.addEventListener('loadstart', function() {
            if (parentElement) parentElement.classList.add('loading');
            this.pause(); // Ensure pause on load start
        });
        
        video.addEventListener('canplay', function() {
            if (parentElement) {
                parentElement.classList.remove('loading');
                parentElement.classList.add('loaded');
            }
            this.pause(); // Ensure pause when ready to play
        });
        
        video.addEventListener('error', function() {
            if (parentElement) parentElement.classList.add('error');
            console.error('Video failed to load:', this.src);
        });

        // Pause video when it's not in viewport and reset to beginning
        video.addEventListener('pause', function() {
            this.currentTime = 0; // Reset to beginning when paused
        });
        
        
        video.addEventListener('play', function() {
            // Only prevent play if video is in gallery (not in lightbox)
            if (!this.closest('.lightbox-media') && 
                document.body.classList.contains('lightbox-active')) {
                this.pause();
            }
        });
    });

    images.forEach(img => {
        const parentElement = img.parentElement;
        
        img.addEventListener('load', function() {
            if (parentElement) parentElement.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            if (parentElement) parentElement.classList.add('error');
            console.error('Image failed to load:', this.src);
        });
    });
}