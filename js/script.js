// js/script.js - Main JavaScript for Stimela's Street Couture

document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. SCROLL TO TOP BUTTON ==========
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-top-btn';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        scrollBtn.classList.toggle('show', window.scrollY > 300);
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== 2. NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                navbar.style.paddingTop = '12px';
                navbar.style.paddingBottom = '12px';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                navbar.style.paddingTop = '16px';
                navbar.style.paddingBottom = '16px';
            }
        });
    }

    // ========== 3. CONTACT FORM - BEST VALIDATION ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const fields = {
            name: { el: document.getElementById('name'), valid: false },
            email: { el: document.getElementById('email'), valid: false },
            phone: { el: document.getElementById('phone'), valid: true },
            subject: { el: document.getElementById('subject'), valid: false },
            message: { el: document.getElementById('message'), valid: false }
        };

        // Validation rules
        const validators = {
            name: (val) => {
                if (!val.trim()) return 'Please enter your full name.';
                if (val.trim().length < 2) return 'Name must be at least 2 characters.';
                if (val.trim().length > 100) return 'Name is too long.';
                if (!/^[a-zA-Z\s'-]+$/.test(val.trim())) return 'Name contains invalid characters.';
                return '';
            },
            email: (val) => {
                if (!val.trim()) return 'Please enter your email address.';
                const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!re.test(val.trim())) return 'Please enter a valid email address.';
                if (val.trim().length > 254) return 'Email address is too long.';
                return '';
            },
            phone: (val) => {
                if (!val.trim()) return '';
                const re = /^[+]?[\d\s()-]{7,20}$/;
                if (!re.test(val.trim())) return 'Please enter a valid phone number.';
                return '';
            },
            subject: (val) => {
                if (!val) return 'Please select a subject.';
                return '';
            },
            message: (val) => {
                if (!val.trim()) return 'Please enter your message.';
                if (val.trim().length < 10) return 'Message must be at least 10 characters.';
                if (val.trim().length > 5000) return 'Message is too long (max 5000 characters).';
                return '';
            }
        };

        // Real-time validation on blur (when user leaves field)
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            if (!field.el) return;

            field.el.addEventListener('blur', function() {
                validateField(key);
            });

            field.el.addEventListener('input', function() {
                if (this.dataset.touched === 'true') {
                    validateField(key);
                }
            });

            field.el.addEventListener('focus', function() {
                this.dataset.touched = 'true';
            });
        });

        function validateField(key) {
            const field = fields[key];
            if (!field || !field.el) return true;

            const validator = validators[key];
            if (!validator) return true;

            const error = validator(field.el.value);
            const feedbackEl = field.el.parentNode.querySelector('.invalid-feedback');
            const existingError = field.el.parentNode.querySelector('.field-error');

            // Remove existing custom error messages
            if (existingError) existingError.remove();

            if (error) {
                field.el.classList.add('is-invalid');
                field.el.classList.remove('is-valid');
                field.valid = false;

                // Update Bootstrap feedback or create custom
                if (feedbackEl) {
                    feedbackEl.textContent = error;
                } else {
                    const errDiv = document.createElement('div');
                    errDiv.className = 'invalid-feedback field-error';
                    errDiv.textContent = error;
                    field.el.parentNode.appendChild(errDiv);
                }
                return false;
            } else {
                field.el.classList.remove('is-invalid');
                field.el.classList.add('is-valid');
                field.valid = true;
                return true;
            }
        }

        // Form submit handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Mark all fields as touched
            Object.keys(fields).forEach(key => {
                if (fields[key].el) fields[key].el.dataset.touched = 'true';
            });

            // Validate all fields
            let isFormValid = true;
            Object.keys(fields).forEach(key => {
                if (!validateField(key)) isFormValid = false;
            });

            // Remove old success messages
            const oldSuccess = contactForm.querySelector('.alert-success');
            if (oldSuccess) oldSuccess.remove();

            if (isFormValid) {
                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-success mt-4';
                successDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i> Thank you! Your message has been sent successfully. We\'ll get back to you within 48 hours.';
                contactForm.appendChild(successDiv);
                contactForm.reset();

                // Reset validation states
                Object.keys(fields).forEach(key => {
                    if (fields[key].el) {
                        fields[key].el.classList.remove('is-valid', 'is-invalid');
                        fields[key].valid = false;
                        delete fields[key].el.dataset.touched;
                    }
                });

                setTimeout(() => successDiv.remove(), 6000);
            } else {
                // Scroll to first error
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // ========== 4. COLLECTION FILTERING ==========
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collectionItems = document.querySelectorAll('.collection-item');

    if (filterButtons.length > 0 && collectionItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active-filter'));
                this.classList.add('active-filter');
                const filterValue = this.getAttribute('data-filter');
                collectionItems.forEach(item => {
                    item.classList.toggle('hide-item', filterValue !== 'all' && item.getAttribute('data-category') !== filterValue);
                });
            });
        });
    }

    // ========== 5. NEWSLETTER SUBSCRIPTION WITH VALIDATION ==========
    const newsletterInputs = document.querySelectorAll('footer .input-group input');
    const newsletterBtns = document.querySelectorAll('footer .input-group button');

    newsletterBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const emailInput = newsletterInputs[index];
            const feedbackEl = emailInput?.closest('.input-group')?.parentNode?.querySelector('small');
            
            if (emailInput) {
                const email = emailInput.value.trim();
                const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (!email) {
                    if (feedbackEl) {
                        feedbackEl.textContent = 'Please enter your email address.';
                        feedbackEl.className = 'text-warning mt-1 d-block small';
                    } else {
                        alert('Please enter your email address.');
                    }
                } else if (!re.test(email)) {
                    if (feedbackEl) {
                        feedbackEl.textContent = 'Please enter a valid email address.';
                        feedbackEl.className = 'text-warning mt-1 d-block small';
                    } else {
                        alert('Please enter a valid email address.');
                    }
                } else {
                    if (feedbackEl) {
                        feedbackEl.textContent = 'Thank you for subscribing!';
                        feedbackEl.className = 'text-success mt-1 d-block small';
                    } else {
                        alert('Thank you for subscribing to our newsletter!');
                    }
                    emailInput.value = '';
                }
            }
        });

        // Allow Enter key
        const emailInput = newsletterInputs[index];
        if (emailInput) {
            emailInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    btn.click();
                }
            });
        }
    });

    // ========== 6. SHOPPING BAG & SEARCH ==========
    const bagIcon = document.querySelector('.bag-icon');
    if (bagIcon) {
        bagIcon.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }

    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchTerm = prompt('Search Stimela\'s Street Couture:', '');
            if (searchTerm && searchTerm.trim()) {
                // Simple search redirect
                window.location.href = 'shop.html?search=' + encodeURIComponent(searchTerm.trim());
            }
        });
    }

    // ========== 7. SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== 8. PAGE FADE IN ==========
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

});
