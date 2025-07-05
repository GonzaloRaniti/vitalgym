// Registration page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const socialButtons = document.querySelectorAll('.social-btn');

    // Password toggle functionality
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
            
            // Update aria-label
            const isVisible = type === 'text';
            this.setAttribute('aria-label', isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña');
        });
    });

    // Password strength checker
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }

    // Password confirmation checker
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            checkPasswordMatch();
        });
    }

    function checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let feedback = '';

        // Check length
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;

        // Check for different character types
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        // Cap at 100%
        strength = Math.min(strength, 100);

        // Update strength bar
        strengthBar.style.width = strength + '%';
        strengthBar.className = 'strength-fill';

        // Determine strength level and feedback
        if (strength < 25) {
            strengthBar.classList.add('weak');
            feedback = 'Muy débil';
        } else if (strength < 50) {
            strengthBar.classList.add('fair');
            feedback = 'Débil';
        } else if (strength < 75) {
            strengthBar.classList.add('good');
            feedback = 'Buena';
        } else {
            strengthBar.classList.add('strong');
            feedback = 'Muy fuerte';
        }

        strengthText.textContent = `Fortaleza: ${feedback}`;
    }

    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmWrapper = confirmPasswordInput.closest('.input-wrapper');

        // Remove existing match indicators
        const existingMatch = confirmWrapper.querySelector('.password-match, .password-mismatch');
        if (existingMatch) {
            existingMatch.remove();
        }

        if (confirmPassword === '') return;

        if (password === confirmPassword) {
            confirmWrapper.classList.remove('error');
            confirmWrapper.classList.add('success');
            
            const matchIndicator = document.createElement('div');
            matchIndicator.className = 'password-match';
            matchIndicator.innerHTML = '<i class="fas fa-check-circle"></i>Las contraseñas coinciden';
            confirmWrapper.appendChild(matchIndicator);
        } else {
            confirmWrapper.classList.remove('success');
            confirmWrapper.classList.add('error');
            
            const mismatchIndicator = document.createElement('div');
            mismatchIndicator.className = 'password-mismatch';
            mismatchIndicator.innerHTML = '<i class="fas fa-exclamation-circle"></i>Las contraseñas no coinciden';
            confirmWrapper.appendChild(mismatchIndicator);
        }
    }

    // Form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateRegisterForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('.register-btn');
                submitBtn.classList.add('loading');
                
                // Simulate API call
                setTimeout(() => {
                    // Simulate successful registration
                    showNotification('¡Cuenta creada exitosamente! Bienvenido a Vital Gym.', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Remove loading state
                    submitBtn.classList.remove('loading');
                    
                    // Redirect to login page
                    setTimeout(() => {
                        window.location.href = './login.html';
                    }, 2000);
                }, 2000);
            } else {
                showNotification('Por favor, completa todos los campos correctamente.', 'error');
            }
        });
    }

    // Form validation
    function validateRegisterForm(data) {
        const requiredFields = ['nombre', 'apellido', 'email', 'telefono', 'password', 'confirmPassword'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Check required fields
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                showFieldError(document.getElementById(field), 'Este campo es requerido');
                return false;
            }
        }

        // Validate email
        if (!emailRegex.test(data.email)) {
            showFieldError(document.getElementById('email'), 'Ingresa un email válido');
            return false;
        }

        // Validate password length
        if (data.password.length < 6) {
            showFieldError(document.getElementById('password'), 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        // Validate password match
        if (data.password !== data.confirmPassword) {
            showFieldError(document.getElementById('confirmPassword'), 'Las contraseñas no coinciden');
            return false;
        }

        // Validate terms acceptance
        if (!data.terms) {
            showNotification('Debes aceptar los términos y condiciones.', 'error');
            return false;
        }

        return true;
    }

    // Social registration buttons
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`Registrándote con ${provider}...`, 'info');
            
            // Simulate social registration
            setTimeout(() => {
                showNotification(`¡Registro con ${provider} exitoso!`, 'success');
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

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Ingresa un teléfono válido');
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
            registerForm.reset();
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

    // Auto-format phone number
    const phoneInput = document.getElementById('telefono');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }

    console.log('Registration page loaded successfully! 📝');
}); 