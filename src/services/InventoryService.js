class ProductInventory {
  constructor() {
    this.products = [
      new (require('../models/Product'))('soda', 'Soda', 3.5),
      new (require('../models/Product'))('chips', 'Chips', 2.0)
    ];
  }

  getAvailableProducts() {
    return this.products;
  }

  isProductAvailable(id) {
    return this.products.some(product => product.id === id);
  }
}

module.exports = ProductInventory;