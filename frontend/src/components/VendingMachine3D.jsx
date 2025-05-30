import 'aframe';
import React, { useState, useEffect } from 'react';
import 'aframe-environment-component';
import VendingMachine from '../assets/objects/vending_machine.glb';
import VendingMachine2 from '../assets/objects/vending_machine_2.glb';
import wallTexture from '../assets/texture/wall.jpg';
import TEN_DIRHAMS from '../assets/coins/10dh.svg';
import FIVE_DIRHAMS from '../assets/coins/5dh.svg';
import TWO_DIRHAMS from '../assets/coins/2dh.svg';
import ONE_DIRHAM from '../assets/coins/1dh.svg';
import HALF_DIRHAM from '../assets/coins/0.5dh.svg'
import table_and_chairs from '../assets/objects/cafeteria_table.glb';
import person from '../assets/objects/person.glb';
import Keypad from './Keypad';
import CoinPanel from './CoinPanel';
import Menu from './Menu';

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
  handleReset, // Add this prop to the destructuring
  message,
  change,
  transactionStatus,
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

  // Calculate total cart value
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Handler for selecting product by number
  const handleSelectProductByNumber = () => {
    const idx = parseInt(productNumberInput, 10) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < products.length) {
      const product = products[idx];
      if (balance < product.price) {
        // Not enough balance for this product
        setProductNumberInput('');
        return;
      }
      onSelectProduct(product.id);
      setCart(prev => [...prev, product]);
      setProductNumberInput('');
    }
  };

  // Add selected product to cart
  const handleAddProduct = () => {
    if (selectedProduct && balance >= selectedProduct.price) {
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

  // Handler for keypad press
  const handleKeypadPress = (num) => {
    const newInput = productNumberInput + num.toString();
    setProductNumberInput(newInput);
  };

  // Determine if any products are available to select based on balance
  const cheapestProductPrice = products.length > 0 
    ? Math.min(...products.map(p => p.price)) 
    : 0;
  
  const canSelectAnyProduct = balance >= cheapestProductPrice;

  // Handler for keypad "OK" button
  const handleKeypadOk = () => {
    if (productNumberInput === '') return;
    
    const idx = parseInt(productNumberInput, 10) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < products.length) {
      const product = products[idx];
      // Check if we have enough balance for this specific product
      if (balance >= product.price) {
        setCart(prev => [...prev, product]);
        onSelectProduct(product.id);
        setProductNumberInput('');
      } else {
        // Provide feedback - not enough balance for this product
        console.log(`Not enough balance for ${product.name}. Need ${product.price} MAD, have ${balance} MAD`);
        setProductNumberInput('');
      }
    } else {
      // Invalid product number
      setProductNumberInput('');
    }
  };

  // Handler for keypad "C" (clear) button
  const handleKeypadClear = () => {
    setProductNumberInput('');
  };

  // Clear cart when change is returned (purchase confirmed)
  useEffect(() => {
    if (change && cart.length > 0) {
      // Only deliver products on successful purchase
      if (transactionStatus === 'success') {
        setDeliveredProducts(cart);
      }
      // Clear cart in all cases
      setCart([]);
    }
    
    // If change is set and deliveredProducts is not empty, clear deliveredProducts on cancel
    if (transactionStatus === 'cancel' && deliveredProducts.length > 0) {
      setDeliveredProducts([]);
    }
  }, [change, transactionStatus, cart]); // Only runs when change is set (purchase confirmed)

  // Handler for confirm purchase, sends cart to parent
  const handleConfirmPurchase = () => {
    if (cart.length === 0) return;
    if (typeof onConfirmPurchase === 'function') {
      onConfirmPurchase(); // <-- no arguments
    }
  };

  // Reset all state
  const resetLocalState = () => {
    setCart([]);
    setDeliveredProducts([]);
    setProductNumberInput('');
    setInsertedCoins([]);
    
    if (typeof setCoinInput === 'function') setCoinInput('');
    
    // Call the parent's handleReset function
    if (typeof handleReset === 'function') {
      handleReset();
    }
  };

  const [animatingCoin, setAnimatingCoin] = useState(null);

  // Define coins for CoinPanel
  const coins = [
    { img: TEN_DIRHAMS, value: 10 },
    { img: FIVE_DIRHAMS, value: 5 },
    { img: TWO_DIRHAMS, value: 2 },
    { img: ONE_DIRHAM, value: 1 },
    { img: HALF_DIRHAM, value: 0.5 }
  ];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <a-scene
        embedded
         vr-mode-ui="enabled: false"
        style={{ width: '100vw', height: '100vh' }}
      >
      {/* Add assets for textures */}
      <a-assets>
        <img id="wallTexture" src={wallTexture} alt="Wall Texture" />
      </a-assets>
      
      <a-entity environment="preset: default;
                           skyType: atmosphere; 
                           lightPosition: 0 5 0;
                           fog: 0"
                           position="0 -7 -10"></a-entity>
     
      {/* Back wall with texture */}
      <a-box 
        position="0 0 -30" 
        depth="0.1" 
        height="20" 
        width="40" 
        src="#wallTexture"
      ></a-box>

      {/* Left wall with texture */}
      <a-box 
        position="-20 0 -10" 
        depth="40" 
        height="20" 
        width="0.1" 
        src="#wallTexture"
      ></a-box>

      {/* Right wall with texture */}
      <a-box 
        position="20 0 -10" 
        depth="40" 
        height="20" 
        width="0.1" 
        src="#wallTexture"
      ></a-box>

      {/* Ceiling with texture */}
      <a-box 
        position="0 10 -10" 
        depth="40" 
        height="0.1" 
        width="40" 
        src="#wallTexture"
      ></a-box>
      
     z

      {/* Stronger Lighting */}
      <a-light type="ambient" color="#fff" intensity="3"></a-light>
      <a-light type="directional" color="#fff" intensity="2.5" position="0 5 -4"></a-light>
      <a-light type="point" color="#fff" intensity="2.5" position="0 2 -4" distance="30"></a-light>
      <a-light type="point" color="#fff" intensity="1.5" position="2 4 -4" distance="20"></a-light>
      <a-light type="point" color="#fff" intensity="1.5" position="-2 4 -4" distance="20"></a-light>

      {/* Camera */}
      <a-entity camera look-controls  position="0 0.95 -2.5" rotation="-10 0 0"></a-entity>

      {/* Vending Machine Model */}
      <a-gltf-model
        id="projectorScreen"
        src={VendingMachine}
        scale="1 1 1"
        position="0 -5 -8.5"
        rotation="0 0 0"
      ></a-gltf-model>

      <a-gltf-model
        id="projectorScreen"
        src={table_and_chairs}
        scale="6 6 6"
        position="14 -7 -15"
        rotation="0 90 0"
      ></a-gltf-model>

      <a-gltf-model
        id="projectorScreen"
        src={person}
        scale="5 5 5"
        position="-12 -6.5 -20"
        rotation="-10 -90 0"
      ></a-gltf-model>

      <a-gltf-model
        id="projectorScreen"
        src={VendingMachine2}
        scale="4 4 4"
        position="-16 -6.5 -20"
        rotation="0 0 0"
      ></a-gltf-model>
      
      {/* Display panel for cart */}
      <a-box
        color="#000"
        width="0.6"
        depth="0.01"
        align="center"
        position="1.33 1.5 -6"
      />
      <a-text
        value={`${total.toFixed(2)} MAD`}
        color="#fff"
        width="1.6"
        align="center"
        position="1.33 1.85 -5.95"
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
        position="1.33 1.65 -5.95"
      />
      
      {/* Display panel for balance - simplified to just show balance */}
      <a-text
        value={`${balance.toFixed(2)} MAD`}
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
        // Changed to check against total balance
        const canAffordProduct = balance >= product.price;

        return (
          <React.Fragment key={product.id}>
            <a-gltf-model
              src={glbPath}
              scale={scale}
              position={pos}
              events={{
                click: () => {
                  if (canAffordProduct) {
                    onSelectProduct(product.id);
                    setCart(prev => [...prev, product]);
                  } else {
                    console.log(`Not enough balance for ${product.name}. Need ${product.price} MAD, have ${balance} MAD`);
                  }
                }
              }}
              material={canAffordProduct ? '' : 'color: #888; opacity: 0.5'}
            ></a-gltf-model>
            
            {/* Add a clickable overlay for React */}
            <a-entity
              geometry="primitive: plane; width: 0.3; height: 0.3"
              material={`color: #fff; opacity: 0${canAffordProduct ? '' : '.4'}`}
              position={pos}
              events={{
                click: () => {
                  if (canAffordProduct) {
                    onSelectProduct(product.id);
                    setCart(prev => [...prev, product]);
                  }
                }
              }}
            ></a-entity>
            
            {/* Product number and price above */}
            <a-text
              value={`#${product.id} (${product.price} MAD)`}
              align="center"
              color={isSelected ? "#ffd700" : canAffordProduct ? "#fff" : "#aaa"}
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
              color={isSelected ? "#ffd700" : canAffordProduct ? "#fff" : "#aaa"}
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

      {/* Add a wall behind the camera for a complete room */}
      <a-box 
        position="0 0 3" 
        depth="0.1" 
        height="20" 
        width="40" 
        src="#wallTexture"
      ></a-box>

      {/* Maybe add a door in the wall behind */}
      <a-box 
        position="12 -2 3" 
        depth="0.2" 
        height="12" 
        width="6" 
        color="#8B4513"
        material="roughness: 0.7"
      ></a-box>

      {/* Door handle */}
      <a-sphere
        position="10 -2 2.9"
        radius="0.3"
        color="#C0C0C0"
      ></a-sphere>
    </a-scene>
    {/* Use Menu component */}
    <Menu
      insertedCoins={insertedCoins}
      animatingCoin={animatingCoin}
      setAnimatingCoin={setAnimatingCoin}
      setInsertedCoins={setInsertedCoins}
      onInsertCoin={onInsertCoin}
      coins={coins}
      productNumberInput={productNumberInput}
      handleKeypadPress={handleKeypadPress}
      handleKeypadOk={handleKeypadOk}
      handleKeypadClear={handleKeypadClear}
      balance={balance}
      onCancel={onCancel}
      handleConfirmPurchase={handleConfirmPurchase}
      handleReset={resetLocalState} // Pass the local reset function
      cart={cart}
      change={change}
      products={products} // Add this line to pass products
    />
  </div>
);}