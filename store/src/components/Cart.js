import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Products.js';

function Cart({ show, handleCloseCart, addToCart, isAuthenticated}) {
  const [cartItems, setCartItems] = useState([]);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [cartId, setCartId] = useState(localStorage.getItem('cart_id'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  function getCart(){
    if (show && cartId && accessToken) {
      // Define headers with the access token
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Make an API request to fetch cart items based on cartId with the headers
      axios
        .get(`http://127.0.0.1:8000/cart/${cartId}/`, { headers })
        .then((response) => {
          console.log(response)
          setCartItems(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }
  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'))
    setCartId(localStorage.getItem('cart_id'))
    setUsername(localStorage.getItem('username'))
    getCart()
  }, [show, cartId, accessToken]);

  // Calculate the total price of all cart items
  const totalCartPrice = cartItems.reduce((total, item) => total + item.total_price, 0);

  async function removeItem(productId) {
    try {
      
      await addToCart(productId, 0);
  
      // Insert a one-second pause (1000 milliseconds)
      await new Promise(resolve => setTimeout(resolve, 50));
  
      
      getCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
  

  return (
    <>
      <Modal show={show} onHide={handleCloseCart}>
        <Modal.Header closeButton>
          <Modal.Title>{username}'s Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {cartItems.map((item) => (
              <div key={item.id}>
                <span>Product: {item.product_name}</span> | 
                <span>Quantity: {item.quantity}</span> | 
                <span>Price: ${(Number(item.total_price).toFixed(2))}</span> | 
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => removeItem(item.product_id)}
                >
                 Remove
                </Button>
              </div>
            ))}
          </div>
          <hr />
          <p>Total Price: ${(Number(totalCartPrice).toFixed(2))}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCart}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Cart;
