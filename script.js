document.addEventListener('DOMContentLoaded', function() {

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function() {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // ===== SCROLL REVEAL (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // ===== LAZY LOADING =====
    const lazyImages = document.querySelectorAll('.lazy');

    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px'
    });

    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.gallery-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                const src = img.getAttribute('data-src') || img.src;
                lightboxImg.src = src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });

    // ===== TESTIMONIAL CAROUSEL =====
    const track = document.getElementById('testimonialTrack');
    const cards = track.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');

    let currentIndex = 0;
    let cardsPerView = 3;
    let totalCards = cards.length;

    function getCardsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        cardsPerView = getCardsPerView();
        const cardWidth = cards[0].offsetWidth + 24; // width + gap
        const offset = currentIndex * cardWidth;
        track.style.transform = 'translateX(-' + offset + 'px)';
        updateDots();
    }

    function updateDots() {
        const totalDots = Math.ceil(totalCards / cardsPerView);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === Math.floor(currentIndex / cardsPerView) ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', function() {
                currentIndex = i * cardsPerView;
                if (currentIndex > totalCards - cardsPerView) {
                    currentIndex = totalCards - cardsPerView;
                }
                if (currentIndex < 0) currentIndex = 0;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function nextSlide() {
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        if (currentIndex < maxIndex) {
            currentIndex += cardsPerView;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }

    function prevSlide() {
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        if (currentIndex > 0) {
            currentIndex -= cardsPerView;
            if (currentIndex < 0) currentIndex = 0;
        } else {
            currentIndex = maxIndex;
        }
        updateCarousel();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    let autoPlayInterval = setInterval(nextSlide, 6000);

    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.testimonial-carousel');
    carouselContainer.addEventListener('mouseenter', function() {
        clearInterval(autoPlayInterval);
    });
    carouselContainer.addEventListener('mouseleave', function() {
        autoPlayInterval = setInterval(nextSlide, 6000);
    });

    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                if (currentIndex > totalCards - cardsPerView) {
                    currentIndex = Math.max(0, totalCards - cardsPerView);
                }
                updateCarousel();
            }
        }, 200);
    });

    // Initial setup
    setTimeout(updateCarousel, 100);

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(function(button) {
        button.addEventListener('click', function() {
            const item = this.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(function(other) {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simple validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const eventType = document.getElementById('eventType').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !eventType || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        // Simulate submission
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(function() {
            alert('Thank you! We\'ll get back to you within 24 hours.');
            contactForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1200);
    });

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

});