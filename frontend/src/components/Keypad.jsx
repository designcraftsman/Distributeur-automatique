import React from 'react';

export default function Keypad({
  productNumberInput,
  handleKeypadPress,
  handleKeypadOk,
  handleKeypadClear,
  canSelectProduct
}) {
  // Arrange keypad in a 3x4 grid layout
  const keypadRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [0]
  ];
  
  return (
    <div
      className="vending-keypad"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#222",
        borderRadius: 8,
        padding: 10,
        minWidth: 280,
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
      
      <div style={{ display: "flex" }}>
        {/* Left side: Number grid (3x4) */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          width: "180px",
        }}>
          {keypadRows.map((row, rowIndex) => (
            <div 
              key={`row-${rowIndex}`} 
              style={{ 
                display: "flex", 
                justifyContent: rowIndex === 3 ? "center" : "space-between"
              }}
            >
              {row.map((num) => (
                <div
                  key={num}
                  className="vending-key"
                  style={{
                    width: 50,
                    height: 50,
                    margin: 3,
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
              {rowIndex === 3 && (
                <div
                  className="vending-key"
                  style={{
                    width: 50,
                    height: 50,
                    margin: 3,
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
              )}
            </div>
          ))}
        </div>
        
        {/* Right side: Add and Cancel buttons */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center", 
          flex: 1,
          paddingLeft: 8,
        }}>
          <div
            className="btn btn-success"
            style={{
              width: "90%",
              height: 100,
              margin: "4px 0",
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
          
          <div
            className="btn btn-danger"
            style={{
              width: "90%",
              height: 100,
              margin: "4px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              fontSize: "1.1rem",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={handleKeypadClear}
          >
            Annuler
          </div>
        </div>
      </div>
    </div>
  );
}