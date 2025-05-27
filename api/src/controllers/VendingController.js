const VendingMachine = require('../services/VendingMachineService');
const vm = new VendingMachine();


exports.insertCoin = (req, res) => {
  try {
    const { amount } = req.body;
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
    vm.cancelTransaction();
    res.json({ 
      success: true,
      message: 'Transaction canceled' 
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
    res.json({ 
      success: true,
      message: 'Products dispensed successfully',
      change // Return the optimized coins
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};