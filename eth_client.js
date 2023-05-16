const Web3 = require('web3');

// create a web3 instance
const web3 = new Web3(process.env.NODE_ENDPOINT);

async function getChainId() {  
    try {
      // Get the Chain ID
      const chainId = await web3.eth.getChainId();
      console.log('Chain ID:', chainId);
      return chainId;
    } catch (error) {
      console.error('Error:', error);
    }
    return null;
    
  }


// Define a function to retrieve a block by block number with retries in case of failure
async function getBlockWithRetries(blockNumber, maxRetries) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const block = await web3.eth.getBlock(blockNumber, true);
            return block;
        } catch (error) {
            console.error(`Error retrieving block ${blockNumber}. Retrying...`);
            retries++;
        }
    }
    console.error(`Max retries reached for block ${blockNumber}. Aborting...`);
    return null;
}


async function getTransactionReceiptsWithRetries(block) {
    let receipts = [];
    let retries = 0; 
    let maxRetries = 3;
    for (let i = 0; i < block.transactions.length; i++) {
            try {
                let hash = block.transactions[i].hash;
                const receipt = await web3.eth.getTransactionReceipt(hash);
                if (receipt != null) {
                    receipts.push(receipt);
                }
                console.log(`fetched ${hash}`);
            } catch (error) {
                console.error(`Error retrieving receipt ${block.transactions[i].transactionHash}. Retrying...`);
            }
    }
    console.log(receipts);
    return receipts;
}


module.exports = { getBlockWithRetries, getTransactionReceiptsWithRetries, getChainId };
