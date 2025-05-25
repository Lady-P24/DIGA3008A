document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    initializeFiltering();
    initializeLightbox();
    initializeNavigation();
    setTimeout(() => initializeLazyLoading(), 100);
    setTimeout(() => initializeMediaHandling(), 200);
    setTimeout(() => initializeSmoothScroll(), 300);

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const gallery = document.querySelector('.gallery');
            if (gallery) {
                gallery.style.opacity = '1';
            }
        }, 250);
    });

    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const scrollY = window.scrollY;
            const header = document.querySelector('header');

            if (scrollY > 100) {
                header.style.transform = 'translateY(-5px)';
                header.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.transform = 'translateY(0)';
                header.style.boxShadow = 'none';
            }
        }, 10);
    });
});

function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
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

    let currentIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => 
            !item.classList.contains('hidden')
        );
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', function() {
            updateVisibleItems();
            currentIndex = visibleItems.indexOf(this);
            if (currentIndex !== -1) openLightbox(currentIndex);
        });
    });

    closeLightbox.addEventListener('click', closeLightboxHandler);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightboxHandler();
    });

    prevBtn.addEventListener('click', function() {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
        updateLightboxContent();
    });

    nextBtn.addEventListener('click', function() {
        currentIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
        updateLightboxContent();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightboxHandler();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });

    function openLightbox(index) {
        currentIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxContent();
    }

    function closeLightboxHandler() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        lightboxMedia.innerHTML = '';
    }

    function updateLightboxContent() {
        if (visibleItems.length === 0) return;
        const currentItem = visibleItems[currentIndex];
        const media = currentItem.querySelector('video, img');
        const caption = currentItem.querySelector('.item-caption').textContent;

        lightboxMedia.innerHTML = '';
        if (media.tagName === 'VIDEO') {
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.muted = true;
            video.src = media.querySelector('source').src;
            lightboxMedia.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = media.alt;
            lightboxMedia.appendChild(img);
        }

        lightboxCaption.textContent = caption;
        prevBtn.style.display = visibleItems.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = visibleItems.length > 1 ? 'flex' : 'none';
    }
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.navigation');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath.replace('../', '').replace('.html', '')) || 
            (currentPath.includes('portfolio') && linkPath.includes('portfolio'))) {
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
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initializeLazyLoading() {
    const mediaElements = document.querySelectorAll('img, video');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const media = entry.target;
                if (media.tagName === 'IMG' && media.dataset.src) {
                    media.src = media.dataset.src;
                    media.removeAttribute('data-src');
                }
                if (media.tagName === 'VIDEO') media.load();
                observer.unobserve(media);
            }
        });
    }, { rootMargin: '50px' });
    mediaElements.forEach(media => observer.observe(media));
}

function initializeMediaHandling() {
    const videos = document.querySelectorAll('video');
    const images = document.querySelectorAll('img');

    videos.forEach(video => {
        video.addEventListener('loadstart', function() {
            this.parentElement.classList.add('loading');
        });
        video.addEventListener('canplay', function() {
            this.parentElement.classList.remove('loading');
            this.parentElement.classList.add('loaded');
        });
        video.addEventListener('error', function() {
            this.parentElement.classList.add('error');
            console.error('Video failed to load:', this.src);
        });
    });

    images.forEach(img => {
        img.addEventListener('load', function() {
            this.parentElement.classList.add('loaded');
        });
        img.addEventListener('error', function() {
            this.parentElement.classList.add('error');
            console.error('Image failed to load:', this.src);
        });
    });
};
