import 'aframe';
import React, { useState, useEffect } from 'react';
import 'aframe-environment-component';
import VendingMachine from '../assets/objects/vending_machine_2.glb';
import TEN_DIRHAMS from '../assets/coins/10dh.svg';
import FIVE_DIRHAMS from '../assets/coins/5dh.svg';
import TWO_DIRHAMS from '../assets/coins/2dh.svg';
import ONE_DIRHAM from '../assets/coins/1dh.svg';
import HALF_DIRHAM from '../assets/coins/0.5dh.svg';

const API_URL = "http://localhost:4200";

export default function VendingMachine3D({
  products,
  balance,
  coinInput,
  setCoinInput,
  setBalance,
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
  // Cart state: array of product objects
  const [cart, setCart] = useState([]);
const [insertedCoins, setInsertedCoins] = useState([]);
  // Products to display at the bottom after purchase
  const [deliveredProducts, setDeliveredProducts] = useState([]);

  // Show selected product in panel
  const selectedProduct = products.find(p => p.id === selectedProductId);

  console.log("Change received:", change);
  // Handler for selecting product by number
  const handleSelectProductByNumber = () => {
    const idx = parseInt(productNumberInput, 10) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < products.length) {
      const product = products[idx];
      if (balance < product.price) {
        setProductNumberInput('');
        return;
      }
      onSelectProduct(product.id);
      setProductNumberInput('');
    }
  };

  // Add selected product to cart
  const handleAddProduct = () => {
    if (selectedProduct) {
      setCart([...cart, selectedProduct]);
    }
  };

  // Group cart items by id for display
  const cartSummary = cart.reduce((acc, item) => {
    const found = acc.find(i => i.id === item.id);
    if (found) found.quantity += 1;
    else acc.push({ ...item, quantity: 1 });
    return acc;
  }, []);

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  // Handler for keypad press
  const handleKeypadPress = (num) => {
    const newInput = productNumberInput + num.toString();
    setProductNumberInput(newInput);
  };

  // Disable product selection if not enough balance for the cheapest product
  const minProductPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;
  const canSelectProduct = balance >= minProductPrice;

  // Handler for keypad "OK" button
  const handleKeypadOk = () => {
  if (!canSelectProduct) return;
  const idx = parseInt(productNumberInput, 10) - 1;
  if (!isNaN(idx) && idx >= 0 && idx < products.length) {
    const product = products[idx];
    if (balance - total < product.price) { // check remaining balance
      setProductNumberInput('');
      return;
    }
    setCart(prev => [...prev, product]);
    onSelectProduct(product.id); // <-- Notify backend of selection
    setProductNumberInput('');
    }
};

  // Handler for keypad "C" (clear) button
  const handleKeypadClear = () => {
    setProductNumberInput('');
  };

  // Keypad numbers
  const keypad = [0,1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Clear cart when change is returned (purchase confirmed)
  useEffect(() => {
    // If change is set and cart is not empty, clear cart (for both purchase and cancel)
    if (change && cart.length > 0) {
      setDeliveredProducts(cart);
      setCart([]);
    }
    // If change is set and deliveredProducts is not empty (cancel), clear deliveredProducts
    if (change && deliveredProducts.length > 0) {
      setDeliveredProducts([]);
    }
  }, [change]); // Only runs when change is set (purchase confirmed)

  // Handler for confirm purchase, sends cart to parent
  const handleConfirmPurchase = () => {
  if (cart.length === 0) return;
  if (typeof onConfirmPurchase === 'function') {
    onConfirmPurchase(); // <-- no arguments
  }
};

  // Reset all state
  const handleReset = () => {
    setCart([]);
    setDeliveredProducts([]);
    setProductNumberInput('');
    if (typeof setCoinInput === 'function') setCoinInput('');
    // Optionally, you can call onCancel or trigger a parent reset if needed
    if (typeof onCancel === 'function') onCancel();
  };

  const [animatingCoin, setAnimatingCoin] = useState(null);

  // Helper for coin positions (adjust as needed)
  const coinPositions = [
    { left: 0 }, { left: 60 }, { left: 120 }, { left: 180 }, { left: 240 }
  ];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <a-scene
        embedded
    
        style={{ width: '100vw', height: '100vh' }}
    
      >
        {/* Sky and ground for a more immersive environment */}
        <a-sky color="#b3e0ff"></a-sky>
        <a-plane
          color="red"
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
        <a-entity camera position="0 1 -2.5" rotation="-10 0 0"></a-entity>

        {/* Vending Machine Model */}
        <a-gltf-model
          id="projectorScreen"
          src={VendingMachine}
          scale="1 1 1"
          position="0 -5 -8.5"
          rotation="0 0 0"
        ></a-gltf-model>
        <a-box
          color="#000"
          width="0.6"
          depth="0.01"
          align="center"
          position="1.33 1.5 -6"
        />
        <a-text
          value={
            cart.length === 0
              ? "Panier vide"
              : cartSummary.map(item => `${item.name} (x${item.quantity})`).join('\n')
          }
          color="#fff"
          width="1.6"
          align="center"
          position="1.33 1.65 -5.95" // slightly in front of the box
        />
        <a-text
          value={balance.toFixed(2) + " MAD"} // <-- just balance, not balance - total
          color="#fff"
          width="2"
          align="center"
          position="1.33 0.275 -6"
        />
        <a-box
          color="#000"
          width="0.6"
          depth="0.01"
          align="center"
          position="1.33 -1.5 -6"
        />
        {/* Show returned coins as images in front of the box */}
        {change && typeof change === 'object' && Object.keys(change).length > 0 && (
          Object.entries(change).map(([coin, qty], idx) => {
            let coinImg;
            if (coin === "10" || coin === "10.0") coinImg = TEN_DIRHAMS;
            else if (coin === "5" || coin === "5.0") coinImg = FIVE_DIRHAMS;
            else if (coin === "2" || coin === "2.0") coinImg = TWO_DIRHAMS;
            else if (coin === "1" || coin === "1.0") coinImg = ONE_DIRHAM;
            else if (coin === "0.5") coinImg = HALF_DIRHAM;
            else coinImg = null;
            // Spread coins horizontally in front of the box
            const x = 1.33 - 0.15 + idx * 0.15;
            const y = -1.65;
            const z = -5.95;
            return (
              coinImg && (
                <a-image
                  key={coin}
                  src={coinImg}
                  position={`${x} ${y} ${z}`}
                  width="0.12"
                  height="0.12"
                  alt={`${coin} MAD`}
                >
                </a-image>
              )
            );
          })
        )}

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
          const glbPath = `${API_URL}/src/assets/objects/${product.glb}`;
          const isSelected = selectedProductId === product.id;

          return (
            <React.Fragment key={product.id}>
              <a-gltf-model
                src={glbPath}
                scale={scale}
                position={pos}
                events={{
                  click: () => {
                    if (canSelectProduct && balance >= product.price) {
                      onSelectProduct(product.id);
                      setCart(prev => [...prev, product]);
                    }
                  }
                }}
                material={canSelectProduct && balance >= product.price ? '' : 'color: #888; opacity: 0.5'}
              ></a-gltf-model>
              {/* Add a clickable overlay for React */}
              <a-entity
                geometry="primitive: plane; width: 0.3; height: 0.3"
                material={`color: #fff; opacity: 0${canSelectProduct && balance >= product.price ? '' : '.4'}`}
                position={pos}
                events={{
                  click: () => {
                    if (canSelectProduct && balance >= product.price) {
                      onSelectProduct(product.id);
                    }
                  }
                }}
              ></a-entity>
              {/* Product number and price above */}
              <a-text
                value={`#${product.id} (${product.price} MAD)`}
                align="center"
                color={isSelected ? "#ffd700" : "#fff"}
                width={isSelected ? "1.3" : "1.2"}
                font={isSelected ? "mozillavr" : "dejavu"}
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
              {/* Product name below */}
              <a-text
                value={product.name}
                align="center"
                color={isSelected ? "#ffd700" : "#fff"}
                width={isSelected ? "1.5" : "1"}
                font={isSelected ? "mozillavr" : "dejavu"}
                position={
                  product.position
                    ? `${product.position.x} ${product.position.y - 0.07} ${product.position.z}`
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

        {/* Cart display at the bottom */}
        {deliveredProducts.length > 0 && deliveredProducts.map((product, idx) => {
          const cartX = (-0.8) + (idx % 3) * 0.2;
          const cartY = -1.8;
          const cartZ = -5;
          const scale = product.scale
            ? `${product.scale.x} ${product.scale.y} ${product.scale.z}`
            : "0.07 0.07 0.07";
          const glbPath = `${API_URL}/src/assets/objects/${product.glb}`;
          return (
            <React.Fragment key={`cart-${idx}`}>
              <a-gltf-model
                src={glbPath}
                scale={scale}
                position={`${cartX} ${cartY} ${cartZ}`}
              ></a-gltf-model>
            </React.Fragment>
          );
        })}

        
      </a-scene>
      {/* Panel merged here */}
      <div
        className="vending-panel mx-auto"
        style={{
          position: 'absolute',
          right: 20,
          top: 30,
          zIndex: 10
        }}
      >
        <div className='coin-panel' style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  {[
    { img: TEN_DIRHAMS, value: 10 },
    { img: FIVE_DIRHAMS, value: 5 },
    { img: TWO_DIRHAMS, value: 2 },
    { img: ONE_DIRHAM, value: 1 },
    { img: HALF_DIRHAM, value: 0.5 }
  ].map((coinType, coinIdx) => (
    <div key={coinType.value} className='d-flex  justify-content-evenly ' style={{ marginBottom: 4 }}>
      {Array.from({ length: 5 }).map((_, coinCopyIdx) => {
        const uniqueKey = `${coinIdx}-${coinCopyIdx}`;
        if (insertedCoins.includes(uniqueKey) && animatingCoin !== uniqueKey) return null;
        return (
          <div className='coin' key={uniqueKey} style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={coinType.img}
              className='w-100'
              alt={`${coinType.value} Dirhams`}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                zIndex: animatingCoin === uniqueKey ? 100 : 1,
                position: animatingCoin === uniqueKey ? 'absolute' : 'static',
                left: animatingCoin === uniqueKey ? 0 : undefined,
                top: animatingCoin === uniqueKey ? 0 : undefined,
                transform: animatingCoin === uniqueKey
                  ? 'translate(-180px, 150px) scale(0.7)'
                  : 'scale(1)',
                transition: animatingCoin === uniqueKey
                  ? 'transform 0.7s cubic-bezier(.4,2,.6,1)'
                  : 'transform 0.2s'
              }}
              onClick={() => {
                setAnimatingCoin(uniqueKey);
                setTimeout(() => {
                  setAnimatingCoin(null);
                  setInsertedCoins(prev => [...prev, uniqueKey]);
                  onInsertCoin(coinType.value);
                }, 700);
              }}
              onMouseEnter={e => e.currentTarget.style.transform = animatingCoin === uniqueKey ? e.currentTarget.style.transform : 'scale(1.2)'}
              onMouseLeave={e => e.currentTarget.style.transform = animatingCoin === uniqueKey ? e.currentTarget.style.transform : 'scale(1)'}
            />
            </div>
            );
          })}
        </div>
        ))}
      </div>

        {/* Cart and Keypad side by side */}
        <div
         className='fs-6'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 4,
            marginTop: 16,
            width: 480,
            maxWidth: '100%',
          }}
        >
          

          {/* Keypad */}
          <div
            className="vending-keypad"
            style={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              background: "#222",
              borderRadius: 8,
              padding: 10,
              minWidth: 180,
              opacity: canSelectProduct ? 1 : 0.5,
              pointerEvents: canSelectProduct ? 'auto' : 'none'
            }}
          >
            <div
              className="vending-keypad-input bg-dark mb-2 fs-6"
              style={{
                color: "#fff",
                textAlign: "center",
                borderRadius: 6,
                padding: "6px 0",
                marginBottom: 10,
                letterSpacing: 2,
                minHeight: 32,
                width: "100%",
              }}
            >
              {productNumberInput || <span style={{ opacity: 0.5 }}>Numéro du produit</span>}
            </div>
            {keypad.map((num) => (
              <div
                key={num}
                className="vending-key"
                style={{
                  width: 50,
                  height: 50,
                  margin: 4,
                  background: "#444",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleKeypadPress(num)}
              >
                {num}
              </div>
            ))}
            <div
              className="vending-key"
              style={{
                width: 50,
                height: 50,
                margin: 4,
                background: "#666",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                fontSize: "1.3rem",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={handleKeypadClear}
            >
              C
            </div>
            <div
              className="btn btn-success"
              style={{
                width: 110,
                height: 50,
                margin: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                fontSize: "1.1rem",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={handleKeypadOk}
            >
              Ajouter
            </div>
          </div>
        </div>
        
        <div className="d-flex gap-1 mt-3 fw-bold">
          <button className="btn-primary btn col-4 text-white" onClick={onCancel}>Annuler</button>
          <button
            className="btn btn-primary col-4 text-white"
            onClick={handleConfirmPurchase}
            disabled={cart.length === 0}
          >
            Confirmer
          </button>
          <button
            className="btn btn-primary col-4 text-white"
            onClick={handleReset}
            type="button"
          >
            Reset
          </button>
        </div>

        {change && typeof change === 'object' && (
          <div className='d-flex align-items-center flex-wrap mt-3'>
            <span style={{ marginRight: 8 }}>Change:&nbsp;</span>
            {Object.entries(change).map(([coin, qty]) => {
              let coinImg;
              if (coin === "10" || coin === "10.0") coinImg = TEN_DIRHAMS;
              else if (coin === "5" || coin === "5.0") coinImg = FIVE_DIRHAMS;
              else if (coin === "2" || coin === "2.0") coinImg = TWO_DIRHAMS;
              else if (coin === "1" || coin === "1.0") coinImg = ONE_DIRHAM;
              else if (coin === "0.5") coinImg = HALF_DIRHAM;
              else coinImg = null;
              return (
                <span key={coin} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 14 }}>
                  {qty} x
                  {coinImg && (
                    <img
                      src={coinImg}
                      alt={`${coin} MAD`}
                      style={{ width: 32, height: 32, margin: '0 4px', verticalAlign: 'middle' }}
                    />
                  )}
                  {!coinImg && <span style={{ margin: '0 4px' }}>{coin} MAD</span>}
                </span>
              );
            })}
          </div>
        )}
        {change && typeof change !== 'object' && (
          <div style={{ color: 'white', marginTop: 10 }}>
            Change: {change} MAD
          </div>
        )}
      </div>
    </div>
  );
}