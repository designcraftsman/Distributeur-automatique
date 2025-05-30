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
  balance // Add balance prop to check if coins are inserted
}) {
  const [showMessage, setShowMessage] = useState(false);
  
  const keypadRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [0]
  ];

  const handleProductSelection = () => {
    if (balance <= 0) {
      // Show message if no coins inserted
      setShowMessage(true);
      // Hide message after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      // Only call handleKeypadOk if we have balance
      handleKeypadOk();
    }
  };

  return (
    <div className={`vending-keypad ${canSelectProduct ? '' : 'disabled'}`}>
      <div className="vending-keypad-input bg-dark">
        {productNumberInput || <span>Numéro du produit</span>}
      </div>

      {/* Pop-up message */}
      {showMessage && (
        <div className="alert alert-warning position-absolute" 
             style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100 }}>
          Veuillez insérer des pièces avant de sélectionner un produit.
        </div>
      )}

      <div className="d-flex flex-row justify-content-between gap-2 w-100">
        {/* Left side: Number grid */}
        <div className="d-flex flex-column w-100">
          {keypadRows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="w-100"
              style={{
                display: 'flex',
                justifyContent: rowIndex === 3 ? 'center' : 'space-between'
              }}
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

        {/* Right side: Add and Cancel buttons */}
        <div className="d-flex flex-column justify-content-start align-items-center w-100">
          <button className="btn btn-success w-100 m-2 fw-bold" onClick={handleProductSelection}>
            Ajouter
          </button>

          <button
            className="btn btn-primary w-100 m-1 text-white fw-bold"
            onClick={handleConfirmPurchase}
            disabled={cart.length === 0}
          >
            Confirmer
          </button>
          <button className="btn btn-danger w-100 m-1 fw-bold" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn btn-secondary w-100 m-1 fw-bold" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}