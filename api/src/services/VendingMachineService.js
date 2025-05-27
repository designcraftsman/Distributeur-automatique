class VendingMachineService {
  constructor() {
    this.cart = new (require('./CartService'))();
    this.paymentProcessor = new (require('./PaymentService'))();
    this.productInventory = new (require('./InventoryService'))();
    this.dispenser = new (require('./DispenserService'))();
  }

  insertMoney(amount) {
    this.paymentProcessor.insertMoney(amount);
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
    const total = this.cart.getTotalAmount();
    const change = this.paymentProcessor.calculateChange(0); // Already deducted, so pass 0

    this.cart.products.forEach(product => {
      this.dispenser.dispenseProduct(product);
    });

    if (Object.keys(change).length > 0) {
      this.dispenser.dispenseChange(change);
    }

    this.cart.emptyCart();
    return change; // Return the change
  }

  cancelTransaction() {
    const refund = this.paymentProcessor.getBalance();
    if (refund > 0) {
      this.dispenser.dispenseChange(
        this.paymentProcessor.calculateChange(0)
      );
    }
    this.cart.emptyCart();
  }
}

module.exports = VendingMachineService;