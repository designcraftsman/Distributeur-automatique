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
    // Calculate the change before cancelling
    const refund = vm.paymentProcessor.getBalance();
    let change = {};
    if (refund > 0) {
      change = vm.paymentProcessor.calculateChange(0);
    }
    vm.cancelTransaction();
    console.log('Transaction canceled');
    res.json({ 
      success: true,
      message: 'Transaction canceled',
      change, 
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
    const change = vm.confirmTransaction();
    console.log('Products dispensed, change:', change);
    res.json({ 
      success: true,
      message: 'Products dispensed successfully',
      change,
      balance: vm.paymentProcessor.getBalance()
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};