document.addEventListener('DOMContentLoaded', () => {
    const navItems   = document.querySelectorAll('.nav-item');
    const sections   = document.querySelectorAll('.content-section');
    const firstTarget = navItems[0].getAttribute('data-target');
    let activeSection = document.getElementById(firstTarget);
  
    // Show the first section by default
    sections.forEach(sec => sec.style.display = 'none');
    if (activeSection) activeSection.style.display = 'block';
  
    navItems.forEach(item => {
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
  
      item.addEventListener('mouseenter', () => {
        // hide current
        if (activeSection) activeSection.style.display = 'none';
        // show new
        if (targetSection) {
          targetSection.style.display = 'block';
          activeSection = targetSection;
        }
      });
    });
  });