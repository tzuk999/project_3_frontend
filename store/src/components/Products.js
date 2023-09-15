function Products({products}) {
    return (
      <>
      <div>
          <h1>Product List</h1>
          {products.length > 0 ? (
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                <p>{product.name} - ${product.price}</p>
                {product.image && (
                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt={product.name}
                    style={{ width: '300px', height: '200px' }} // Set the width and height here
                  />
                )}
  
              </li>
            ))}
          </ul>
        ) : (
          <p>No products</p>
        )}
        </div>
      </>
    );
  }
  
  export default Products;