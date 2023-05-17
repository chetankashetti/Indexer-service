const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const node = require('./eth_client.js');
const save = require('./data.js');
const query = require('./query.js');

app.get('/api/v1/transactions', async (req, res) => {
    try {
      const addresses = req.query.addresses;
      if (!addresses) {
        return res.status(400).json({ error: 'No addresses provided' });
      }
      const wallets = addresses.split(",")
      if (wallets.length === 0) {
        return res.status(400).json({ error: 'No addresses provided' });
      }
      const transactions = await query.getTransactionsByAddresses(wallets);
      res.json(transactions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
async function main() {
    const chainId = await node.getChainId();
    let fromBlock = 1;
    let toBlock = 8004867;

    while (fromBlock < toBlock) {
        const blockWithTxs = await node.getBlockWithRetries(fromBlock, 5);
        if (blockWithTxs == null) {
            continue
        }
        const blockId = await save.storeBlock(blockWithTxs, chainId);
        const receipts = await node.getTransactionReceiptsWithRetries(blockWithTxs);
        let res = await save.storeTransaction(blockWithTxs, blockId, chainId);
        let ress = await save.storeTransactionReceipts(receipts, chainId);
        fromBlock++;
    }
}

main();


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});