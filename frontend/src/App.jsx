import React, { useState, useEffect } from 'react';
import './styles/css/main.css';
import VendingMachine3D from './components/VendingMachine3D';

const API_URL = 'http://localhost:4200/api';

function App() {
  const [balance, setBalance] = useState(0);
  const [coinInput, setCoinInput] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [message, setMessage] = useState('');
  const [change, setChange] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch balance on mount and after actions
  const fetchBalance = () => {
    fetch(`${API_URL}/balance`)
      .then(res => res.json())
      .then(data => setBalance(data.balance || 0));
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, []);

  // Insert coin handler
  const handleInsertCoin = (amountFromButton) => {
    const amount = amountFromButton !== undefined
      ? amountFromButton
      : parseFloat(coinInput);
    if (isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    fetch(`${API_URL}/insert-coin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(data => {
        setMessage('Coin inserted.');
        setCoinInput('');
        fetchBalance();
      })
      .catch(() => setMessage('Error inserting coin.'));
  };

  // Select product handler
  const handleSelectProduct = (productId) => {
    fetch(`${API_URL}/select-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === false) {
          setMessage(data.error || 'Error selecting product.');
        } else {
          setSelectedProductId(productId);
          setMessage('Product selected.');
        }
        fetchBalance();
      })
      .catch(() => setMessage('Error selecting product.'));
  };

  // Confirm purchase handler
  const handleConfirmPurchase = (cart) => {
    if (!cart || cart.length === 0) {
      setMessage('Panier vide.');
      return;
    }
    fetch(`${API_URL}/confirm-purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage('Purchase successful!');
          setChange(data.change);
          setSelectedProductId(null);
        } else {
          setMessage(data.error || 'Purchase failed.');
        }
        fetchBalance();
      })
      .catch(() => setMessage('Error confirming purchase.'));
  };

  // Cancel transaction handler
  const handleCancel = () => {
    fetch(`${API_URL}/cancel`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setMessage('Transaction cancelled. Refunded.');
        setSelectedProductId(null);
        setChange(null);
        fetchBalance();
      })
      .catch(() => setMessage('Error cancelling transaction.'));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <VendingMachine3D
        products={products}
        balance={balance}
        coinInput={coinInput}
        setCoinInput={setCoinInput}
        onInsertCoin={handleInsertCoin}
        setBalance={setBalance}
        onSelectProduct={handleSelectProduct}
        selectedProductId={selectedProductId}
        onConfirmPurchase={handleConfirmPurchase}
        onCancel={handleCancel}
        message={message}
        change={change}
      />
    </div>
  );
}

export default App;
