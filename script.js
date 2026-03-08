// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Enhanced Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Handle staff login separately
        if (href === '#' && this.id === 'navStaffLogin') {
            e.preventDefault();
            if (staffModal) {
                staffModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
            return;
        }

        // Skip if href is just '#' without valid target
        if (href === '#' || href.length <= 1) {
            return;
        }

        e.preventDefault();

        try {
            const target = document.querySelector(href);
            if (target) {
                // Close mobile menu if open
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');

                // Smooth scroll to target with offset for fixed header
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.warn('Invalid selector:', href, error);
        }
    });
});

// Enhanced Modal functionality
const bookingModal = document.getElementById('bookingModal');
const quoteModal = document.getElementById('quoteModal');
const bookBtns = document.querySelectorAll('.book-btn');
const quoteBtns = document.querySelectorAll('.quote-btn');
const closeBtns = document.querySelectorAll('.close, .quote-close');

// Open booking modal
if (bookingModal) {
    bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bookingModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            addModalParallax();
        });
    });
}

// Open quote modal
if (quoteModal) {
    quoteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quoteModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            addModalParallax();
        });
    });
}

// Close modals
closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (bookingModal) bookingModal.style.display = 'none';
        if (quoteModal) quoteModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        removeModalParallax();
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === bookingModal || e.target === quoteModal) {
        bookingModal.style.display = 'none';
        quoteModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        removeModalParallax();
    }
});

// Add modal parallax effect
function addModalParallax() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            modalContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

function removeModalParallax() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'translateY(-20px)';
    }
}

// Form submissions
const contactForm = document.getElementById('contactForm');
const bookingForm = document.getElementById('bookingForm');

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form inputs using proper selectors
        const nameInput = contactForm.querySelector('input[placeholder="Full Name *"]');
        const emailInput = contactForm.querySelector('input[placeholder="Email *"]');
        const phoneInput = contactForm.querySelector('input[placeholder="Phone Number *"]');
        const messageInput = contactForm.querySelector('textarea[placeholder="Message *"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        // Validate required fields
        if (!name || !email || !phone || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const contactData = { name, email, phone, message };

        try {
            // Send to Formspree
            const response = await fetch('https://formspree.io/f/mrbaoywb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...contactData,
                    _subject: 'New Contact Message - AI BABA AUTO DETAILING AND TINTING',
                    _replyto: contactData.email,
                    form_type: 'contact'
                })
            });

            if (response.ok) {
                // Also save to local storage as backup
                const contactData = {
                    id: 'MSG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    submittedAt: new Date().toISOString()
                };

                let messages = JSON.parse(localStorage.getItem('aibabaMessages') || '[]');
                messages.push(contactData);
                localStorage.setItem('aibabaMessages', JSON.stringify(messages));

                showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            showNotification('Failed to submit message. Please try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Enhanced booking form with local storage - apply to all booking forms
if (bookingForm) {
    setupBookingForm(bookingForm);
}

// Also setup booking forms that might be dynamically created or on other pages
document.addEventListener('DOMContentLoaded', function() {
    // Find all booking forms on the page
    const allBookingForms = document.querySelectorAll('#bookingForm, .booking-form, form[id*="booking"]');
    allBookingForms.forEach(form => {
        if (!form.hasAttribute('data-setup')) {
            setupBookingForm(form);
            form.setAttribute('data-setup', 'true');
        }
    });
});

// Function to setup any booking form
function setupBookingForm(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form inputs using the exact selectors that match the HTML form
        const nameInput = form.querySelector('input[name="name"]') || form.querySelector('input[placeholder="Your Full Name"]') || form.querySelector('input[placeholder="Full Name"]');
        const emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[placeholder="Email Address"]');
        const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[placeholder="Phone Number (with area code)"]');
        const packageSelect = form.querySelector('select[name="package"]');
        const dateInput = form.querySelector('input[name="date"]');
        const timeSelect = form.querySelector('select[name="time"]');
        const vehicleTextarea = form.querySelector('textarea[name="vehicleDetails"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const packageValue = packageSelect ? packageSelect.value : '';
        const date = dateInput ? dateInput.value : '';
        const time = timeSelect ? timeSelect.value : '';
        const vehicleDetails = vehicleTextarea ? vehicleTextarea.value.trim() : '';
        const serviceLocation = form.querySelector('select[name="serviceLocation"]')?.value || '';
        const customerAddress = form.querySelector('input[name="customerAddress"]')?.value.trim() || '';

        let isValid = true;
        let errorMessage = '';

        if (!name) {
            errorMessage = 'Please enter your full name';
            isValid = false;
        } else if (!email || !isValidEmail(email)) {
            errorMessage = 'Please enter your valid email address';
            isValid = false;
        } else if (!phone) {
            errorMessage = 'Please enter your phone number';
            isValid = false;
        } else if (!packageValue) {
            errorMessage = 'Please select a package';
            isValid = false;
        } else if (!serviceLocation) {
            errorMessage = 'Please choose service location (Shop or Mobile)';
            isValid = false;
        } else if (serviceLocation === 'mobile' && !customerAddress) {
            errorMessage = 'Please enter your address for mobile service';
            isValid = false;
        } else if (!date) {
            errorMessage = 'Please select a date';
            isValid = false;
        } else if (!time) {
            errorMessage = 'Please select a time slot';
            isValid = false;
        } else if (!vehicleDetails) {
            errorMessage = 'Please enter your vehicle details';
            isValid = false;
        }

        if (isValid) {
            // Get the current service page information
            const currentPage = window.location.pathname;
            let servicePage = 'Main Website';

            if (currentPage.includes('window-tinting')) {
                servicePage = 'Automotive Window Tinting';
            } else if (currentPage.includes('commercial-residential')) {
                servicePage = 'Commercial & Residential Tinting';
            } else if (currentPage.includes('detailing')) {
                servicePage = 'Car Detailing Services';
            } else if (currentPage.includes('ceramic-coating')) {
                servicePage = 'Ceramic Coating Services';
            } else if (currentPage.includes('service-selector')) {
                servicePage = 'Service Selector Page';
            }

            // Get form data using the validated values
            const bookingData = {
                id: 'BKG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
                name: name,
                email: email,
                phone: phone,
                package: packageValue,
                serviceLocation: serviceLocation,
                customerAddress: serviceLocation === 'mobile' ? customerAddress : '',
                date: date,
                time: time,
                vehicleDetails: vehicleDetails,
                submittedAt: new Date().toISOString(),
                status: 'pending'
            };

            // Show loading state
            const submitBtn = e.target.querySelector('.btn-book-submit');
            if (!submitBtn) return;

            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            try {
                // Send to Formspree
                const response = await fetch('https://formspree.io/f/movlllza', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...bookingData,
                        service_source_page: servicePage,
                        current_page_url: window.location.href,
                        _subject: `New Booking Request from ${servicePage} - AI BABA AUTO DETAILING AND TINTING`,
                        _replyto: bookingData.email,
                        form_type: 'booking'
                    })
                });

                if (response.ok) {
                    // Also save to local storage as backup
                    let bookings = JSON.parse(localStorage.getItem('aibabaBookings') || '[]');
                    bookings.push(bookingData);
                    localStorage.setItem('aibabaBookings', JSON.stringify(bookings));

                    showNotification('Booking submitted successfully! We will contact you soon.', 'success');
                    form.reset();
                    if (bookingModal) {
                        bookingModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }

                    setTimeout(() => {
                        showNotification('📧 Check your email for booking confirmation details!', 'info');
                    }, 1500);
                } else {
                    throw new Error('Failed to submit booking');
                }
            } catch (error) {
                console.error('Error submitting booking:', error);
                showNotification('Failed to submit booking. Please try again.', 'error');
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } else {
            showNotification(`⚠️ ${errorMessage}`, 'error');
        }
    });
}


// Navbar background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 26, 46, 0.95)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .pricing-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// EmailJS functionality has been removed

// Email functionality removed - data is saved locally only
function sendBookingConfirmation(bookingData) {
    console.log('Booking confirmation would be sent for:', bookingData.id);
}

function sendQuoteConfirmation(quoteData) {
    console.log('Quote confirmation would be sent for:', quoteData.id);
}

function sendContactConfirmation(contactData) {
    console.log('Contact confirmation would be sent for:', contactData.id);
}

// FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = '0';
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});

// Add loading animation and session check
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Check if staff is already logged in
    const session = checkStaffSession();
    if (session.isLoggedIn) {
        // Auto-show dashboard if logged in
        showNotification(`Welcome back, ${session.staff.name}!`, 'info');
    }
});

// Pricing Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingContents = document.querySelectorAll('.pricing-tab-content');

    pricingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            const content = document.getElementById(`${tabId}-pricing`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
});

// Pricing card hover effects
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
            card.style.transform = 'translateY(0) scale(1)';
        } else {
            card.style.transform = 'translateY(0) scale(1.05)';
        }
    });
});

// Removed parallax effect to prevent content mixing during scroll
// Hero section now maintains fixed positioning

// Add typing effect to hero title
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    // Start typing effect after page loads
    setTimeout(typeWriter, 1000);
}

// Add smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15 });

revealSections.forEach(section => {
    revealObserver.observe(section);
});

// Staff Login Functionality
const staffLoginBtn = document.getElementById('staffLoginBtn');
const navStaffLogin = document.getElementById('navStaffLogin');
const staffModal = document.getElementById('staffModal');
const staffClose = document.getElementById('staffClose');
const staffLoginForm = document.getElementById('staffLoginForm');
const staffDashboard = document.getElementById('staffDashboard');
const logoutBtn = document.getElementById('logoutBtn');

// Open staff modal
if (staffLoginBtn && staffModal) {
    staffLoginBtn.addEventListener('click', () => {
        staffModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}

// Open staff modal from navigation
if (navStaffLogin && staffModal) {
    navStaffLogin.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        staffModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}

// Close staff modal
if (staffClose && staffModal) {
    staffClose.addEventListener('click', () => {
        staffModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Staff login form submission with simple client-side authentication
if (staffLoginForm) {
    staffLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!checkRateLimit()) return;

        const staffId = e.target.querySelector('input[type="text"]').value.trim();
        const password = e.target.querySelector('input[type="password"]').value;

        if (!staffId || !password) {
            showNotification('Please enter both Staff ID and Password.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('.btn-staff-login');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        submitBtn.disabled = true;

        // Dynamic staff authentication
        setTimeout(() => {
            // Get staff accounts from localStorage
            const staffAccounts = JSON.parse(localStorage.getItem('staffAccounts') || '{}');

            // Fallback to default credentials if no staff accounts exist
            const defaultCredentials = {
                'admin': {
                    password: 'aibaba2024',
                    name: 'Administrator',
                    role: 'admin',
                    email: 'admin@aibaba.com',
                    permissions: ['bookings', 'quotes', 'messages', 'reviews', 'invoices', 'staff', 'super-admin'],
                    canManageAllUsers: true,
                    isSuper: true
                },
                'manager': { password: 'mgr2024', name: 'Manager', role: 'manager', email: 'manager@aibaba.com', permissions: ['bookings', 'quotes', 'messages', 'reviews', 'invoices'] },
                'tech': { password: 'tech2024', name: 'Technician', role: 'technician', email: 'tech@aibaba.com', permissions: ['bookings', 'quotes'] }
            };

            let isValidLogin = false;
            let staffData = null;

            // Enhanced login authentication - support multiple login methods
            let foundAccount = null;
            let accountKey = null;
            const loginInput = staffId.toLowerCase().replace(/\s+/g, '');

            // Try to find account by different methods (priority order)
            for (const [key, account] of Object.entries(staffAccounts)) {
                // Method 1: Exact staff ID match (highest priority)
                if (account.staffId && account.staffId.toUpperCase() === staffId.toUpperCase()) {
                    foundAccount = account;
                    accountKey = key;
                    break;
                }

                // Method 2: Username match (e.g., hajizoro)
                if (account.username && account.username.toLowerCase() === loginInput) {
                    foundAccount = account;
                    accountKey = key;
                    break;
                }

                // Method 3: Email match
                if (account.email && account.email.toLowerCase() === staffId.toLowerCase()) {
                    foundAccount = account;
                    accountKey = key;
                    break;
                }

                // Method 4: Name match (generate username from name)
                if (account.name) {
                    const generatedUsername = account.name.toLowerCase().replace(/\s+/g, '');
                    if (generatedUsername === loginInput) {
                        foundAccount = account;
                        accountKey = key;
                        break;
                    }
                }

                // Method 5: Key-based lookup (backward compatibility)
                if (key.toLowerCase() === loginInput) {
                    foundAccount = account;
                    accountKey = key;
                    break;
                }
            }

            if (foundAccount) {
                // Check if account is active
                if ((foundAccount.status || 'active') === 'inactive') {
                    showNotification('❌ Account is deactivated. Contact administrator.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                // Check password
                if (foundAccount.password === password) {
                    isValidLogin = true;
                    staffData = {
                        staffId: foundAccount.staffId || accountKey,
                        name: foundAccount.name,
                        email: foundAccount.email,
                        role: foundAccount.role,
                        permissions: foundAccount.permissions || [],
                        canManageAllUsers: foundAccount.canManageAllUsers || false,
                        isSuper: foundAccount.isSuper || false,
                        loginTime: new Date().toISOString()
                    };

                    // Update last login time
                    foundAccount.lastLogin = new Date().toISOString();
                    staffAccounts[accountKey] = foundAccount;
                    localStorage.setItem('staffAccounts', JSON.stringify(staffAccounts));
                }
            }
            // Fallback to default credentials - STRICT CHECK
            else if (defaultCredentials[staffId.toLowerCase()]) {
                const defaultAccount = defaultCredentials[staffId.toLowerCase()];
                // Must match both username and password exactly
                if (defaultAccount.password === password) {
                    isValidLogin = true;
                    staffData = {
                        staffId: staffId.toLowerCase(),
                        name: defaultAccount.name,
                        email: defaultAccount.email,
                        role: defaultAccount.role,
                        permissions: defaultAccount.permissions || ['bookings', 'quotes', 'messages', 'reviews', 'invoices'],
                        canManageAllUsers: defaultAccount.canManageAllUsers || false,
                        isSuper: defaultAccount.isSuper || false,
                        loginTime: new Date().toISOString()
                    };
                }
            }

            if (isValidLogin) {
                // Reset login attempts on successful login
                loginAttempts = 0;
                lockoutTime = null;

                // Store staff session
                localStorage.setItem('staffSession', JSON.stringify(staffData));

                // Hide modal
                staffModal.style.display = 'none';
                document.body.style.overflow = 'auto';

                // Clear form for security
                staffLoginForm.reset();

                // Show success message
                showNotification(`Welcome ${staffData.name}! Access granted.`, 'success');

                // Redirect to staff dashboard page
                setTimeout(() => {
                    window.location.href = 'staff-dashboard.html';
                }, 1000);
            } else {
                loginAttempts++;

                if (loginAttempts >= maxAttempts) {
                    lockoutTime = Date.now() + 30000; // 30 second lockout
                    showNotification('Too many failed attempts. Account temporarily locked.', 'error');
                } else {
                    const remainingAttempts = maxAttempts - loginAttempts;
                    showNotification(`Invalid credentials. ${remainingAttempts} attempts remaining.`, 'error');
                }

                // Clear password field for security
                e.target.querySelector('input[type="password"]').value = '';
            }

            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}

// Forgot Password functionality
const forgotPasswordLink = document.querySelector('.forgot-link');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPasswordModal();
    });
}

function showForgotPasswordModal() {
    const forgotModal = document.createElement('div');
    forgotModal.className = 'forgot-password-modal';
    forgotModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    forgotModal.innerHTML = `
        <div class="forgot-modal-content" style="
            background: linear-gradient(145deg, #ffffff 0%, #f8fafe 50%, #e8f4fd 100%);
            border-radius: 20px;
            padding: 2rem;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
            border: 3px solid rgba(0, 212, 255, 0.4);
            position: relative;
        ">
            <div class="forgot-header" style="
                text-align: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid rgba(0, 212, 255, 0.2);
            ">
                <i class="fas fa-key" style="
                    font-size: 3rem;
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 1rem;
                "></i>
                <h2 style="
                    color: #1a1a2e;
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin: 0;
                ">Reset Password</h2>
                <p style="
                    color: #6c757d;
                    margin: 0.5rem 0 0 0;
                    font-size: 1rem;
                ">Enter your staff email address</p>
            </div>

            <form class="forgot-password-form" style="margin-bottom: 1.5rem;">
                <div class="input-group" style="
                    position: relative;
                    margin-bottom: 2rem;
                ">
                    <i class="fas fa-envelope" style="
                        position: absolute;
                        left: 20px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #00d4ff;
                        z-index: 2;
                        font-size: 1.2rem;
                    "></i>
                    <input type="email" placeholder="Staff Email Address" required style="
                        padding-left: 55px;
                        width: 100%;
                        padding: 18px 25px;
                        border: 2px solid rgba(0, 212, 255, 0.2);
                        border-radius: 15px;
                        font-family: inherit;
                        font-size: 1.05rem;
                        background: linear-gradient(135deg, #ffffff 0%, #f8fafe 100%);
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                        transition: all 0.3s ease;
                        box-sizing: border-box;
                    ">
                </div>

                <button type="submit" class="btn-reset-password" style="
                    width: 100%;
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    color: white;
                    border: none;
                    padding: 18px;
                    border-radius: 15px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-paper-plane"></i>
                    Send Reset Link
                </button>
            </form>

            <div class="forgot-footer" style="
                text-align: center;
                padding-top: 1rem;
                border-top: 1px solid rgba(0, 212, 255, 0.2);
            ">
                <button class="btn-back-login" style="
                    background: transparent;
                    color: #00d4ff;
                    border: 2px solid #00d4ff;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-right: 1rem;
                ">
                    <i class="fas fa-arrow-left"></i> Back to Login
                </button>
                <button class="btn-close-forgot" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>

            <button class="close-forgot-modal" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #6c757d;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            ">×</button>
        </div>
    `;

    document.body.appendChild(forgotModal);
    document.body.style.overflow = 'hidden';

    // Handle form submission
    const forgotForm = forgotModal.querySelector('.forgot-password-form');
    const emailInput = forgotModal.querySelector('input[type="email"]');

    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();

        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Define staff emails
        const staffEmails = {
            'admin@aibaba.com': { name: 'Administrator', staffId: 'admin' },
            'manager@aibaba.com': { name: 'Manager', staffId: 'manager' },
            'tech@aibaba.com': { name: 'Technician', staffId: 'tech' },
            'babaservices33@gmail.com': { name: 'Administrator', staffId: 'admin' },
            'qq9917sh@gmail.com': { name: 'Administrator', staffId: 'admin' },
            'devqari16@gmail.com': { name: 'Developer', staffId: 'dev' }
        };

        const submitBtn = e.target.querySelector('.btn-reset-password');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        submitBtn.disabled = true;

        try {
            if (staffEmails[email]) {
                // Valid staff email - send reset email
                sendPasswordResetEmail(email, staffEmails[email]);

                showNotification('✅ Password reset link sent! Please check your email.', 'success');

                // Close modal after successful send
                setTimeout(() => {
                    closeForgotModal();
                }, 2000);
            } else {
                // Invalid staff email
                showNotification('❌ This email is not registered as staff. If you think this is an error, please contact administration.', 'error');
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
            if (error.text && error.text.includes('template')) {
                showNotification('Email template configuration error. Please contact administrator.', 'error');
            } else {
                showNotification('Failed to send reset email. Please check your internet connection and try again.', 'error');
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Close modal handlers
    function closeForgotModal() {
        document.body.removeChild(forgotModal);
        document.body.style.overflow = 'auto';
    }

    forgotModal.querySelector('.close-forgot-modal').addEventListener('click', closeForgotModal);
    forgotModal.querySelector('.btn-close-forgot').addEventListener('click', closeForgotModal);
    forgotModal.querySelector('.btn-back-login').addEventListener('click', closeForgotModal);

    // Close on backdrop click
    forgotModal.addEventListener('click', (e) => {
        if (e.target === forgotModal) {
            closeForgotModal();
        }
    });

    // Focus on email input
    setTimeout(() => {
        emailInput.focus();
    }, 300);
}

// Password reset functionality simplified - no email sending
function sendPasswordResetEmail(email, staffInfo) {
    console.log('Password reset would be sent to:', email);
    // In a real application, this would send an email
    // For now, just simulate success
    return Promise.resolve({ status: 'success' });
}

// Function to generate secure reset token
function generateResetToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '_' + Date.now();
}

// Logout functionality with backend integration
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await logoutStaff();
            staffDashboard.classList.add('hidden');
            document.body.style.overflow = 'auto';
            staffLoginForm.reset();
            showNotification('Successfully logged out', 'info');
        } catch (error) {
            console.error('Logout error:', error);
            // Still logout locally even if server request fails
            localStorage.removeItem('staffToken');
            localStorage.removeItem('staffData');
            staffDashboard.classList.add('hidden');
            document.body.style.overflow = 'auto';
            staffLoginForm.reset();
            showNotification('Logged out', 'info');
        }
    });
}

// Close staff modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === staffModal) {
        staffModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 4000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Testimonials carousel functionality
let currentSlide = 0;
let totalSlides = 8;
let autoSlideInterval;

function slideTestimonials(direction) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonials-dots .dot');

    // Check if slides and dots exist
    if (!slides.length || !dots.length) {
        return;
    }

    // Ensure currentSlide is within bounds
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    // Remove active class from current slide and dot if they exist
    if (slides[currentSlide]) {
        slides[currentSlide].classList.remove('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }

    // Calculate new slide index
    if (direction === 'next') {
        currentSlide = (currentSlide + 1) % slides.length;
    } else if (direction === 'prev') {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    // Add active class to new slide and dot if they exist
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }

    // Update progress indicators
    updateProgressIndicators();

    // Reset auto-slide timer
    resetAutoSlide();
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonials-dots .dot');    // Check if slides and dots exist
    if (!slides.length || !dots.length) {
        return;
    }

    // Validate slideIndex
    if (slideIndex < 0 || slideIndex >= slides.length) {
        return;
    }

    // Remove active class from current slide and dot if they exist
    if (slides[currentSlide]) {
        slides[currentSlide].classList.remove('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }

    // Set new slide index
    currentSlide = slideIndex;

    // Add active class to new slide and dot if they exist
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }

    // Update progress indicators
    updateProgressIndicators();

    // Reset auto-slide timer
    resetAutoSlide();
}

function updateProgressIndicators() {
    const indicators = document.querySelectorAll('.progress-indicators .indicator');
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            if (indicator) {
                indicator.classList.toggle('active', index === currentSlide);
            }
        });
    }
}

function startAutoSlide() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length > 1) {
        autoSlideInterval = setInterval(() => {
            slideTestimonials('next');
        }, 5000);
    }
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Initialize testimonials carousel
document.addEventListener('DOMContentLoaded', function() {
    // Start auto-slide
    startAutoSlide();

    // Pause auto-slide on hover
    const testimonialSection = document.querySelector('.testimonials');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        testimonialSection.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    slideTestimonials('next');
                } else {
                    slideTestimonials('prev');
                }
            }
        }
    }
});

// Real-time clock for dashboard
function updateDashboardClock() {
    // Check if staffDashboard exists and is visible
    const staffDashboard = document.getElementById('staffDashboard');
    if (!staffDashboard || staffDashboard.classList.contains('hidden')) {
        return;
    }

    let clockElement = document.getElementById('dashboard-clock');

    if (!clockElement) {
        clockElement = document.createElement('div');
        clockElement.id = 'dashboard-clock';
        clockElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-family: monospace;
            font-size: 0.9rem;
            z-index: 3001;
        `;
        staffDashboard.appendChild(clockElement);
    }

    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString();
}

setInterval(updateDashboardClock, 1000);

// Service Selector functionality
function selectService(serviceType) {
    // Add click animation
    const card = event.currentTarget;
    card.style.transform = 'scale(0.95)';

    setTimeout(() => {
        card.style.transform = '';

        // Store selection and redirect
        localStorage.setItem('selectedService', serviceType);

        switch(serviceType) {
            case 'window-tinting':
                window.location.href = 'window-tinting.html';
                break;
            case 'commercial-residential':
                window.location.href = 'commercial-residential.html';
                break;
            case 'detailing':
                window.location.href = 'detailing.html';
                break;
            default:
                window.location.href = 'window-tinting.html';
        }
    }, 150);
}

// Animate service cards on load
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-selector .service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200 + 100);
    });
});

// Enhanced form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        // Check if input has required attribute or is marked as required
        const isRequired = input.hasAttribute('required') || input.required;

        if (isRequired && (!input.value || !input.value.trim())) {
            input.style.borderColor = '#dc3545';
            input.style.boxShadow = '0 0 5px rgba(220, 53, 69, 0.3)';
            isValid = false;
        } else if (input.value && input.value.trim()) {
            input.style.borderColor = '#28a745';
            input.style.boxShadow = '0 0 5px rgba(40, 167, 69, 0.3)';
        } else {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        }
    });

    return isValid;
}

// Set minimum date for booking to today
document.addEventListener('DOMContentLoaded', function() {
    const bookingDate = document.getElementById('bookingDate');
    if (bookingDate) {
        const today = new Date().toISOString().split('T')[0];
        bookingDate.setAttribute('min', today);
    }
});



// Simple staff dashboard functionality
function showStaffDashboard() {
    const staffSession = JSON.parse(localStorage.getItem('staffSession') || '{}');
    const bookings = JSON.parse(localStorage.getItem('aibabaBookings') || '[]');
    const quotes = JSON.parse(localStorage.getItem('aibabaQuotes') || '[]');

    // Create dashboard overlay
    const dashboardOverlay = document.createElement('div');
    dashboardOverlay.className = 'staff-dashboard-overlay';
    dashboardOverlay.innerHTML = `
        <div class="staff-dashboard-modal">
            <div class="dashboard-header">
                <h2>AI BABA Staff Portal - Welcome ${staffSession.name}!</h2>
                <button class="close-dashboard">×</button>
            </div>
            <div class="dashboard-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Bookings</h3>
                        <div class="stat-number">${bookings.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Quotes</h3>
                        <div class="stat-number">${quotes.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Today's Activity</h3>
                        <div class="stat-number">${getTodayActivity(bookings, quotes)}</div>
                    </div>
                </div>
                <div class="dashboard-sections">
                    <div class="section">
                        <h3>Recent Bookings</h3>
                        <div class="items-list">
                            ${getRecentItems(bookings, 'booking')}
                        </div>
                    </div>
                    <div class="section">
                        <h3>Recent Quotes</h3>
                        <div class="items-list">
                            ${getRecentItems(quotes, 'quote')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add styles
    dashboardOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    document.body.appendChild(dashboardOverlay);
    document.body.style.overflow = 'hidden';

    // Close functionality
    dashboardOverlay.querySelector('.close-dashboard').addEventListener('click', () => {
        document.body.removeChild(dashboardOverlay);
        document.body.style.overflow = 'auto';
        localStorage.removeItem('staffSession');
        showNotification('Logged out successfully', 'info');
    });
}

function getTodayActivity(bookings, quotes) {
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b =>
        new Date(b.submittedAt).toDateString() === today
    ).length;
    const todayQuotes = quotes.filter(q =>
        new Date(q.submittedAt).toDateString() === today
    ).length;
    return todayBookings + todayQuotes;
}

function getRecentItems(items, type) {
    if (items.length === 0) {
        return `<p>No ${type}s yet</p>`;
    }

    return items.slice(-5).reverse().map(item => `
        <div class="dashboard-item">
            <div class="item-info">
                <strong>${item.name}</strong> - ${item.email}
                ${type === 'booking' ? `<br>Package: ${item.package} on ${item.date}` : `<br>Vehicle: ${item.vehicleYear} ${item.vehicleMake} ${item.vehicleModel}`}
            </div>
            <div class="item-time">${getTimeAgo(item.submittedAt)}</div>
        </div>
    `).join('');
}

// Check if staff is already logged in
function checkStaffSession() {
    const staffData = localStorage.getItem('staffSession');

    if (staffData) {
        return {
            isLoggedIn: true,
            staff: JSON.parse(staffData)
        };
    }
    return { isLoggedIn: false };
}

// Helper function for time calculations
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
}

// Add rate limiting to prevent brute force attacks
let loginAttempts = 0;
const maxAttempts = 3;
let lockoutTime = null;

function checkRateLimit() {
    if (lockoutTime && Date.now() < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
        showNotification(`Too many failed attempts. Please wait ${remainingTime} seconds.`, 'error');
        return false;
    }
    return true;
}

// Mobile service functionality - simplified without fee calculation
const serviceLocationSelect = document.getElementById('serviceLocation');
const addressGroup = document.getElementById('addressGroup');
const customerAddressInput = document.getElementById('customerAddress');

if (serviceLocationSelect && addressGroup && customerAddressInput) {
    serviceLocationSelect.addEventListener('change', function() {
        if (this.value === 'mobile') {
            addressGroup.style.display = 'block';
            customerAddressInput.required = true;
        } else {
            addressGroup.style.display = 'none';
            customerAddressInput.required = false;
            customerAddressInput.value = '';
        }
    });
}

// Enhanced booking form with local storage
if (bookingForm) {
    setupBookingForm(bookingForm);
}

// Also setup booking forms that might be dynamically created or on other pages
document.addEventListener('DOMContentLoaded', function() {
    // Find all booking forms on the page
    const allBookingForms = document.querySelectorAll('#bookingForm, .booking-form, form[id*="booking"]');
    allBookingForms.forEach(form => {
        if (!form.hasAttribute('data-setup')) {
            setupBookingForm(form);
            form.setAttribute('data-setup', 'true');
        }
    });
});

// Add quote calculation system
function calculateQuote(vehicleYear, vehicleMake, vehicleModel, serviceType, tintShade) {
    const basePrices = {
        'basic': 90,
        'premium': 159,
        'luxury': 189,
        'commercial': 500,
        'custom': 400
    };

    const vehicleMultipliers = {
        'suv': 1.2,
        'truck': 1.3,
        'luxury': 1.4,
        'sports': 1.1,
        'sedan': 1.0,
        'coupe': 0.9
    };

    const yearMultiplier = vehicleYear >= 2020 ? 1.1 : 1.0;
    const basePrice = basePrices[serviceType] || 300;

    // Determine vehicle type from make/model
    let vehicleType = 'sedan';
    const vehicleInfo = `${vehicleMake} ${vehicleModel}`.toLowerCase();

    if (vehicleInfo.includes('suv') || vehicleInfo.includes('x5') || vehicleInfo.includes('tahoe') || vehicleInfo.includes('escalade')) {
        vehicleType = 'suv';
    } else if (vehicleInfo.includes('truck') || vehicleInfo.includes('f-150') || vehicleInfo.includes('silverado')) {
        vehicleType = 'truck';
    } else if (vehicleInfo.includes('bmw') || vehicleInfo.includes('mercedes') || vehicleInfo.includes('audi') || vehicleInfo.includes('lexus')) {
        vehicleType = 'luxury';
    } else if (vehicleInfo.includes('corvette') || vehicleInfo.includes('mustang') || vehicleInfo.includes('camaro')) {
        vehicleType = 'sports';
    } else if (vehicleInfo.includes('coupe') || vehicleInfo.includes('2-door')) {
        vehicleType = 'coupe';
    }

    const finalPrice = Math.round(basePrice * vehicleMultipliers[vehicleType] * yearMultiplier);

    return {
        basic: Math.round(finalPrice * 0.8),
        premium: finalPrice,
        luxury: Math.round(finalPrice * 1.3),
        breakdown: {
            labor: Math.round(finalPrice * 0.4),
            materials: Math.round(finalPrice * 0.6)
        }
    };
}

function showQuoteCalculation(vehicleYear, vehicleMake, vehicleModel, serviceType) {
    const prices = calculateQuote(vehicleYear, vehicleMake, vehicleModel, serviceType);

    // Create calculation popup
    const calculationDiv = document.createElement('div');
    calculationDiv.className = 'quote-calculation-popup';
    calculationDiv.innerHTML = `
        <div class="calculation-content">
            <div class="calculation-header">
                <i class="fas fa-calculator"></i>
                <h3>Calculate Quote</h3>
                <button class="close-calculation" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="vehicle-info">
                <strong>${vehicleYear} ${vehicleMake} ${vehicleModel}</strong>
                <p>Service Type: ${serviceType}</p>
            </div>
            <div class="price-options">
                <h4>Suggested Pricing:</h4>
                <div class="price-buttons">
                    <button class="price-btn basic" onclick="selectPrice(${prices.basic})">
                        Basic: $${prices.basic}
                    </button>
                    <button class="price-btn premium" onclick="selectPrice(${prices.premium})">
                        Premium: $${prices.premium}
                    </button>
                    <button class="price-btn luxury" onclick="selectPrice(${prices.luxury})">
                        Luxury: $${prices.luxury}
                    </button>
                </div>
            </div>
            <div class="custom-price">
                <label>Custom Price:</label>
                <input type="number" id="customPriceInput" placeholder="Enter amount" min="100" max="2000">
            </div>
            <div class="price-breakdown">
                <label>Price Breakdown (Optional):</label>
                <textarea id="priceBreakdown" placeholder="Labor: $${prices.breakdown.labor}, Materials: $${prices.breakdown.materials}"></textarea>
            </div>
            <div class="internal-notes">
                <label>Internal Notes:</label>
                <textarea id="internalNotes" placeholder="Staff notes, special considerations..."></textarea>
            </div>
            <div class="calculation-actions">
                <button class="btn-send-quote" onclick="sendQuoteToCustomer()">
                    <i class="fas fa-paper-plane"></i> Send Quote
                </button>
                <button class="btn-cancel" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(calculationDiv);
}

function selectPrice(price) {
    document.getElementById('customPriceInput').value = price;
    document.querySelectorAll('.price-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function sendQuoteToCustomer() {
    const customPrice = document.getElementById('customPriceInput').value;
    const breakdown = document.getElementById('priceBreakdown').value;
    const notes = document.getElementById('internalNotes').value;

    if (!customPrice) {
        alert('Please select or enter a price');
        return;
    }

    // Here you would typically send the quote via email/SMS
    alert(`Quote sent! Price: $${customPrice}`);
    document.querySelector('.quote-calculation-popup').remove();
}

// Enhanced quote form handling with local storage
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.btn-quote-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
            submitBtn.disabled = true;

            try {
                // Collect form data
                const formData = new FormData(this);
                const quoteData = Object.fromEntries(formData.entries());

                // Get the current service page information
                const currentPage = window.location.pathname;
                let servicePage = 'Main Website';
                let serviceType = 'general';

                if (currentPage.includes('window-tinting')) {
                    servicePage = 'Automotive Window Tinting';
                    serviceType = 'window_tinting';
                } else if (currentPage.includes('commercial-residential')) {
                    servicePage = 'Commercial & Residential Tinting';
                    serviceType = 'commercial_residential';
                } else if (currentPage.includes('detailing')) {
                    servicePage = 'Car Detailing Services';
                    serviceType = 'detailing';
                } else if (currentPage.includes('ceramic-coating')) {
                    servicePage = 'Ceramic Coating Services';
                    serviceType = 'ceramic_coating';
                }

                // Send to Formspree
                const response = await fetch('https://formspree.io/f/mrbaoywb', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...quoteData,
                        service_source_page: servicePage,
                        service_type: serviceType,
                        current_page_url: window.location.href,
                        _subject: `New Quote Request from ${servicePage} - AI BABA AUTO DETAILING AND TINTING`,
                        _replyto: quoteData.email,
                        form_type: 'quote'
                    })
                });

                if (response.ok) {
                    // Also save to local storage as backup
                    const quoteDataWithId = {
                        id: 'QTE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
                        ...quoteData,
                        servicePage: servicePage,
                        serviceType: serviceType,
                        submittedAt: new Date().toISOString(),
                        status: 'pending'
                    };
                    let quotes = JSON.parse(localStorage.getItem('aibabaQuotes') || '[]');
                    quotes.push(quoteDataWithId);
                    localStorage.setItem('aibabaQuotes', JSON.stringify(quotes));

                    showNotification('Quote request submitted! We will contact you with pricing details.', 'success');
                    this.reset();
                    if (quoteModal) {
                        quoteModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }

                    setTimeout(() => {
                        showNotification('📧 You\'ll receive your detailed estimate within 1-2 hours.', 'info');
                    }, 1500);

                    setTimeout(() => {
                        showNotification('📋 Our specialists will review your vehicle details and provide customized pricing options.', 'info');
                    }, 3500);
                } else {
                    throw new Error('Failed to submit');
                }
            } catch (error) {
                console.error('Error submitting quote form:', error);
                showNotification('Failed to submit quote request. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Enhanced validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// Google Maps Integration with proper loading management
let mapsLoaded = false;
let mapsInitialized = false;

function loadGoogleMaps() {
    if (mapsLoaded) return; // Prevent multiple loads
    mapsLoaded = true;

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCYJNyqed1EYrjrtmBe6ilua1RfYzlDJss&callback=initMap&libraries=marker&v=beta';
    script.async = true;
    script.defer = true;
    script.onerror = function() {
        console.warn('Google Maps failed to load, showing fallback');
        showMapFallback();
    };
    document.head.appendChild(script);
}

function initMap() {
    if (mapsInitialized) return; // Prevent multiple initializations
    mapsInitialized = true;

    try {
        // Shop location coordinates (127 Manville Road, Unit 1, Scarborough, ON)
        const shopLocation = { lat: 43.7315, lng: -79.2665 };

        const mapElement = document.getElementById('google-map');
        if (!mapElement) {
            console.warn('Map element not found');
            return;
        }

        // Check if Google Maps is available
        if (!window.google || !window.google.maps) {
            console.warn('Google Maps API not loaded');
            showMapFallback();
            return;
        }

        // Create map with error handling - use standard Marker instead of AdvancedMarkerElement for better compatibility
        const map = new google.maps.Map(mapElement, {
            zoom: 15,
            center: shopLocation,
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: true
        });

        // Use standard Marker for better compatibility
        const marker = new google.maps.Marker({
            position: shopLocation,
            map: map,
            title: 'AI BABA AUTO DETAILING AND TINTING'
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 15px; font-family: 'Poppins', sans-serif; max-width: 300px;">
                    <h3 style="margin: 0 0 10px 0; color: #0f0f23; font-size: 18px; font-weight: 700;">
                        🚗 AI BABA AUTO DETAILING AND TINTING
                    </h3>
                    <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                        <strong>📍 Address:</strong><br>
                        127 Manville Road, Unit 1<br>
                        Scarborough, ON
                    </p>
                    <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                        <strong>📞 Phone:</strong> +1 (437) 545-7974<br>
                        <strong>🕒 Hours:</strong> Mon-Sun 10 AM - 9 PM
                    </p>
                    <div style="text-align: center;">
                        <a href="https://www.google.com/maps/dir//127+Manville+Rd+Unit+1,+Scarborough,+ON"
                           target="_blank"
                           style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0099cc); color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px;">
                            🗺️ Get Directions
                        </a>
                    </div>
                </div>
            `
        });

        // Open info window on marker click
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        // Auto-open info window after 1 second
        setTimeout(() => {
            infoWindow.open(map, marker);
        }, 1000);

        // Add click to close info window
        map.addListener('click', () => {
            infoWindow.close();
        });

        console.log('Google Maps loaded successfully');

    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        showMapFallback();
    }
}

// Enhanced fallback function
function showMapFallback() {
    const mapElement = document.getElementById('google-map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); color: #6c757d; font-family: 'Poppins', sans-serif; text-align: center; padding: 20px; border-radius: 12px;">
                <div>
                    <i class="fas fa-map-marker-alt" style="font-size: 4rem; color: #00d4ff; margin-bottom: 1.5rem; animation: bounce 2s infinite;"></i>
                    <h3 style="margin-bottom: 1rem; color: #0f0f23; font-size: 1.8rem; font-weight: 700;">AI BABA AUTO DETAILING AND TINTING</h3>
                    <div style="background: rgba(0, 212, 255, 0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border: 2px solid rgba(0, 212, 255, 0.2);">
                        <p style="margin-bottom: 1rem; font-size: 1.1rem; font-weight: 600; color: #0f0f23;">📍 Our Location:</p>
                        <p style="margin-bottom: 0.5rem; font-size: 1rem;">127 Manville Road, Unit 1</p>
                        <p style="margin-bottom: 1.5rem; font-size: 1rem;">Scarborough, ON</p>
                        <p style="margin-bottom: 0.5rem; color: #28a745; font-weight:600;">📞 Phone: +1 (437) 545-7974</p>
                        <p style="color: #007bff; font-weight: 600;">🕒 Hours: Mon-Sun 10 AM - 9 PM</p>
                    </div>
                    <a href="https://www.google.com/maps/place/127+Manville+Rd+Unit+1,+Scarborough,+ON" target="_blank"
                       style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0099cc); color: white, padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3); transition: all 0.3s ease;">
                        🗺️ View on Google Maps
                    </a>
                </div>
            </div>
        `;
    }
}

// Initialize maps when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a map element on the page
    const mapElement = document.getElementById('google-map');
    if (mapElement) {
        // Load Google Maps if element exists
        loadGoogleMaps();

        // Show fallback if Google Maps doesn't load within 5 seconds
        setTimeout(() => {
            if (!window.google || !window.google.maps || !mapsInitialized) {
                console.warn('Google Maps loading timeout, showing fallback');
                showMapFallback();
            }
        }, 5000);
    }
});

// Make initMap globally available for Google Maps callback
window.initMap = initMap;

// Simulator functionality is now handled in simulator.html

// Tint Jail Bailout Functionality
document.addEventListener('DOMContentLoaded', function() {
    const bailoutBookBtn = document.querySelector('.btn-bailout-book');
    const bailoutInfoBtn = document.querySelector('.btn-bailout-info');
    const emergencyPhone = document.querySelector('.emergency-phone');

if (bailoutBookBtn) {
        bailoutBookBtn.addEventListener('click', () => {
            // Pre-fill booking form for bailout service
            localStorage.setItem('serviceType', 'tint-bailout');
            localStorage.setItem('bailoutService', 'true');

            // Open booking modal
            bookingModal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            showNotification('🚨 Tint Bailout Service - Booking form opened! Bring your ticket for 50% off.', 'success');
        });
    }

    if (bailoutInfoBtn) {
        bailoutInfoBtn.addEventListener('click', () => {
            showTintLawInfo();
        });
    }

    if (emergencyPhone) {
        emergencyPhone.addEventListener('click', (e) => {
            // Track emergency call
            console.log('Emergency tint bailout call initiated');

            // Show confirmation
            showNotification('📞 Calling emergency tint bailout hotline...', 'info');
        });
    }
});

function showTintLawInfo() {
    const lawModal = document.createElement('div');
    lawModal.className = 'tint-law-modal';
    lawModal.innerHTML = `
        <div class="law-modal-content">
            <div class="law-header">
                <h3><i class="fas fa-gavel"></i> Ontario Tint Laws - Complete Guide</h3>
                <button class="close-law-modal">×</button>
            </div>
            <div class="law-content">
                <div class="law-section">
                    <h4>🚗 Front Windows (Driver & Passenger)</h4>
                    <p><strong>Legal Requirement:</strong> Must allow at least 70% of light to pass through</p>
                    <p><strong>What this means:</strong> Very light tint only - barely noticeable</p>
                    <p><strong>Fine if violated:</strong> $110 + court costs</p>
                </div>

                <div class="law-section">
                    <h4>🔙 Rear Windows (Back seat & rear windshield)</h4>
                    <p><strong>Legal Requirement:</strong> No restrictions on darkness</p>
                    <p><strong>What this means:</strong> You can go as dark as you want!</p>
                    <p><strong>Popular choices:</strong> 20% (medium) to 5% (limo dark)</p>
                    </div>

                <div class="law-section">
                    <h4>🚨 Common Violations & Fines</h4>
                    <ul>
                        <li>Dark front windows: $110 fine + court costs</li>
                        <li>Obstruction charge: Additional $85 fine</li>
                        <li>Court appearance required in some cases</li>
                        <li>Insurance may be notified</li>
                    </ul>
                </div>

                <div class="law-section bailout-highlight">
                    <h4>💡 Our Tint Jail Bailout Solution</h4>
                    <p>Got a ticket? We'll remove your illegal tint and install legal film for <strong>50% OFF!</strong></p>
                    <ul>
                        <li>✅ Legal compliance guaranteed</li>
                        <li>✅ Official documentation provided</li>
                        <li>✅ Same-day emergency service available</li>
                        <li>✅ Court-acceptable compliance certificate</li>
                    </ul>
                </div>
            </div>
            <div class="law-actions">
                <button class="btn-book-legal book-btn">Book Legal Tint Service</button>
                <button class="btn-bailout-emergency">🚨 Emergency Bailout Hotline</button>
            </div>
        </div>
    `;

    // Add styles
    lawModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 4000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    const modalContent = lawModal.querySelector('.law-modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    `;

    const lawHeader = lawModal.querySelector('.law-header');
    lawHeader.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const lawContent = lawModal.querySelector('.law-content');
    lawContent.style.cssText = `
        padding: 2rem;
    `;

    const lawSections = lawModal.querySelectorAll('.law-section');
    lawSections.forEach(section => {
        section.style.cssText = `
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #007bff;
        `;
    });

    const bailoutHighlight = lawModal.querySelector('.bailout-highlight');
    if (bailoutHighlight) {
        bailoutHighlight.style.cssText = `
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border-radius: 10px;
            border-left: 4px solid #ffc107;
            border: 2px solid #ffc107;
        `;
    }

    const lawActions = lawModal.querySelector('.law-actions');
    lawActions.style.cssText = `
        padding: 1.5rem 2rem 2rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
    `;

    document.body.appendChild(lawModal);
    document.body.style.overflow = 'hidden';

    // Close functionality
    const closeLawModal = () => {
        document.body.removeChild(lawModal);
        document.body.style.overflow = 'auto';
    };

    lawModal.querySelector('.close-law-modal').addEventListener('click', closeLawModal);
    lawModal.addEventListener('click', (e) => {
        if (e.target === lawModal) closeLawModal();
    });

    // Action buttons
    lawModal.querySelector('.btn-book-legal').addEventListener('click', () => {
        closeLawModal();
        bookingModal.style.display = 'block';
        showNotification('Booking legal tint service - compliance guaranteed!', 'success');
    });

    lawModal.querySelector('.btn-bailout-emergency').addEventListener('click', () => {
        window.open('tel:+14375457974', '_self');
        showNotification('📞 Calling emergency bailout hotline...', 'info');
    });
}

// Enhanced booking form to handle bailout services
const originalBookingSubmit = bookingForm?.addEventListener;
if (bookingForm && originalBookingSubmit) {
    // Check if this is a bailout service booking
    const checkBailoutService = () => {
        const isBailout = localStorage.getItem('bailoutService') === 'true';
        const selectedTint = localStorage.getItem('selectedTintLevel');

        if (isBailout) {
            // Add bailout-specific fields or messaging
            const packageSelect = bookingForm.querySelector('select[name="package"]');
            if (packageSelect) {
                // Add bailout option if not exists
                let bailoutOption = packageSelect.querySelector('option[value="bailout"]');
                if (!bailoutOption) {
                    bailoutOption = document.createElement('option');
                    bailoutOption.value = 'bailout';
                    bailoutOption.textContent = '🚨 Tint Jail Bailout - 50% OFF Legal Tint';
                    packageSelect.appendChild(bailoutOption);
                }
                bailoutOption.selected = true;
            }

            // Show bailout notice
            const bailoutNotice = document.createElement('div');
            bailoutNotice.className = 'bailout-notice';
            bailoutNotice.innerHTML = `
                <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                    <h4 style="color: #856404; margin: 0 0 0.5rem 0;">🚨 Tint Jail Bailout Service</h4>
                    <p style="color: #856404; margin: 0; font-size: 0.9rem;">
                        <strong>Bring your tint violation ticket for 50% OFF legal reinstallation!</strong><p>
                        Our team will remove illegal tint and install compliant film with official documentation.
                    </p>
                </div>
            `;

            const form = bookingForm.querySelector('#bookingForm') || bookingForm;
            if (form && !form.querySelector('.bailout-notice')) {
                form.insertBefore(bailoutNotice, form.firstChild);
            }
        }

        if (selectedTint) {
                        const vehicleDetails = bookingForm.querySelector('textarea[name="vehicleDetails"]');
            if (vehicleDetails && !vehicleDetails.value.includes('Requested tint')) {
                vehicleDetails.value += `
Requested tint level: ${selectedTint}`;
            }
        }

        // Clear temporary storage
        localStorage.removeItem('bailoutService');
        localStorage.removeItem('selectedTintLevel');
    };

    // Check when booking modal opens
    const originalBookBtns = document.querySelectorAll('.book-btn');
    originalBookBtns.forEach(btn => {
        if (!btn.classList.contains('simulator-btn-processed')) {
            btn.classList.add('simulator-btn-processed');
            btn.addEventListener('click', () => {
                setTimeout(checkBailoutService, 100);
            });
        }
    });
}

// Add CSS for reveal animation and notifications
const style = document.createElement('style');
style.textContent = `
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }

    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    .hero {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    body.loaded {
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Get user's IP and create unique device fingerprint
function getDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);

    const fingerprint = btoa(JSON.stringify({
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        userAgent: navigator.userAgent.substring(0, 50),
        canvas: canvas.toDataURL()
    })).substring(0, 32);

    return fingerprint;
}

// Check if device/IP has already submitted review
function hasDeviceSubmittedReview(email) {
    const deviceId = getDeviceFingerprint();
    const submittedDevices = JSON.parse(localStorage.getItem('reviewDevices') || '{}');
    const emailKey = email.toLowerCase();

    return submittedDevices[emailKey] && submittedDevices[emailKey].includes(deviceId);
}

// Mark device as having submitted review
function markDeviceAsSubmitted(email) {
    const deviceId = getDeviceFingerprint();
    const submittedDevices = JSON.parse(localStorage.getItem('reviewDevices') || '{}');
    const emailKey = email.toLowerCase();

    if (!submittedDevices[emailKey]) {
        submittedDevices[emailKey] = [];
    }

    if (!submittedDevices[emailKey].includes(deviceId)) {
        submittedDevices[emailKey].push(deviceId);
        localStorage.setItem('reviewDevices', JSON.stringify(submittedDevices));
    }
}

// Load and display testimonials on page load
function loadTestimonials() {
    const reviews = JSON.parse(localStorage.getItem('aibabaReviews') || '[]');
    // Show ALL reviews in testimonials, not just high-rated ones
    const publicTestimonials = reviews.filter(review => review.rating >= 1);

    if (publicTestimonials.length > 0) {
        updateTestimonialsSection(publicTestimonials);
    }
}

// Update testimonials section with real reviews
function updateTestimonialsSection(reviews) {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    const dots = document.querySelector('.testimonials-dots');

    if (!testimonialsSlider || !dots) return;

    // Clear existing content
    testimonialsSlider.innerHTML = '';
    dots.innerHTML = '';

    reviews.forEach((review, index) => {
        // Create testimonial slide
        const slide = document.createElement('div');
        slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <div class="testimonial-card">
                <div class="review-source">
                    <i class="fas fa-star"></i>
                    <span>Customer Review - ${new Date(review.submittedAt).toLocaleDateString()}</span>
                </div>
                <div class="customer-name">${review.customerName}</div>
                <div class="review-content">
                    <p>"${review.reviewText}"</p>
                </div>
                <div class="stars">
                    ${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                </div>
                <div class="review-rating">${review.rating}/5 Stars</div>
            </div>
        `;
        testimonialsSlider.appendChild(slide);

        // Create dot
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dots.appendChild(dot);
    });

    // Update total slides count
    totalSlides = reviews.length;

    // Force refresh of carousel
    currentSlide = 0;
    if (reviews.length > 0) {
        resetAutoSlide();
    }
}

// Review request form handler
const reviewRequestForm = document.getElementById('reviewRequestForm');
if (reviewRequestForm) {
    reviewRequestForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const customerEmail = formData.get('customerEmail').toLowerCase();
        const reviewLimit = parseInt(formData.get('reviewLimit')) || 1;

        // Check existing reviews for this customer
        const existingReviews = JSON.parse(localStorage.getItem('aibabaReviews') || '[]');
        const customerReviewCount = existingReviews.filter(review =>
            review.customerEmail.toLowerCase() === customerEmail
        ).length;

        if (customerReviewCount >= reviewLimit) {
            showNotification(`This customer has already reached their review limit (${reviewLimit} review${reviewLimit > 1 ? 's' : ''}).`, 'error');
            return;
        }

        const reviewRequest = {
            customerEmail: customerEmail,
            customerName: formData.get('customerName'),
            serviceDate: formData.get('serviceDate'),
            serviceType: formData.get('serviceType'),
            personalMessage: formData.get('personalMessage') || '',
            reviewLimit: reviewLimit,
            requestedAt: new Date().toISOString(),
            requestId: 'REV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase()
        };

        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Create email template with review link that includes the limit and template ID
            const reviewLink = `${window.location.origin}/review.html?limit=${reviewLimit}&id=${reviewRequest.requestId}&customer=${encodeURIComponent(customerEmail)}&template=template_gxa6yio`;
            const templateParams = {
                to_name: reviewRequest.customerName,
                to_email: reviewRequest.customerEmail,
                staff_name: reviewRequest.customerName,
                staff_id: username,
                username: username,
                password: tempPassword,
                role: staffData.role,
                login_url: window.location.origin + '/staff-dashboard.html',
                company_name: 'AI BABA AUTO DETAILING AND TINTING',
                reply_to: 'aibaba.service@gmail.com'
            };

            // Send email using EmailJS
            emailjs.send('service_ncbdkar', 'template_gxa6yio', templateParams).then(() => {
                showNotification('Review request sent successfully!', 'success');
                e.target.reset();
            }).catch(error => {
                console.error('Error sending review request:', error);

                // Simple error message
                showNotification('❌ Failed to send review request. Email may have been sent despite the error.', 'error');

                // Save request locally even if email fails
                let reviewRequests = JSON.parse(localStorage.getItem('aibabaReviewRequests') || '[]');
                reviewRequest.emailFailed = true;
                reviewRequest.emailError = error.message;
                reviewRequests.push(reviewRequest);
                localStorage.setItem('aibabaReviewRequests', JSON.stringify(reviewRequests));

                // Show alternative options
                setTimeout(() => {
                    showNotification('💡 Tip: Check if the customer email is correct and ask them to check spam folder.', 'info');
                }, 3000);
            });

            // Success and error handling moved to promise chain above

        } catch (error) {
            console.error('Error sending review request:', error);

            // Simple error message
            showNotification('❌ Failed to send review request. Email may have been sent despite the error.', 'error');

            // Save request locally even if email fails
            let reviewRequests = JSON.parse(localStorage.getItem('aibabaReviewRequests') || '[]');
            reviewRequest.emailFailed = true;
            reviewRequest.emailError = error.message;
            reviewRequests.push(reviewRequest);
            localStorage.setItem('aibabaReviewRequests', JSON.stringify(reviewRequests));

            // Show alternative options
            setTimeout(() => {
                showNotification('💡 Tip: Check if the customer email is correct and ask them to check spam folder.', 'info');
            }, 3000);
        } finally {
            // Save review request to localStorage with limits (moved outside catch block)
            if (!reviewRequest.emailFailed) {
                let reviewRequests = JSON.parse(localStorage.getItem('aibabaReviewRequests') || '[]');
                reviewRequests.push(reviewRequest);
                localStorage.setItem('aibabaReviewRequests', JSON.stringify(reviewRequests));
            }
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Load testimonials when page loads and check for updates
document.addEventListener('DOMContentLoaded', function() {
    loadTestimonials();

    // Check if testimonials need update every 2 seconds
    setInterval(() => {
        if (localStorage.getItem('testimonialsNeedUpdate') === 'true') {
            loadTestimonials();
            localStorage.removeItem('testimonialsNeedUpdate');
        }
    }, 2000);
});

// Newsletter form functionality
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!email || !isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Save to local storage
            let subscribers = JSON.parse(localStorage.getItem('aibabaSubscribers') || '[]');

            // Check if already subscribed
            if (subscribers.includes(email.toLowerCase())) {
                showNotification('You are already subscribed to our newsletter!', 'info');
                return;
            }

            subscribers.push(email.toLowerCase());
            localStorage.setItem('aibabaSubscribers', JSON.stringify(subscribers));

            showNotification('Thank you for subscribing! You will receive updates about our latest offers and services.', 'success');
            emailInput.value = '';
        });
    }
});

// Placeholder function for triggering dashboard updates
function triggerDashboardUpdate(type, data) {
    // In a real-time system (like with WebSockets), you would emit an event
    // to notify the dashboard that new data is available.
    // For this local storage implementation, we'll just set a flag that the
    // dashboard can check periodically.
    localStorage.setItem('dashboardNeedsUpdate', 'true');
    console.log(`Dashboard update triggered for ${type}:`, data);
}

// This script handles the core functionality of the AI BABA AUTO DETAILING AND TINTING website, including mobile navigation, smooth scrolling,
// modal handling, form submissions, email confirmations, FAQ interaction, pricing tab functionality, Google Maps integration,
// and more. It also includes enhanced validation functions, staff login functionality, a notification system, and a testimonial carousel.

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    showMapFallback();
});

// Mobile Responsiveness Utilities
document.addEventListener('DOMContentLoaded', function() {
    // Add touch support for cards
    const cards = document.querySelectorAll('.service-card, .pricing-card, .gallery-item, .review-card');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });

    // Improve form inputs on mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Add mobile-friendly attributes
        if (input.type === 'email') {
            input.setAttribute('autocomplete', 'email');
            input.setAttribute('inputmode', 'email');
        }
        if (input.type === 'tel') {
            input.setAttribute('autocomplete', 'tel');
            input.setAttribute('inputmode', 'tel');
        }
        if (input.type === 'text' && input.placeholder && input.placeholder.toLowerCase().includes('name')) {
            input.setAttribute('autocomplete', 'name');
        }
    });

    // Handle viewport height on mobile (for iOS Safari)
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(setViewportHeight, 100);
    });

    // Smooth scrolling for anchor links on mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle service location dropdown in booking modal
    const serviceLocationSelect = document.querySelector('select[name="serviceLocation"]');
    const addressGroup = document.getElementById('addressGroup');

    if (serviceLocationSelect && addressGroup) {
        serviceLocationSelect.addEventListener('change', function() {
            if (this.value === 'mobile') {
                addressGroup.style.display = 'block';
                addressGroup.querySelector('input').required = true;
            } else {
                addressGroup.style.display = 'none';
                addressGroup.querySelector('input').required = false;
            }
        });
    }

    // Set minimum date for booking forms
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });

    // Lazy loading for images (performance improvement on mobile)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Permission Check Function
        function hasPermissionForSection(sectionName) {
            const staffSession = JSON.parse(localStorage.getItem('staffSession') || '{}');
            if (!staffSession || !staffSession.permissions) {
                return false; // No session or permissions found
            }

            // Super admin (admin with aibaba2024) has access to everything
            if (staffSession.isSuper === true || (staffSession.role === 'admin' && staffSession.permissions.includes('super-admin'))) {
                return true;
            }

            // Check if user has canManageAllUsers permission (full access)
            if (staffSession.canManageAllUsers === true) {
                return true;
            }

            // Map section names to required permissions (using the same names as in staff management)
            const sectionPermissions = {
                'overview': ['bookings', 'quotes', 'messages', 'reviews', 'invoices', 'staff'], // Allow if has any permission
                'bookings': ['bookings', 'Manage Bookings'],
                'quotes': ['quotes', 'Manage Quotes'],
                'messages': ['messages', 'Manage Messages'],
                'reviews': ['reviews', 'Manage Reviews'],
                'ask-review': ['reviews', 'Manage Reviews'],
                'review-management': ['reviews', 'Manage Reviews'],
                'invoices': ['invoices', 'Manage Invoices'],
                'invoice-tracking': ['invoices', 'Manage Invoices'],
                'staff-management': ['staff', 'Manage Staff']
            };

            const requiredPermissions = sectionPermissions[sectionName];

            if (!requiredPermissions) {
                return true; // If no specific permission is defined, assume allowed
            }

            // For overview, allow if user has ANY permission
            if (sectionName === 'overview') {
                return staffSession.permissions.some(permission =>
                    ['bookings', 'quotes', 'messages', 'reviews', 'invoices', 'staff'].includes(permission)
                );
            }

            // Check if the staff member has any of the required permissions
            return requiredPermissions.some(permission => staffSession.permissions.includes(permission));
        }