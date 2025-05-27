const AcceptedCoins = {
  HALF_MAD: 0.5,
  ONE_MAD: 1,
  TWO_MAD: 2,
  FIVE_MAD: 5,
  TEN_MAD: 10
};

class PaymentProcessor {
  constructor() {
    this.balance = 0;
  }

  insertMoney(amount) {
    if (!Object.values(AcceptedCoins).includes(amount)) {
      throw new Error('Invalid coin');
    }
    this.balance += amount;
  }

  calculateChange(amountDue) {
    const change = this.balance - amountDue;
    this.balance = 0;
    return this._optimizeChange(change);
  }

  _optimizeChange(amount) {
    const coins = Object.values(AcceptedCoins).sort((a, b) => b - a);
    const change = {};
    let remaining = amount;

    coins.forEach(coin => {
      const count = Math.floor(remaining / coin);
      if (count > 0) {
        change[coin] = count;
        remaining = parseFloat((remaining - (coin * count)).toFixed(2));
      }
    });

    return change;
  }

  getBalance() {
    return this.balance;
  }

  resetBalance() {
    this.balance = 0;
  }
}

module.exports = PaymentProcessor;