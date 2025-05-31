class VendingMachineService {
  constructor() {
    this.cart = new (require('./CartService'))();
    this.paymentProcessor = new (require('./PaymentService'))();
    this.productInventory = new (require('./InventoryService'))();
    this.dispenser = new (require('./DispenserService'))();
    this.totalInserted = 0; 
  }

  insertMoney(amount) {
    this.paymentProcessor.insertMoney(amount);
    this.totalInserted += amount; 
  }

  selectProduct(productId) {
    if (!this.productInventory.isProductAvailable(productId)) {
      throw new Error('Product not available');
    }

    const product = this.productInventory.getAvailableProducts()
      .find(p => p.id === productId);

    if (this.paymentProcessor.getBalance() >= product.price) {
      this.cart.addProduct(product);
      this.paymentProcessor.balance -= product.price;
    } else {
      throw new Error('Insufficient funds');
    }
  }

  confirmTransaction() {
    const change = this.paymentProcessor.calculateChange(0); 
    
    this.cart.products.forEach(product => {
      this.dispenser.dispenseProduct(product);
    });

    if (Object.keys(change).length > 0) {
      this.dispenser.dispenseChange(change);
    }

    this.cart.emptyCart();
    this.totalInserted = 0; 
    return change; 
  }

  cancelTransaction() {
    const refundAmount = this.totalInserted;
    this.paymentProcessor.balance = refundAmount;
    const change = this.paymentProcessor.calculateChange(0);

    if (Object.keys(change).length > 0) {
      this.dispenser.dispenseChange(change);
    }

    this.cart.emptyCart();
    this.totalInserted = 0;
    return change;
  }

  resetMachine() {
    this.paymentProcessor.resetBalance();
    this.cart.emptyCart();
    this.totalInserted = 0;
    this.dispenser.resetDispenser();
    console.log('Vending machine reset.');
  }
}

module.exports = VendingMachineService;