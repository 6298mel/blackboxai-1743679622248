// Authentication system for Starlink Direct to Cell

// Check authentication status
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that don't require authentication
    const publicPages = ['gateway.html', 'signin.html', 'signup.html'];
    
    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = 'gateway.html';
        return false;
    }
    return true;
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Display user info if logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const userElements = document.querySelectorAll('.user-name');
        userElements.forEach(el => {
            el.textContent = user.fullName || user.email.split('@')[0];
        });
    }
});

// Sign Up Form Handler
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate inputs
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user exists
    if (users.some(u => u.email === email)) {
        alert('An account with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        phone,
        password, // Note: In production, hash passwords
        createdAt: new Date().toISOString()
    };

    // Save user and session
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    alert('Account created successfully!');
    window.location.href = 'index.html';
});

// Sign In Form Handler
document.getElementById('signinForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;

    // Get users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Set longer session if "Remember me" is checked
        if (rememberMe) {
            const weekFromNow = new Date();
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            localStorage.setItem('sessionExpiry', weekFromNow.toISOString());
        }
        
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
});

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionExpiry');
    window.location.href = 'gateway.html';
}