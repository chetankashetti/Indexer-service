const mysql = require('mysql');
const connection = require('./database');
require('./scripts');
const node = require('./eth_client.js');
const save = require('./data.js');


async function main() {
    chainId = getChainId()
    let block = 8004867;
    while (true) {
        const blockWithTxs = await node.getBlockWithRetries(block, 5);
        if (blockWithTxs == null) {
            continue
        }
        const blockId = await save.storeBlock(blockWithTxs);
        const receipts = await node.getTransactionReceiptsWithRetries(blockWithTxs);
        let res = await save.storeTransaction(blockWithTxs, blockId);
        let ress = await save.storeTransactionReceipts(receipts, blockId);
        block++;
    }

}

async function getChainId() {
    // Create a new instance of Web3
    const web3 = new Web3('<YOUR_PROVIDER_URL>');
  
    try {
      // Get the Chain ID
      const chainId = await web3.eth.getChainId();
      console.log('Chain ID:', chainId);
    } catch (error) {
      console.error('Error:', error);
    }
  }

main();


