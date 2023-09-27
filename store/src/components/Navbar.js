import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import axios from 'axios';
import Products from './Products';
import AuthModal from './AuthModal';
import Cart from './Cart'

function StoreNavbar() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    axios
      .get(`http://127.0.0.1:8000/products/?search=${searchTerm}`)
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error.data);
      });
    console.log('Searching for:', searchTerm);
    setSearchTerm("")
  };

  const handleShowAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleShowCart = () => {
    if (isAuthenticated){
      setShowCart(true);}
  };

  const handleCloseCart = () => {
    setShowCart(false);
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

  function addToCart(productId,quantity){

    // Perform any actions you want with the quantity
    console.log(`Product ${productId} - Quantity: ${quantity}`);
    if (isAuthenticated) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json', // Include Content-Type header
      };
      const cartId = localStorage.getItem('cart_id');
      axios
        .put(`/cart/${cartId}/update/${productId}/`, { quantity }, { headers }) // Use headers directly here
        .then((response) => {
          console.log(response.data);
          // Handle the response here
        })
        .catch((error) => {
          console.error(error);
          // Handle errors here
        });
    }
  };

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
      .get(`http://127.0.0.1:8000/products/?category=${category}`)
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
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    };
    axios
      .post('http://127.0.0.1:8000/logout/', { refresh_token: refresh_token }, {
        headers: {
          headers, 
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }) // Send the refresh_token
      .then((response) => {
        console.log('Logged out successfully:', response.data);
  
        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.removeItem('cart_id');
  
        setIsAuthenticated(false);
      })
      .catch((error) => {
        console.error('Logout error:', error.response);
      });
  };
  

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={getProducts}>
            Store
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={getProducts}>
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
          <div>
            <input className="d-flex"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Button variant="outline-success" onClick={() => handleSearch()}>
                Search
              </Button>
            </div>
          
          {isAuthenticated ? (
            // Display "Log Out" when authenticated
            <Nav.Link
              className="ms-auto text-dark"
              onClick={handleLogOut}
            >
              Log Out
            </Nav.Link>
          ) : (
            // Display "Sign In / Sign Up" when not authenticated
            <Nav.Link
              className="ms-auto text-dark"
              id="signIn"
              onClick={handleShowAuthModal}
            >
              Log In / Sign Up
            </Nav.Link>
          )}
          <Nav.Link 
            className="ms-auto text-dark"
            onClick={handleShowCart}>
            Cart
          </Nav.Link>
        </Container>
      </Navbar>
      <br />
      <div>
        <Products products={products} isAuthenticated={isAuthenticated} addToCart={addToCart}/>
      </div>

      <AuthModal show={showAuthModal} handleClose={handleCloseAuthModal} setIsAuthenticated={setIsAuthenticated} />
      <Cart show={showCart} handleCloseCart={handleCloseCart} addToCart={addToCart} isAuthenticated={isAuthenticated}/>
    </>
  );
}

export default StoreNavbar;
