import React from 'react';

export default function CoinPanel({
  insertedCoins,
  animatingCoin,
  setAnimatingCoin,
  setInsertedCoins,
  onInsertCoin,
  coins
}) {
  return (
    <div className='coin-panel' style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {coins.map((coinType, coinIdx) => (
        <div key={coinType.value} className='d-flex justify-content-evenly' style={{ marginBottom: 4 }}>
          {Array.from({ length: 5 }).map((_, coinCopyIdx) => {
            const uniqueKey = `${coinIdx}-${coinCopyIdx}`;
            if (insertedCoins.includes(uniqueKey) && animatingCoin !== uniqueKey) return null;

            // Calculate dynamic translate values based on coin position
            const translateX = -200 - coinCopyIdx * 80; // Adjust X translation based on coinCopyIdx
            const translateY = 250 - coinIdx * 20; // Adjust Y translation based on coinIdx

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
                      ? `translate(${translateX}px, ${translateY}px) scale(0.7)`
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
  );
}