// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

/**
 * Preloader - Moved to top level for reliability
 */
(function() {
    const removePreloader = () => {
        const preloader = document.querySelector('#preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
    };
    window.addEventListener('load', removePreloader);
    // Fallback: remove preloader after 3 seconds anyway
    setTimeout(removePreloader, 3000);
})();

document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 6000; // 6 seconds per slide
        let timer;

        function showSlide(index) {
            // Remove active class from all
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Handle index bounds
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            
            // Add active class to current
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            
            // Reset animations
            const texts = slides[currentSlide].querySelectorAll('.animate-text');
            texts.forEach(text => {
                text.style.animation = 'none';
                text.offsetHeight; /* trigger reflow */
                text.style.animation = null; 
            });
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startTimer() {
            timer = setInterval(nextSlide, slideInterval);
        }

        function resetTimer() {
            clearInterval(timer);
            startTimer();
        }

        // Event Listeners for controls
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
            
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

        // Event Listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetTimer();
            });
        });

        // Start automatic sliding
        startTimer();
    }

    // Stats Counter Logic
    const statsSection = document.querySelector('#stats');
    const counters = document.querySelectorAll('.stat-count');
    
    if (statsSection && counters.length > 0) {
        let activated = false;

        const countUp = () => {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                
                let current = 0;
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !activated) {
                activated = true;
                countUp();
            }
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    /**
     * Back to top button
     */
    const backtotop = document.querySelector('.back-to-top');
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active');
        } else {
          backtotop.classList.remove('active');
        }
      };
      window.addEventListener('load', toggleBacktotop);
      window.addEventListener('scroll', toggleBacktotop);
    }

    /**
     * Theme Toggle Functionality
     */
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
      }
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
          themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
        }
      });
    }

    // FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // City Switcher Logic
    const cityButtons = document.querySelectorAll('.btn-group-ville button');
    const cityInfos = document.querySelectorAll('.city-info');

    cityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const city = btn.getAttribute('data-city');

            // Update button states
            cityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update visible info
            cityInfos.forEach(info => {
                if (info.classList.contains(city)) {
                    info.classList.remove('d-none');
                } else {
                    info.classList.add('d-none');
                }
            });
        });
    });

    // Contact Form Handling (Static Website)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const submitBtn = document.getElementById('btn-save');
            const errorMsg = contactForm.querySelector('.error-message2');
            const sentMsg = contactForm.querySelector('.sent-message2');

            // If action is formsubmit.co or standard post, handle or show feedback
            if (contactForm.getAttribute('action') && contactForm.getAttribute('action').includes('formsubmit.co')) {
                // Allow standard form submit to formsubmit.co
                return;
            }

            e.preventDefault();
            if (submitBtn) submitBtn.disabled = true;
            if (errorMsg) errorMsg.classList.add('d-none');
            if (sentMsg) {
                sentMsg.classList.remove('d-none');
                setTimeout(() => { sentMsg.classList.add('d-none'); }, 5000);
            }
            contactForm.reset();
            if (submitBtn) submitBtn.disabled = false;
        });
    }

    // Candidacy Form Handling (Static Website)
    const candidacyForm = document.getElementById('DemandeForm');
    if (candidacyForm) {
        candidacyForm.addEventListener('submit', function (e) {
            const submitBtn = document.getElementById('btn-dmnd');
            const errorMsg = candidacyForm.querySelector('.error-message4');
            const sentMsg = candidacyForm.querySelector('.sent-message4');

            if (candidacyForm.getAttribute('action') && candidacyForm.getAttribute('action').includes('formsubmit.co')) {
                return;
            }

            e.preventDefault();
            if (submitBtn) submitBtn.disabled = true;
            if (errorMsg) errorMsg.style.display = 'none';
            if (sentMsg) {
                sentMsg.style.display = 'block';
                setTimeout(() => { sentMsg.style.display = 'none'; }, 5000);
            }
            candidacyForm.reset();
            if (submitBtn) submitBtn.disabled = false;
        });
    }

    // Newsletter Form Handling (Static Website)
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-news');
            const errorMsg = document.querySelector('.error-message3');
            const sentMsg = document.querySelector('.sent-message3');

            if (submitBtn) submitBtn.disabled = true;
            if (errorMsg) errorMsg.classList.add('d-none');
            if (sentMsg) {
                sentMsg.textContent = "Ton abonnement est bien reçu. Merci!";
                sentMsg.classList.remove('d-none');
                setTimeout(() => { sentMsg.classList.add('d-none'); }, 5000);
            }
            newsForm.reset();
            if (submitBtn) submitBtn.disabled = false;
        });
    }
});

