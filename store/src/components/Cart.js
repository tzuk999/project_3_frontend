import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function Cart({ show, handleCloseCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [cartId, setCartId] = useState(localStorage.getItem('cart_id'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'))
    setCartId(localStorage.getItem('cart_id'))
    setUsername(localStorage.getItem('username'))

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
  }, [show, cartId, accessToken]);

  return (
    <>
      <Modal show={show} onHide={handleCloseCart}>
        <Modal.Header closeButton>
          <Modal.Title>{username}'s Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {cartItems.map((item) => (
              <p key={item.id}>
                Product: {item.product_name}  -  Quantity: {item.quantity}  - Price : ${item.total_price}
              </p>
            ))}
          </div>
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