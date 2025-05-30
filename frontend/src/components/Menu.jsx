import React from 'react';
import CoinPanel from './CoinPanel';
import Keypad from './Keypad';
 

export default function Menu({
  insertedCoins,
  animatingCoin,
  setAnimatingCoin,
  setInsertedCoins,
  onInsertCoin,
  coins,
  productNumberInput,
  handleKeypadPress,
  handleKeypadOk,
  handleKeypadClear,
  balance,
  onCancel,
  handleConfirmPurchase,
  handleReset,
  cart,
  change
}) {
  return (
    <div className="vending-panel rounded  p-2">
      {/* Use CoinPanel component */}
      <CoinPanel
        insertedCoins={insertedCoins}
        animatingCoin={animatingCoin}
        setAnimatingCoin={setAnimatingCoin}
        setInsertedCoins={setInsertedCoins}
        onInsertCoin={onInsertCoin}
        coins={coins}
      />

      {/* Cart and Keypad side by side */}
      <div className="vending-cart-keypad">
        {/* Use Keypad component */}
        <Keypad
          productNumberInput={productNumberInput}
          handleKeypadPress={handleKeypadPress}
          handleKeypadOk={handleKeypadOk}
          handleKeypadClear={handleKeypadClear}
          canSelectProduct={true} // Always enable keypad
          onCancel={onCancel}
          handleConfirmPurchase={handleConfirmPurchase}
          handleReset={handleReset} // Pass handleReset here
          cart={cart}
          balance={balance} // Pass balance here
        /> 
      </div>
     
              <div className="vending-change text-white bg-dark p-2 rounded">
        <span>Rendu :&nbsp;</span>
        {change && Object.entries(change).length > 0 ? (
          Object.entries(change).map(([coin, qty]) => {
            let coinImg;
            if (coin === '10' || coin === '10.0') coinImg = coins[0].img;
            else if (coin === '5' || coin === '5.0') coinImg = coins[1].img;
            else if (coin === '2' || coin === '2.0') coinImg = coins[2].img;
            else if (coin === '1' || coin === '1.0') coinImg = coins[3].img;
            else if (coin === '0.5') coinImg = coins[4].img;
            else coinImg = null;
            return (
              <span key={coin}>
                {qty} x
                {coinImg && <img src={coinImg} alt={`${coin} MAD`} />}
                {!coinImg && <span>{coin} MAD</span>}
              </span>
            );
          })
        ) : (
          <span>Aucun</span>
        )}
      </div>
    
    
    </div>
  );
}