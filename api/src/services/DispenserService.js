class Dispenser {
  constructor() {
    this.dispensedProducts = [];
    this.dispensedChange = {};
  }

  dispenseProduct(product) {
    if (!product) {
      console.error('Error: No product to dispense.');
      return;
    }
    this.dispensedProducts.push(product);
  }

  dispenseChange(change) {
    if (!change || Object.keys(change).length === 0) {
      console.error('Error: No change to return.');
      return;
    }
    this.dispensedChange = change;
  }

  getDispensedProducts() {
    return this.dispensedProducts;
  }

  getDispensedChange() {
    return this.dispensedChange;
  }

  resetDispenser() {
    this.dispensedProducts = [];
    this.dispensedChange = {};
  }
}

module.exports = Dispenser;