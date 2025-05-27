class ProductInventory {
  constructor() {
    this.products = [
      // id, name, price, glb, position, scale
      new (require('../models/Product'))(1, 'Soda', 3.5, 'soda.glb',      { x: -0.65, y: 1.5, z: -5 }, { x: 0.06, y: 0.06, z: 0.06 }),
      new (require('../models/Product'))(2, 'Chips', 2.0, 'chips.glb',    { x: -0.20, y: 1.5, z: -5 }, { x: 0.01, y: 0.01, z: 0.01 }),
      new (require('../models/Product'))(3, 'Chewing gum', 1.5, 'chewing_gum.glb', { x: 0.25, y: 1.5, z: -5 }, { x: 6, y: 6, z: 6 }),
      new (require('../models/Product'))(4, 'Orange Juice', 4.0, 'orange_juice.glb', { x: -0.60, y: 1.0, z: -5 }, { x: 0.8, y: 0.8, z: 0.8 }),
      new (require('../models/Product'))(5, 'Candy', 1.0, 'coffee_crisp.glb', { x: -0.20, y: 1.0, z: -5 }, { x: 0.03, y: 0.03, z: 0.03 }),
      new (require('../models/Product'))(6, 'Chewing Gum', 0.5, 'mars.glb', { x: 0.25, y: 1.0, z: -5 }, { x: 1.7, y: 1.7, z: 1.7 }),
      new (require('../models/Product'))(7, 'Cookie', 1.2, 'wafer.glb',   { x: -0.65, y: 0.5, z: -5 }, { x: 0.01, y: 0.01, z: 0.01 }),
      new (require('../models/Product'))(8, 'Watter Bottle', 1.8, 'water_bottle.glb',     { x: -0.20, y: 0.5, z: -5 }, { x: 0.0005, y: 0.0005, z: 0.0005 }),
      new (require('../models/Product'))(9, 'Kinder bar', 2.5, 'kinder_bar.glb',    { x: 0.25, y: 0.5, z: -5 }, { x: 0.1, y: 0.1, z: 0.1 }),
      new (require('../models/Product'))(10, 'Coffee', 3.0, 'coffee.glb',  { x: -0.65, y: 0.0, z: -5 }, { x: 0.05, y: 0.05, z: 0.05 }),
      new (require('../models/Product'))(11, 'Energy Drink', 4.5, 'red_bull.glb', { x: -0.20, y: 0.0, z: -5 }, { x: 1.5, y: 1.1, z: 1.5 }),
      new (require('../models/Product'))(12, 'Milk', 2.2, 'milk.glb',      { x: 0.25, y: 0.0, z: -5 }, { x: 1.2, y: 0.6, z: 1.2 })
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