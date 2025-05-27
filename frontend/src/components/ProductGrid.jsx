import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4200/api';

const ProductGrid = ({ onSelectProduct, selectedProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, []);

  return (
    <div className="container product-grid">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className={`product-card card h-100${selectedProductId === product.id ? ' border-primary' : ''}`}>
              <div className="card-body text-center">
                <div className="product-id">{product.id}</div>
                <h5 className="product-name">{product.name}</h5>
                <div className="product-price">{product.price} MAD</div>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => onSelectProduct(product.id)}
                  disabled={selectedProductId === product.id}
                >
                  {selectedProductId === product.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;