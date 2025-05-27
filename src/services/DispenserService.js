class Dispenser {
  dispenseProduct(product) {
    console.log(`Dispensing: ${product.name}`);

  }

  dispenseChange(change) {
    console.log('Returning change:', change);
  }
}

module.exports = Dispenser;