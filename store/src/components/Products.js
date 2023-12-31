import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './Product.css';


function Products({ products, isAuthenticated, addToCart }) {
  // State to store quantity for each product
  const [quantities, setQuantities] = useState({});

  // Function to handle changes in the quantity input
  const handleQuantityChange = (productId, newValue) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newValue,
    }));
  };

  // Function to handle "Add to Cart" button click
  const handleAddToCart = (productId) => {
    // Access the quantity for this product from the state
    const quantity = quantities[productId] || 0;
    if (quantity !== 0){
      addToCart(productId, quantity);
    }
    setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: 0,}));
  };

  return (
    <div>
    {products.length > 0 ? (
      products.map((product) => (
        <Card className="product-card" key={product.id}> {/* Apply the product-card class */}
          <Card.Title>{product.name}</Card.Title>
          <Card.Img className="card-img-top" src={`http://127.0.0.1:8000${product.image}`} alt={product.name} /> {/* Apply the card-img-top class */}
          <Card.Body>
            <div className="card-text">
              {/* Use OverlayTrigger to add tooltips for truncated text */}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-${product.id}`}>{product.description}</Tooltip>
                }
              >
                
                <p>{product.description}</p>
              </OverlayTrigger>
              <Card.Text>
                Price - ${product.price}    In Stock - {product.stock}
              </Card.Text>
            </div>
            <div>
              <input
                type="number"
                min="0"
                max={product.stock} 
                value={quantities[product.id] || 0}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10);
                  const maxValue = parseInt(e.target.max, 10);
                  const clampedValue = isNaN(newValue) ? 0 : Math.min(newValue, maxValue);
                  handleQuantityChange(product.id, clampedValue);
                }}
              />
            </div>
              <Button variant="primary" onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No products</p>
      )}
    </div>
  );
}

export default Products;
