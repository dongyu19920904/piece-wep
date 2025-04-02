// Language switching functionality
let currentLang = localStorage.getItem('preferred-language') || 'en';

// Function to update content based on language
function updateContent(lang) {
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[lang];
        
        // Navigate through the translation object
        for (const k of keys) {
            value = value[k];
        }
        
        if (value) {
            element.textContent = value;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Add click event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            currentLang = lang;
            localStorage.setItem('preferred-language', lang);
            updateContent(lang);
            
            // Update active state of language buttons
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('bg-gray-100', 'text-primary');
            });
            this.classList.add('bg-gray-100', 'text-primary');
        });
    });
    
    // Set initial language
    updateContent(currentLang);
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuButton.setAttribute('aria-expanded', !expanded);
            mobileMenu.classList.toggle('hidden');
            
            // Change icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.setAttribute('data-lucide', 'menu');
                } else {
                    icon.setAttribute('data-lucide', 'x');
                }
                lucide.createIcons();
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (mobileMenuButton) {
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                        const icon = mobileMenuButton.querySelector('i');
                        if (icon) {
                            icon.setAttribute('data-lucide', 'menu');
                            lucide.createIcons();
                        }
                    }
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Clear previous error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!name) {
                isValid = false;
                showError('name', 'Please enter your name');
            }
            
            // Validate email
            if (!email) {
                isValid = false;
                showError('email', 'Please enter your email');
            } else if (!isValidEmail(email)) {
                isValid = false;
                showError('email', 'Please enter a valid email');
            }
            
            // Validate message
            if (!message) {
                isValid = false;
                showError('message', 'Please enter your message');
            }
            
            if (isValid) {
                // In a real implementation, we would submit the form to a backend
                // For this demo, we'll just show a success message
                
                // Clear the form
                contactForm.reset();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'mt-4 p-3 bg-green-50 text-green-800 rounded-md';
                successMessage.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.appendChild(successMessage);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Helper function to show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('border-red-500');
            
            const errorMessage = document.createElement('p');
            errorMessage.className = 'mt-1 text-sm text-red-600 error-message';
            errorMessage.textContent = message;
            
            field.parentNode.appendChild(errorMessage);
            
            // Remove error state on input
            field.addEventListener('input', function() {
                field.classList.remove('border-red-500');
                const error = field.parentNode.querySelector('.error-message');
                if (error) error.remove();
            }, { once: true });
        }
    }
    
    // Prevent zooming
    window.addEventListener("wheel", (e) => {
        const isPinching = e.ctrlKey;
        if (isPinching) e.preventDefault();
    }, { passive: false });
});
