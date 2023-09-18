import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Auth from './Auth';
import './Auth.css';

function AuthModal({ show, handleClose, setIsAuthenticated }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const setTokens = (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setIsAuthenticated(true); // Set isAuthenticated to true
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isSignIn ? 'Log In' : 'Sign Up'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Auth
          isSignIn={isSignIn}
          setIsSignIn={setIsSignIn}
          handleClose={handleClose}
          setTokens={setTokens} // Pass setAuthenticated prop
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => setIsSignIn(!isSignIn)}>
          {isSignIn ? 'Switch to Sign Up' : 'Switch to Log In'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AuthModal;
