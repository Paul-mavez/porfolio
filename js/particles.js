class GalaxyParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.isWebGLAvailable = this.detectWebGL();
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    init() {
        this.resizeCanvas();
        
        if (this.isWebGLAvailable) {
            this.createWebGLParticles();
        } else {
            this.createCanvasParticles();
        }
    }

    createWebGLParticles() {
        // Create WebGL particles for better performance
        const particleCount = window.innerWidth < 768 ? 100 : 200;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
                originalX: Math.random() * this.canvas.width,
                originalY: Math.random() * this.canvas.height,
                type: Math.random() > 0.8 ? 'star' : 'particle'
            });
        }
    }

    createCanvasParticles() {
        // Fallback for non-WebGL browsers
        const particleCount = window.innerWidth < 768 ? 50 : 100;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.3 - 0.15,
                speedY: Math.random() * 0.3 - 0.15,
                color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
                originalX: Math.random() * this.canvas.width,
                originalY: Math.random() * this.canvas.height,
                type: Math.random() > 0.7 ? 'star' : 'particle'
            });
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw milky way band
        this.drawMilkyWay();
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            
            if (particle.type === 'star') {
                // Draw twinkling stars
                const twinkle = Math.sin(Date.now() * 0.001 + particle.originalX) * 0.3 + 0.7;
                this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = 'white';
            } else {
                this.ctx.fillStyle = particle.color;
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = particle.color;
            }
            
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        // Draw constellation lines
        this.drawConstellations();
    }

    drawMilkyWay() {
        const gradient = this.ctx.createLinearGradient(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2);
        gradient.addColorStop(0, 'rgba(29, 38, 113, 0.1)');
        gradient.addColorStop(0.5, 'rgba(76, 201, 240, 0.15)');
        gradient.addColorStop(1, 'rgba(29, 38, 113, 0.1)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.canvas.height / 2 - 100, this.canvas.width, 200);
    }

    drawConstellations() {
        this.ctx.strokeStyle = 'rgba(76, 201, 240, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = 1 - (distance / 150);
                    this.ctx.globalAlpha = opacity * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                
                particle.x -= Math.cos(angle) * force * 5;
                particle.y -= Math.sin(angle) * force * 5;
            }
            
            // Return to original position with easing
            particle.x += (particle.originalX - particle.x) * 0.02;
            particle.y += (particle.originalY - particle.y) * 0.02;
            
            // Add drift
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX = -particle.speedX;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY = -particle.speedY;
            }
            
            // Parallax effect on scroll
            const scrollY = window.scrollY;
            particle.originalY += scrollY * 0.05;
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles.forEach(particle => {
                particle.originalX = Math.random() * this.canvas.width;
                particle.originalY = Math.random() * this.canvas.height;
            });
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }, { passive: false });

        window.addEventListener('touchstart', (e) => {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });

        // Handle scroll for parallax
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('galaxyCanvas');
    if (canvas) {
        new GalaxyParticles(canvas);
    }
});