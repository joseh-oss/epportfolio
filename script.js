// ===== NETWORK CANVAS ANIMATION =====
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let nodes = [];
let animFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createNodes() {
    nodes = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 25000), 60);
    for (let i = 0; i < count; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 1.5 + 0.5
        });
    }
}

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxDist = 150;

    // Update positions
    nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                const alpha = (1 - dist / maxDist) * 0.3;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    // Draw nodes
    nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
        ctx.fill();
    });

    animFrame = requestAnimationFrame(drawNetwork);
}

resizeCanvas();
createNodes();
drawNetwork();

window.addEventListener('resize', () => {
    resizeCanvas();
    createNodes();
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close menu on link click
navItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== SCROLL REVEAL =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate skill bars when visible
            if (entry.target.querySelector('.skill-fill')) {
                entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 200);
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// ===== SKILL BARS =====
// Observe the skills grid to trigger bar animations
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.skill-fill').forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 300);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxContent = document.getElementById('lightboxContent');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const title = item.getAttribute('data-title') || 'Design Project';
        const desc = item.getAttribute('data-desc') || '';
        const img = item.querySelector('.gallery-thumb img');

        if (img) {
            // Real image — show full preview
            lightboxContent.innerHTML = `
                <div style="text-align:center; max-width:600px;">
                    <img src="${img.src}" alt="${img.alt}" style="width:100%; border-radius:12px; box-shadow:0 8px 40px rgba(0,0,0,0.5);">
                    <h3 style="font-size:1.2rem; margin-top:20px; color:#e8eaf0;">${title}</h3>
                    <p style="color:#a0a8b8; font-size:0.88rem; margin-top:6px; line-height:1.6;">${desc}</p>
                </div>
            `;
        } else {
            // Placeholder — show coming soon
            const icon = item.querySelector('.gallery-placeholder i').className;
            lightboxContent.innerHTML = `
                <div style="text-align:center; padding:40px;">
                    <i class="${icon}" style="font-size:4rem; color:#00d4ff; margin-bottom:20px;"></i>
                    <h3 style="font-size:1.5rem; margin-bottom:10px; color:#e8eaf0;">${title}</h3>
                    <p style="color:#a0a8b8; font-size:0.95rem;">${desc}</p>
                </div>
            `;
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== CONTACT FORM (Web3Forms) =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if access key is still placeholder
        const accessKey = contactForm.querySelector('input[name="access_key"]').value;
        if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
            formStatus.innerHTML = '<span class="status-error"><i class="fas fa-exclamation-circle"></i> Form not configured yet — see setup instructions.</span>';
            formStatus.style.display = 'block';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formStatus.style.display = 'none';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                formStatus.innerHTML = '<span class="status-success"><i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.</span>';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                formStatus.innerHTML = '<span class="status-error"><i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again or email me directly.</span>';
                formStatus.style.display = 'block';
            }
        } catch (error) {
            formStatus.innerHTML = '<span class="status-error"><i class="fas fa-exclamation-circle"></i> Network error. Please check your connection and try again.</span>';
            formStatus.style.display = 'block';
        }

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    });
});

// ===== TYPED EFFECT FOR HERO GREETING =====
// (Subtle enhancement — the greeting fades in via CSS already)