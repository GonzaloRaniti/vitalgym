// Login page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');
    const socialButtons = document.querySelectorAll('.social-btn');

    // Password toggle functionality
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
            
            // Update aria-label
            const isVisible = type === 'text';
            this.setAttribute('aria-label', isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña');
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateLoginForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('.login-btn');
                submitBtn.classList.add('loading');
                
                // Simulate API call
                setTimeout(() => {
                    // Simulate successful login
                    showNotification('¡Inicio de sesión exitoso!', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Remove loading state
                    submitBtn.classList.remove('loading');
                    
                    // Redirect to dashboard (simulate)
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                }, 2000);
            } else {
                showNotification('Por favor, completa todos los campos correctamente.', 'error');
            }
        });
    }

    // Form validation
    function validateLoginForm(data) {
        const requiredFields = ['username', 'password'];
        return requiredFields.every(field => data[field] && data[field].trim() !== '');
    }

    // Social login buttons
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`Iniciando sesión con ${provider}...`, 'info');
            
            // Simulate social login
            setTimeout(() => {
                showNotification(`¡Inicio de sesión con ${provider} exitoso!`, 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }, 2000);
        });
    });

    // Real-time validation
    const inputs = document.querySelectorAll('.input-wrapper input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    function validateField(field) {
        const wrapper = field.closest('.input-wrapper');
        const value = field.value.trim();
        
        // Remove existing error
        clearFieldError(field);
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Este campo es requerido');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Ingresa un email válido');
                return false;
            }
        }
        
        // Password validation
        if (field.type === 'password' && value) {
            if (value.length < 6) {
                showFieldError(field, 'La contraseña debe tener al menos 6 caracteres');
                return false;
            }
        }
        
        // Show success state
        wrapper.classList.add('success');
        return true;
    }

    function showFieldError(field, message) {
        const wrapper = field.closest('.input-wrapper');
        wrapper.classList.add('error');
        
        // Remove existing error message
        const existingError = wrapper.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        wrapper.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        const wrapper = field.closest('.input-wrapper');
        wrapper.classList.remove('error', 'success');
        
        const errorMessage = wrapper.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
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
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    `;
    document.head.appendChild(style);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Enter key to submit form
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            const form = document.activeElement.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape key to clear form
        if (e.key === 'Escape') {
            loginForm.reset();
            inputs.forEach(input => clearFieldError(input));
        }
    });

    // Focus management
    const firstInput = document.querySelector('.input-wrapper input');
    if (firstInput) {
        setTimeout(() => {
            firstInput.focus();
        }, 500);
    }

    // Remember me functionality
    const rememberCheckbox = document.getElementById('remember');
    if (rememberCheckbox) {
        // Load saved state
        const savedState = localStorage.getItem('rememberMe');
        if (savedState === 'true') {
            rememberCheckbox.checked = true;
        }
        
        // Save state on change
        rememberCheckbox.addEventListener('change', function() {
            localStorage.setItem('rememberMe', this.checked);
        });
    }

    console.log('Login page loaded successfully! 🔐');
}); 