import 'aframe';
import React, { useState } from 'react';
import VendingMachine from '../assets/objects/vending_machine_2.glb';
import Soda from '../assets/objects/chips.glb';

const API_URL = "http://localhost:4200"; // Or your deployed API URL

export default function VendingMachine3D({
  products,
  balance,
  coinInput,
  setCoinInput,
  onInsertCoin,
  onSelectProduct,
  selectedProductId,
  onConfirmPurchase,
  onCancel,
  message,
  change
}) {
  // State for product number input
  const [productNumberInput, setProductNumberInput] = useState('');

  // Handler for selecting product by number
  const handleSelectProductByNumber = () => {
    const idx = parseInt(productNumberInput, 10) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < products.length) {
      onSelectProduct(products[idx].id);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <a-scene
        embedded
        style={{ width: '100vw', height: '100vh' }}
        background="color: #b3e0ff"
      >
        {/* Sky and ground for a more immersive environment */}
        <a-sky color="#b3e0ff"></a-sky>
        <a-plane
          color="#8fd19e"
          rotation="-90 0 0"
          width="30"
          height="30"
          position="0 -5 -10"
        ></a-plane>

        {/* Stronger Lighting */}
        <a-light type="ambient" color="#fff" intensity="3"></a-light>
        <a-light type="directional" color="#fff" intensity="2.5" position="0 5 -4"></a-light>
        <a-light type="point" color="#fff" intensity="2.5" position="0 2 -4" distance="30"></a-light>
        <a-light type="point" color="#fff" intensity="1.5" position="2 4 -4" distance="20"></a-light>
        <a-light type="point" color="#fff" intensity="1.5" position="-2 4 -4" distance="20"></a-light>

        {/* Camera */}
        <a-entity camera look-controls position="0 1 -2.2"></a-entity>

        {/* Vending Machine Model */}
        <a-gltf-model
          id="projectorScreen"
          src={VendingMachine}
          scale="1 1 1"
          position="0 -5 -10"
          rotation="0 0 0"
        ></a-gltf-model>

        {/* Products as colored boxes in front of the machine, with numbers */}
        {products.map((product, idx) => {
          const pos = product.position
            ? `${product.position.x} ${product.position.y} ${product.position.z}`
            : (() => {
                const col = idx % 3;
                const row = Math.floor(idx / 3);
                return `${-0.65 + col * 0.45} ${1.5 - row * 0.5} -5`;
              })();
          const scale = product.scale
            ? `${product.scale.x} ${product.scale.y} ${product.scale.z}`
            : "0.07 0.07 0.07";
          // Always use API URL for assets
          const glbPath = `${API_URL}/src/assets/objects/${product.glb}`;

          return (
            <React.Fragment key={product.id}>
              <a-gltf-model
                src={glbPath}
                scale={scale}
                position={pos}
              ></a-gltf-model>
              {/* Product number above */}
              <a-text
                value={`#${product.id}`}
                align="center"
                color="#fff"
                width="1.2"
                position={
                  product.position
                    ? `${product.position.x} ${product.position.y + 0.25} ${product.position.z + 0.18}`
                    : (() => {
                        const col = idx % 3;
                        const row = Math.floor(idx / 3);
                        return `${-0.65 + col * 0.45} ${1.5 - row * 0.5 + 0.25} -4.82`;
                      })()
                }
              ></a-text>
              {/* Product name and price below */}
              <a-text
                value={`${product.name} (${product.price} MAD)`}
                align="center"
                color="#fff"
                width="2"
                position={
                  product.position
                    ? `${product.position.x} ${product.position.y - 0.25} ${product.position.z}`
                    : (() => {
                        const col = idx % 3;
                        const row = Math.floor(idx / 3);
                        return `${-0.65 + col * 0.45} ${1.5 - row * 0.5 - 0.25} -5`;
                      })()
                }
              ></a-text>
            </React.Fragment>
          );
        })}

        {/* UI Panel as HTML overlay */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
            background: 'rgba(30,30,30,0.95)',
            borderRadius: 12,
            padding: 24,
            minWidth: 320,
            color: '#fff',
            boxShadow: '0 4px 24px #0008',
            textAlign: 'center',
            zIndex: 10
          }}
        >
          <h2>Vending Machine</h2>
          <div className="mb-2">
            <strong>Balance:</strong> {balance} MAD
          </div>
          <div className="mb-2 d-flex align-items-center justify-content-center">
            <input
              type="number"
              min="0"
              step="0.1"
              value={coinInput}
              onChange={e => setCoinInput(e.target.value)}
              style={{
                width: 80,
                marginRight: 8,
                borderRadius: 4,
                border: '1px solid #888',
                padding: 4
              }}
              placeholder="Insert coin"
            />
            <button
              className="btn btn-success me-2"
              onClick={onInsertCoin}
              style={{ marginRight: 8 }}
            >
              Insert Coin
            </button>
          </div>
          {/* Product selection by number */}
          <div className="mb-2 d-flex align-items-center justify-content-center">
            <input
              type="number"
              min="1"
              max={products.length}
              value={productNumberInput}
              onChange={e => setProductNumberInput(e.target.value)}
              style={{
                width: 80,
                marginRight: 8,
                borderRadius: 4,
                border: '1px solid #888',
                padding: 4
              }}
              placeholder="Product #"
            />
            <button
              className="btn btn-primary"
              onClick={handleSelectProductByNumber}
              disabled={
                !productNumberInput ||
                isNaN(productNumberInput) ||
                productNumberInput < 1 ||
                productNumberInput > products.length
              }
            >
              Select Product
            </button>
          </div>
          <div className="mb-2 d-flex align-items-center justify-content-center">
            <button
              className="btn btn-secondary me-2"
              onClick={onCancel}
              style={{ marginRight: 8 }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={onConfirmPurchase}
              disabled={!selectedProductId}
            >
              Confirm Purchase
            </button>
          </div>
          {message && (
            <div className="alert alert-info" style={{ margin: 8 }}>
              {message}
            </div>
          )}
          {change && (
            <div className="alert alert-success" style={{ margin: 8 }}>
              <strong>Change:</strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {Object.entries(change).map(([coin, count]) => (
                  <li key={coin}>
                    {coin} MAD x {count}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>
            Enter the product number and click "Select Product".
          </div>
        </div>
      </a-scene>
    </div>
  );
}