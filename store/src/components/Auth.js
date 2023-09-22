import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

function Auth({ handleClose, isSignIn, setIsSignIn, setTokens }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = isSignIn
      ? 'http://127.0.0.1:8000/signin/'
      : 'http://127.0.0.1:8000/signup/';

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data) {
          const { access_token, refresh_token, user_id, username, cart_id } = response.data;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('user_id', user_id);
          localStorage.setItem('username', username);
          localStorage.setItem('cart_id', cart_id);

          setTokens(access_token, refresh_token); // Set the authenticated status to true
          handleClose(); // Close the modal after successful login or signup
        } else {
          console.error('Sign-in or Sign-up response data is empty:', response);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(isSignIn ? 'Sign-in error:' : 'Sign-up error:', error.response.data);
        } else {
          console.error(isSignIn ? 'Sign-in error:' : 'Sign-up error:', error.message);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="auth-input">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-input">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-button-container">
          <button className="auth-button" type="submit">
            {isSignIn ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </form>
    </>
  );
}

export default Auth;
