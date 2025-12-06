class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupNavigation();
        this.setupTypingAnimation();
        this.setupOrbitParticles();
        this.setupSkills();
        this.setupProjects();
        this.setupContactForm();
        this.setupSmoothScroll();
        this.setupCurrentYear();
        this.setupAccessibility();
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Simulate loading time
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }, 1500);
    }

    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', 
                hamburger.classList.contains('active').toString()
            );
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navHeight = document.querySelector('.navbar').offsetHeight;
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 100;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupTypingAnimation() {
        const nameElement = document.getElementById('typed-name');
        const subtitleElement = document.getElementById('typed-subtitle');
        
        const name = "John Doe";
        const subtitle = "Full Stack Developer";
        
        let nameIndex = 0;
        let subtitleIndex = 0;
        let isDeleting = false;
        let isTypingSubtitle = false;
        
        function typeWriter() {
            if (!isTypingSubtitle) {
                // Type name
                if (!isDeleting && nameIndex < name.length) {
                    nameElement.textContent += name.charAt(nameIndex);
                    nameIndex++;
                    setTimeout(typeWriter, 100);
                } else if (isDeleting && nameIndex > 0) {
                    nameElement.textContent = name.substring(0, nameIndex - 1);
                    nameIndex--;
                    setTimeout(typeWriter, 50);
                } else if (!isDeleting && nameIndex === name.length) {
                    // Pause before starting subtitle
                    setTimeout(() => {
                        isTypingSubtitle = true;
                        typeWriter();
                    }, 1000);
                }
            } else {
                // Type subtitle
                if (subtitleIndex < subtitle.length) {
                    subtitleElement.textContent += subtitle.charAt(subtitleIndex);
                    subtitleIndex++;
                    setTimeout(typeWriter, 100);
                }
            }
        }
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            // Start typing after a short delay
            setTimeout(() => {
                typeWriter();
            }, 500);
        } else {
            // Show text immediately for reduced motion
            nameElement.textContent = name;
            subtitleElement.textContent = subtitle;
        }
    }

    setupOrbitParticles() {
        const orbitContainer = document.querySelector('.portrait-container');
        const orbitParticles = [
            { icon: '<i class="fab fa-html5"></i>', color: '#e34f26' },
            { icon: '<i class="fab fa-css3-alt"></i>', color: '#1572b6' },
            { icon: '<i class="fab fa-js"></i>', color: '#f7df1e' },
            { icon: '<i class="fab fa-microsoft"></i>', color: '#00a4ef' },
            { icon: '<i class="fas fa-database"></i>', color: '#4cc9f0' },
            { icon: '<i class="fab fa-git-alt"></i>', color: '#f05032' },
            { icon: '<i class="fab fa-react"></i>', color: '#61dafb' },
            { icon: '<i class="fab fa-node-js"></i>', color: '#339933' }
        ];

        const radius = 180;
        const centerX = orbitContainer.offsetWidth / 2;
        const centerY = orbitContainer.offsetHeight / 2;
        let angle = 0;
        const speed = 0.005;

        orbitParticles.forEach((particle, index) => {
            const particleElement = document.createElement('div');
            particleElement.className = 'orbit-particle';
            particleElement.innerHTML = particle.icon;
            particleElement.style.color = particle.color;
            particleElement.style.borderColor = `${particle.color}40`;
            particleElement.style.boxShadow = `0 0 20px ${particle.color}40`;
            
            // Add description
            const description = document.createElement('div');
            description.className = 'skill-description';
            description.textContent = this.getSkillDescription(particle.icon);
            particleElement.appendChild(description);
            
            orbitContainer.appendChild(particleElement);
            
            // Store initial position
            const angleOffset = (index / orbitParticles.length) * Math.PI * 2;
            particleElement.dataset.angleOffset = angleOffset;
            particleElement.dataset.radius = radius * (0.8 + Math.random() * 0.4);
            particleElement.dataset.speed = speed * (0.8 + Math.random() * 0.4);
        });

        function animateOrbit() {
            const particles = document.querySelectorAll('.orbit-particle');
            const time = Date.now() * 0.001;
            
            particles.forEach(particle => {
                const angleOffset = parseFloat(particle.dataset.angleOffset);
                const radius = parseFloat(particle.dataset.radius);
                const speed = parseFloat(particle.dataset.speed);
                
                const x = centerX + Math.cos(time * speed + angleOffset) * radius;
                const y = centerY + Math.sin(time * speed + angleOffset) * radius;
                
                particle.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
            });
            
            requestAnimationFrame(animateOrbit);
        }

        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            animateOrbit();
        } else {
            // Static positions for reduced motion
            const particles = document.querySelectorAll('.orbit-particle');
            particles.forEach((particle, index) => {
                const angleOffset = (index / particles.length) * Math.PI * 2;
                const radius = 180;
                const x = centerX + Math.cos(angleOffset) * radius;
                const y = centerY + Math.sin(angleOffset) * radius;
                particle.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
            });
        }
    }

    getSkillDescription(icon) {
        const descriptions = {
            'fa-html5': 'HTML5 - Semantic markup & modern web structure',
            'fa-css3-alt': 'CSS3 - Advanced styling & animations',
            'fa-js': 'JavaScript - Interactive web functionality',
            'fa-microsoft': '.NET - Enterprise application development',
            'fa-database': 'Databases - MySQL, SQL Server, design & optimization',
            'fa-git-alt': 'Git - Version control & collaboration',
            'fa-react': 'React - Modern frontend framework',
            'fa-node-js': 'Node.js - Server-side JavaScript runtime'
        };
        
        for (const [key, description] of Object.entries(descriptions)) {
            if (icon.includes(key)) {
                return description;
            }
        }
        return 'Technical skill';
    }

    setupSkills() {
        const skillsData = {
            'Frontend': [
                { name: 'HTML5', level: 95, description: 'Semantic markup & accessibility' },
                { name: 'CSS3', level: 90, description: 'Advanced styling & animations' },
                { name: 'JavaScript', level: 88, description: 'Modern ES6+ & DOM manipulation' },
                { name: 'React', level: 85, description: 'Component-based UI development' },
                { name: 'TypeScript', level: 80, description: 'Type-safe JavaScript' }
            ],
            'Backend': [
                { name: 'C#', level: 92, description: '.NET Core & Framework development' },
                { name: 'ASP.NET', level: 90, description: 'Web API & MVC applications' },
                { name: 'Node.js', level: 75, description: 'Server-side JavaScript' },
                { name: 'Python', level: 70, description: 'Django & Flask frameworks' }
            ],
            'Database': [
                { name: 'MySQL', level: 88, description: 'Relational database management' },
                { name: 'SQL Server', level: 85, description: 'Microsoft database system' },
                { name: 'MongoDB', level: 75, description: 'NoSQL document database' },
                { name: 'Redis', level: 70, description: 'In-memory data structure store' }
            ],
            'Tools & Others': [
                { name: 'Git', level: 90, description: 'Version control system' },
                { name: 'Docker', level: 75, description: 'Containerization platform' },
                { name: 'Azure', level: 80, description: 'Cloud services & deployment' },
                { name: 'Windows Forms', level: 85, description: 'Desktop application development' },
                { name: 'MAUI', level: 78, description: 'Cross-platform mobile development' }
            ]
        };

        const skillsContainer = document.querySelector('.skills-container');
        
        for (const [category, skills] of Object.entries(skillsData)) {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'skill-category';
            
            const icon = this.getCategoryIcon(category);
            categoryElement.innerHTML = `
                <h3>${icon} ${category}</h3>
                <div class="skill-tags"></div>
            `;
            
            const tagsContainer = categoryElement.querySelector('.skill-tags');
            
            skills.forEach(skill => {
                const tag = document.createElement('div');
                tag.className = 'skill-tag';
                tag.textContent = skill.name;
                tag.dataset.filter = skill.name.toLowerCase();
                
                // Add description tooltip
                const description = document.createElement('div');
                description.className = 'skill-description';
                description.textContent = skill.description;
                tag.appendChild(description);
                
                // Add click handler for filtering
                tag.addEventListener('click', () => {
                    this.filterProjectsBySkill(skill.name);
                    document.querySelectorAll('.skill-tag').forEach(t => t.classList.remove('active'));
                    tag.classList.add('active');
                });
                
                tagsContainer.appendChild(tag);
            });
            
            skillsContainer.appendChild(categoryElement);
        }
    }

    getCategoryIcon(category) {
        const icons = {
            'Frontend': '<i class="fas fa-code"></i>',
            'Backend': '<i class="fas fa-server"></i>',
            'Database': '<i class="fas fa-database"></i>',
            'Tools & Others': '<i class="fas fa-tools"></i>'
        };
        return icons[category] || '<i class="fas fa-star"></i>';
    }

    setupProjects() {
        const projectsData = [
            {
                title: "Galaxy Dashboard",
                description: "A responsive admin dashboard with real-time analytics and dark theme",
                tech: ['C#', 'ASP.NET', 'MySQL', 'JavaScript', 'Chart.js'],
                category: 'web',
                demo: "#",
                code: "#"
            },
            {
                title: "E-Commerce Platform",
                description: "Full-featured online store with payment integration and admin panel",
                tech: ['ASP.NET Core', 'Entity Framework', 'SQL Server', 'React', 'Stripe'],
                category: 'web',
                demo: "#",
                code: "#"
            },
            {
                title: "Task Manager Pro",
                description: "Cross-platform task management application with cloud sync",
                tech: ['MAUI', 'C#', 'Azure', 'SQLite', 'XAML'],
                category: 'mobile',
                demo: "#",
                code: "#"
            },
            {
                title: "Weather Analytics",
                description: "Real-time weather data visualization with predictive analytics",
                tech: ['Python', 'Django', 'PostgreSQL', 'D3.js', 'Redis'],
                category: 'data',
                demo: "#",
                code: "#"
            },
            {
                title: "Inventory System",
                description: "Desktop application for inventory management with barcode scanning",
                tech: ['Windows Forms', 'C#', 'MySQL', 'Report Viewer', 'ZXing'],
                category: 'desktop',
                demo: "#",
                code: "#"
            },
            {
                title: "API Gateway",
                description: "Microservices API gateway with authentication and rate limiting",
                tech: ['.NET 6', 'Ocelot', 'JWT', 'Docker', 'Redis'],
                category: 'backend',
                demo: "#",
                code: "#"
            }
        ];

        const projectsGrid = document.querySelector('.projects-grid');
        const filterContainer = document.querySelector('.project-filters');
        
        // Extract unique tech for filters
        const allTech = [...new Set(projectsData.flatMap(p => p.tech))];
        
        // Create filter buttons
        allTech.forEach(tech => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = tech;
            button.dataset.filter = tech.toLowerCase();
            
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.filterProjectsByTech(tech);
            });
            
            filterContainer.appendChild(button);
        });
        
        // Create project cards
        projectsData.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.tech = project.tech.map(t => t.toLowerCase()).join(' ');
            card.dataset.category = project.category;
            
            card.innerHTML = `
                <div class="project-image">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.demo}" class="project-link demo" target="_blank" rel="noopener">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                        <a href="${project.code}" class="project-link code" target="_blank" rel="noopener">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(card);
        });
        
        // Add event listener to "All Projects" button
        document.querySelector('.filter-btn[data-filter="all"]').addEventListener('click', () => {
            this.showAllProjects();
        });
    }

    filterProjectsByTech(tech) {
        const projects = document.querySelectorAll('.project-card');
        const techLower = tech.toLowerCase();
        
        projects.forEach(project => {
            if (project.dataset.tech.includes(techLower)) {
                project.style.display = 'block';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, 100);
            } else {
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
    }

    filterProjectsBySkill(skill) {
        this.filterProjectsByTech(skill);
    }

    showAllProjects() {
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach(project => {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const formMessage = document.getElementById('form-message');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Honeypot check
            const honeypot = document.getElementById('website');
            if (honeypot.value.trim() !== '') {
                // Likely a bot
                this.showFormMessage(formMessage, 'Submission blocked', 'error');
                return;
            }
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            try {
                // In a real application, this would be your ASP.NET Core API endpoint
                const apiUrl = 'https://your-api-domain.com/api/contact';
                
                // For demo purposes, simulate API call
                await this.simulateApiCall(formData);
                
                // Show success message
                this.showFormMessage(formMessage, 'Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showFormMessage(formMessage, 'Failed to send message. Please try again later.', 'error');
                
            } finally {
                // Reset button state
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    async simulateApiCall(formData) {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random failures for demo
                if (Math.random() > 0.2) {
                    resolve({ success: true, message: 'Message received' });
                } else {
                    reject(new Error('API Error'));
                }
            }, 1500);
        });
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--error-red)';
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-red)';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.25rem';
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showFormMessage(element, message, type) {
        element.textContent = message;
        element.className = `form-message ${type}`;
        element.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add focus styles for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add CSS for focus styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--accent-cyan) !important;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// Handle image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});