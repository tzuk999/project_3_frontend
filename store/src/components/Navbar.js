import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import Products from './Products';
import AuthModal from './AuthModal';

function StoreNavbar() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleShowAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  function getProducts() {
    axios
      .get('http://127.0.0.1:8000/products/')
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error.data);
      });
  }

  function getCategories() {
    axios
      .get('http://127.0.0.1:8000/categories/')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  function getProductsBy(category) {
    axios
      .get(`http://127.0.0.1:8000/products/category/${category}/`)
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error.data);
      });
  }

  useEffect(() => {
    getCategories();
    getProducts();


    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('access_token') !== null;
    setIsAuthenticated(isAuthenticated);
  }, []);

  const handleLogOut = () => {
    const refresh_token = localStorage.getItem('refresh_token');
    
    if (!refresh_token) {
      console.error('Refresh token not found in localStorage');
      return;
    }
  
    axios
      .post('http://127.0.0.1:8000/logout/', { refresh_token: refresh_token }) // Send the refresh_token
      .then((response) => {
        console.log('Logged out successfully:', response.data);
  
        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
  
        setIsAuthenticated(false);
      })
      .catch((error) => {
        console.error('Logout error:', error.response.data);
      });
  };
  

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home" onClick={getProducts}>
            Store
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" onClick={getProducts}>
                All Products
              </Nav.Link>
              <NavDropdown title="Categories" id="basic-nav-dropdown">
                {categories.map((category) => (
                  <NavDropdown.Item
                    key={category.id}
                    onClick={() => getProductsBy(category.name)}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          {isAuthenticated ? (
            // Display "Log Out" when authenticated
            <Nav.Link
              href="#logout"
              className="ms-auto text-dark"
              onClick={handleLogOut}
            >
              Log Out
            </Nav.Link>
          ) : (
            // Display "Sign In / Sign Up" when not authenticated
            <Nav.Link
              href="#auth"
              className="ms-auto text-dark"
              id="signIn"
              onClick={handleShowAuthModal}
            >
              Sign In / Sign Up
            </Nav.Link>
          )}
          <Nav.Link href="#cart" className="ms-auto text-dark">
            Cart
          </Nav.Link>
        </Container>
      </Navbar>
      <br />
      <div>
        <Products products={products} />
      </div>

      <AuthModal show={showAuthModal} handleClose={handleCloseAuthModal} setIsAuthenticated={setIsAuthenticated} />
    </>
  );
}

export default StoreNavbar;
