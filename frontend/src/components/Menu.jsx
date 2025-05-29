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
    <div
      className="vending-panel mx-auto"
      style={{
        position: 'absolute',
        right: 20,
        top: 30,
        zIndex: 10
      }}
    >
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
      <div
        className="fs-6"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 4,
          marginTop: 16,
          width: 480,
          maxWidth: '100%'
        }}
      >
        {/* Use Keypad component */}
        <Keypad
          productNumberInput={productNumberInput}
          handleKeypadPress={handleKeypadPress}
          handleKeypadOk={handleKeypadOk}
          handleKeypadClear={handleKeypadClear}
          canSelectProduct={balance > 0} // Enable keypad if any balance available
        />
      </div>

      <div className="d-flex gap-1 mt-3 fw-bold">
        <button className="btn-primary btn col-4 text-white" onClick={onCancel}>
          Annuler
        </button>
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
        <div className="d-flex align-items-center flex-wrap mt-3">
          <span style={{ marginRight: 8 }}>Change:&nbsp;</span>
          {Object.entries(change).map(([coin, qty]) => {
            let coinImg;
            if (coin === '10' || coin === '10.0') coinImg = coins[0].img;
            else if (coin === '5' || coin === '5.0') coinImg = coins[1].img;
            else if (coin === '2' || coin === '2.0') coinImg = coins[2].img;
            else if (coin === '1' || coin === '1.0') coinImg = coins[3].img;
            else if (coin === '0.5') coinImg = coins[4].img;
            else coinImg = null;
            return (
              <span
                key={coin}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginRight: 14
                }}
              >
                {qty} x
                {coinImg && (
                  <img
                    src={coinImg}
                    alt={`${coin} MAD`}
                    style={{
                      width: 32,
                      height: 32,
                      margin: '0 4px',
                      verticalAlign: 'middle'
                    }}
                  />
                )}
                {!coinImg && <span style={{ margin: '0 4px' }}>{coin} MAD</span>}
              </span>
            );
          })}
        </div>
      )}
      {change && typeof change !== 'object' && (
        <div style={{ color: 'white', marginTop: 10 }}>Change: {change} MAD</div>
      )}
    </div>
  );
}