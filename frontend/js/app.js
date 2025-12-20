// Automatically use relative path for production, or fallback to localhost if needed (though /api matches the serving origin)
const API_BASE = '/api';

const App = {
    state: {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        user: JSON.parse(localStorage.getItem('user') || '{}'),
    },

    init: () => {
        // Handle Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', App.logout);
        }
    },

    // API Wrapper
    api: async (endpoint, method = 'GET', body = null) => {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (App.state.token) {
            headers['Authorization'] = `Bearer ${App.state.token}`;
        }

        const config = {
            method,
            headers,
        };
        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, config);
            if (res.status === 401 || res.status === 403) {
                // Token invalid
                if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
                    App.logout();
                }
                return null;
            }
            const data = await res.json();
            if (!res.ok) throw data;
            return data;
        } catch (err) {
            console.error(err);
            alert(err.error || 'Something went wrong');
            throw err;
        }
    },

    login: (token, role, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(user));
        App.state = { token, role, user };

        if (role === 'doctor') {
            window.location.href = 'dashboard_doctor.html';
        } else {
            window.location.href = 'dashboard_user.html';
        }
    },

    logout: () => {
        localStorage.clear();
        window.location.href = 'index.html';
    },

    // Check Auth on Dashboard pages
    checkAuth: () => {
        if (!App.state.token) {
            window.location.href = 'index.html';
        }
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', App.init);
