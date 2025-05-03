
 // Blog Page "See More" functionality
 //  expansion and collapse of blog posts
 


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