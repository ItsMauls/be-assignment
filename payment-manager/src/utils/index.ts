export function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
      console.log('Transaction processing started for:', transaction);
      setTimeout(() => {
        console.log('Transaction processed for:', transaction);
        resolve(transaction);
      }, 30000);
    });
  }