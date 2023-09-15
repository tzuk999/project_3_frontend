import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import Products from './Products'
function StoreNavbar() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([])
  
    function getProducts(){
      axios.get('http://127.0.0.1:8000/products/')
        .then((response) => {
          console.log(response.data)
          setProducts(response.data)
        })
        .catch((error) => {
          console.log(error.data)
        });
    }

    useEffect(() => {
    axios.get('http://127.0.0.1:8000/categories/')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <><Navbar bg="light" expand="lg">
          <Container>
              <Navbar.Brand href="#home" onClick={getProducts}>Store</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                      <Nav.Link href="#home" onClick={getProducts}>Home</Nav.Link>
                      <NavDropdown title="Categories" id="basic-nav-dropdown">
                          {categories.map((category) => (
                              <NavDropdown.Item key={category.id} href={`#action/${category.id}`}>
                                  {category.name}
                              </NavDropdown.Item>
                          ))}
                      </NavDropdown>

                  </Nav>

              </Navbar.Collapse>
              <Nav.Link href="#cart" className="ms-auto text-dark">Cart</Nav.Link>
          </Container>
      </Navbar><br /><div>
              <Products products={products} />
          </div></>   
  );
}

export default StoreNavbar;
