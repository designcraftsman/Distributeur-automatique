class Cart {
  constructor() {
    this.products = [];
  }

  addProduct(product) {
    this.products.push(product);
  }

  getTotalAmount() {
    return this.products.reduce((total, product) => total + product.price, 0);
  }

  emptyCart() {
    this.products = [];
  }
}

module.exports = Cart;