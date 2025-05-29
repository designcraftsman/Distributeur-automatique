document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('main section , main .section ');
    const navLinks = document.querySelectorAll('.sidebar .nav-link');

    function setActiveLink() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
                // Expand parent if it's a subsection
                const parent = link.closest('ul').previousElementSibling;
                if (parent && parent.classList.contains('nav-link')) {
                    parent.classList.add('active');
                }
            }
        });
    }

    setActiveLink();
    window.addEventListener('scroll', setActiveLink);
});
