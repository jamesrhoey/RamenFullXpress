// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password.';
        errorMessage.style.display = 'block';
        return false;
    }

    try {
        // Use the configuration system to get the correct API URL
        const apiUrl = typeof getApiUrl === 'function' ? getApiUrl() : 'https://ramen-27je.onrender.com/api/v1';
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            // Add the token to the user object
            data.user.token = data.token;
            localStorage.setItem('user', JSON.stringify(data.user));
            // Store token with consistent key name
            localStorage.setItem('authToken', data.token);
            console.log('Login successful, token stored:', data.token ? 'Yes' : 'No');
            // Redirect based on role
            if (data.user.role === 'admin') {
                window.location.href = 'html/dashboard.html';
            } else if (data.user.role === 'cashier') {
                window.location.href = 'html/pos.html';
            } else {
                window.location.href = 'html/dashboard.html';
            }
        } else {
            errorMessage.textContent = data.message || 'Login failed.';
            errorMessage.style.display = 'block';
        }
    } catch (err) {
        errorMessage.textContent = 'Server error. Please try again later.';
        errorMessage.style.display = 'block';
    }
    return false;
}

// Expose to HTML
window.handleLogin = handleLogin; 