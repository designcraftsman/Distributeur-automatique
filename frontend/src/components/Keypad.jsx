import React, { useState } from 'react';

export default function Keypad({
  productNumberInput,
  handleKeypadPress,
  handleKeypadOk,
  handleKeypadClear,
  canSelectProduct,
  onCancel,
  handleConfirmPurchase,
  handleReset,
  cart,
  balance,
  getProductPrice
}) {
  const [noCoinMessage, setNoCoinMessage] = useState(false);
  const [notEnoughCoinMessage, setNotEnoughCoinMessage] = useState(false);
  
  const keypadRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [0]
  ];

  const handleProductSelection = () => {
    if (balance <= 0) {
      // Show message if no coins inserted
      setNoCoinMessage(true);
      // Hide message after 3 seconds
      setTimeout(() => setNoCoinMessage(false), 3000);
    } else if (productNumberInput && getProductPrice) {
      // Check if we have enough balance for this product
      const productPrice = getProductPrice(productNumberInput);
      
      if (productPrice && productPrice > balance) {
        // Show message if not enough balance
        setNotEnoughCoinMessage(true);
        // Hide message after 3 seconds
        setTimeout(() => setNotEnoughCoinMessage(false), 3000);
      } else {
        // Only call handleKeypadOk if we have enough balance
        handleKeypadOk();
      }
    } else {
      // If no product selected or can't check price, proceed
      handleKeypadOk();
    }
  };

  return (
    <div className={`vending-keypad ${canSelectProduct ? '' : 'disabled'}`}>
      <div className="vending-keypad-input bg-dark">
        {productNumberInput || <span>Numéro du produit</span>}
      </div>

      {/* Pop-up message */}
      {noCoinMessage && (
        <div className="alert alert-warning keypad-warning-popup w-100">
          Veuillez insérer des pièces avant de sélectionner un produit.
        </div>
      )}

      {/* Pop-up message */}
      {notEnoughCoinMessage && (
        <div className="alert alert-warning keypad-warning-popup w-100">
          Vous n'avez pas assez de piéces.
        </div>
      )}

      <div className="keypad-container">
        {/* Left side: Number grid */}
        <div className="keypad-numpad">
          {keypadRows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`keypad-row ${rowIndex === 3 ? 'last-row' : ''}`}
            >
              {row.map((num) => (
                <div
                  key={num}
                  className="vending-key"
                  onClick={() => handleKeypadPress(num)}
                >
                  {num}
                </div>
              ))}
              {rowIndex === 3 && (
                <div
                  className="vending-key clear"
                  onClick={handleKeypadClear}
                >
                  C
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Action buttons */}
        <div className="keypad-actions">
          <button className="btn btn-success action-btn add-btn" onClick={handleProductSelection}>
            Ajouter
          </button>

          <button
            className="btn btn-primary action-btn confirm-btn text-white"
            onClick={handleConfirmPurchase}
            disabled={cart.length === 0}
          >
            Confirmer
          </button>
          <button className="btn btn-danger action-btn cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn btn-secondary action-btn reset-btn" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}