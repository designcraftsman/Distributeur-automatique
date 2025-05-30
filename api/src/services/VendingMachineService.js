class VendingMachineService {
  constructor() {
    this.cart = new (require('./CartService'))();
    this.paymentProcessor = new (require('./PaymentService'))();
    this.productInventory = new (require('./InventoryService'))();
    this.dispenser = new (require('./DispenserService'))();
    this.totalInserted = 0; // Track total inserted amount
  }

  insertMoney(amount) {
    this.paymentProcessor.insertMoney(amount);
    this.totalInserted += amount; // Track total inserted
  }

  selectProduct(productId) {
    if (!this.productInventory.isProductAvailable(productId)) {
      throw new Error('Product not available');
    }

    const product = this.productInventory.getAvailableProducts()
      .find(p => p.id === productId);

    if (this.paymentProcessor.getBalance() >= product.price) {
      this.cart.addProduct(product);
      // Deduct the product price from the balance immediately
      this.paymentProcessor.balance -= product.price;
    } else {
      throw new Error('Insufficient funds');
    }
  }

  confirmTransaction() {
    const change = this.paymentProcessor.calculateChange(0); // Already deducted, so pass 0
    
    this.cart.products.forEach(product => {
      this.dispenser.dispenseProduct(product);
    });

    if (Object.keys(change).length > 0) {
      this.dispenser.dispenseChange(change);
    }

    this.cart.emptyCart();
    this.totalInserted = 0; // Reset total inserted after successful transaction
    return change; // Return the change
  }

  cancelTransaction() {
    // Calculate total spent on products in cart
    const cartTotal = this.cart.getTotalAmount();
    // Calculate refund amount (original inserted amount)
    const refundAmount = this.totalInserted;
    
    // Reset the balance to the original inserted amount
    this.paymentProcessor.balance = refundAmount;
    
    // Now calculate change based on the original amount
    const change = this.paymentProcessor.calculateChange(0);
    
    if (Object.keys(change).length > 0) {
      this.dispenser.dispenseChange(change);
    }
    
    this.cart.emptyCart();
    this.totalInserted = 0; // Reset total inserted after cancellation
    return change; // Return the change to display in UI
  }

  // Reset method
  resetMachine() {
    // Clear all money in the machine without returning change
    this.paymentProcessor.resetBalance();
    // Empty the cart
    this.cart.emptyCart();
    // Reset total inserted
    this.totalInserted = 0;
    // Reset product inventory if needed
    // this.productInventory.resetInventory();
  }
}

module.exports = VendingMachineService;