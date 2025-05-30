const VendingMachine = require('../services/VendingMachineService');
const vm = new VendingMachine();


exports.insertCoin = (req, res) => {
  try {
    const { amount } = req.body;
    console.log(`Inserting coin: ${amount}`);
    vm.insertMoney(amount);
    res.json({ 
      success: true,
      balance: vm.paymentProcessor.getBalance() 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.getBalance = (req, res) => {
  res.json({ balance: vm.paymentProcessor.getBalance() });
};

exports.cancelTransaction = (req, res) => {
  try {
    // Let the service method handle the change calculation and return it
    const change = vm.cancelTransaction();
    console.log('Transaction canceled, change:', change);
    
    res.json({ 
      success: true,
      message: 'Transaction canceled',
      change: change, // Use the change returned from cancelTransaction
      cart: [] 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};


exports.getAvailableProducts = (req, res) => {
  try {
    const products = vm.productInventory.getAvailableProducts();
    const balance = vm.paymentProcessor.getBalance();
    
    const enrichedProducts = products.map(product => ({
      ...product,
      canPurchase: balance >= product.price
    }));

    res.json({ 
      success: true,
      products: enrichedProducts 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products' 
    });
  }
};

exports.selectProduct = (req, res) => {
  try {
    const { productId } = req.body;
    console.log(`Selecting product: ${productId}`);
    vm.selectProduct(productId);
    res.json({ 
      success: true,
      cart: vm.cart.products,
      balance: vm.paymentProcessor.getBalance()
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.confirmPurchase = (req, res) => {
  try {
    const dispensedProducts = vm.cart.products; // Get the products to dispense
    const change = vm.confirmTransaction();
    console.log('Products dispensed, change:', change, 'products:', dispensedProducts);
    res.json({ 
      success: true,
      message: 'Products dispensed successfully',
      change,
      dispensedProducts, // Include dispensed products in the response
      balance: vm.paymentProcessor.getBalance()
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.resetMachine = (req, res) => {
  try {
    // Reset the machine state without returning change
    vm.resetMachine();
    console.log('Machine reset');
    res.json({ 
      success: true,
      message: 'Machine reset successfully',
      balance: 0,
      cart: [],
      change: {} // No change to return
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};