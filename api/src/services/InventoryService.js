class ProductInventory {
  constructor() {
    this.products = [
      // id, name, price, glb, position, scale
      new (require('../models/Product'))(1, 'Soda', 3.5, 'soda.glb',      { x: -0.65, y: 1.5, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(2, 'Chips', 2.0, 'soda.glb',    { x: -0.20, y: 1.5, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(3, 'Water Bottle', 1.5, 'soda.glb', { x: 0.25, y: 1.5, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(4, 'Orange Juice', 4.0, 'soda.glb', { x: -0.65, y: 1.0, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(5, 'Candy Bar', 1.0, 'soda.glb', { x: -0.20, y: 1.0, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(6, 'Chewing Gum', 0.5, 'soda.glb', { x: 0.25, y: 1.0, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(7, 'Cookie', 1.2, 'soda.glb',   { x: -0.65, y: 0.5, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(8, 'Wafer', 1.8, 'soda.glb',     { x: -0.20, y: 0.5, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(9, 'Iced Tea', 2.5, 'soda.glb',    { x: 0.25, y: 0.5, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(10, 'Coffee', 3.0, 'soda.glb',  { x: -0.65, y: 0.0, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(11, 'Energy Drink', 4.5, 'soda.glb', { x: -0.20, y: 0.0, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 }),
      new (require('../models/Product'))(12, 'Milk', 2.2, 'soda.glb',      { x: 0.25, y: 0.0, z: -5 }, { x: 0.07, y: 0.07, z: 0.07 })
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