import axios from 'axios';
import React, { useState } from 'react';

function App() {
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
  return (
    <>
    <div>
        <h1>Product List</h1>
        {products.length > 0 ? (
          <ul>
            {products.map((product, index) => (
              <li key={index}>{product.name}</li>
            ))}
          </ul>
        ) : (
          <p>No products</p>
        )}
      </div>
    <button onClick={getProducts}>Get Products</button>
    </>
  );
}

export default App;
