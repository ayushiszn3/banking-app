import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Ensure the file name matches exactly

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      const token = response.data.access_token;

      if (token) {
        localStorage.setItem('token', token); // Store the token
        alert('Login successful! Redirecting...');
        // Redirect to dashboard or another page after login
        window.location.href = '/dashboard'; // Assuming a dashboard route
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
        <a href="/register" className="register-link">Don't have an account? Register here</a>
      </form>
    </div>
  );
}

export default LoginPage;
