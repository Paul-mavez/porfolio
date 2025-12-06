// Enhanced main.js
document.addEventListener('DOMContentLoaded', function() {
    // -----------------------------
    // Preloader
    // -----------------------------
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.animation = 'loading 2s ease-in-out forwards';

        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => startTypingAnimation(), 300);
        }, 2000);
    });

    // -----------------------------
    // Mobile Menu Toggle
    // -----------------------------
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        const bars = document.querySelectorAll('.bar');
        if (navMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-6px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-6px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // -----------------------------
    // Navbar Scroll & Active Link
    // -----------------------------
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) link.classList.add('active');
        });
    }

    // -----------------------------
    // Typing Animation
    // -----------------------------
    function startTypingAnimation() {
        const parts = ["Hi, I'm Paul", " Full-Stack Developer"];
        const typingSpeed = 100;
        const pauseBetweenParts = 500;
        const lineElement = document.getElementById('line1');
        let partIndex = 0;
        let charIndex = 0;

        function type() {
            if (partIndex < parts.length) {
                const currentPart = parts[partIndex];
                if (charIndex < currentPart.length) {
                    lineElement.innerHTML += currentPart.charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingSpeed);
                } else {
                    partIndex++;
                    charIndex = 0;
                    setTimeout(type, pauseBetweenParts);
                }
            }
        }
        setTimeout(type, 300);
    }

    // -----------------------------
    // 3D Orbit Animation
    // -----------------------------
    const orbit3d = document.querySelector('.orbit-3d');
    const orbitIcons3d = document.querySelectorAll('.orbit-icon-3d');

    document.addEventListener('mousemove', e => {
        if (orbit3d) {
            const x = (e.clientX - window.innerWidth / 2) / 100;
            const y = (e.clientY - window.innerHeight / 2) / 100;
            orbit3d.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        }
    });

    document.addEventListener('mouseleave', () => {
        if (orbit3d) orbit3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

    orbitIcons3d.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            orbit3d.style.animationPlayState = 'paused';
            this.style.boxShadow = '0 0 40px rgba(107, 46, 255, 0.8)';
            createParticles(this);
        });
        icon.addEventListener('mouseleave', function() {
            orbit3d.style.animationPlayState = 'running';
            this.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
        });
    });

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed; width: 4px; height: 4px; 
                background: var(--accent-color); border-radius: 50%; 
                pointer-events: none; z-index: 1000; left: ${x}px; top: ${y}px;
            `;
            document.body.appendChild(particle);
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const duration = 500 + Math.random() * 500;
            const animation = particle.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle)*speed*50}px,${Math.sin(angle)*speed*50}px) scale(0)`, opacity: 0 }
            ], { duration, easing: 'ease-out' });
            animation.onfinish = () => particle.remove();
        }
    }

    // -----------------------------
    // GLASSY NOTIFICATION
    // -----------------------------
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Show animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto close
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // -----------------------------
    // Contact Form
    // -----------------------------
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            fetch('http://localhost:3000/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            })
            .then(async response => {
                if (!response.ok) throw new Error('Network response not ok');
                return response.json();
            })
            .then(data => {
                showNotification(data.message, data.status === 'success' ? 'success' : 'error');
                if (data.status === 'success') contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            })
            .catch(err => {
                console.error(err);
                showNotification('Something went wrong. Please try again.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

});
