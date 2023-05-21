const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const node = require('./eth_client.js');
const sc = require('./scripts.js');
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

  app.get('/api/v1/transaction/:tx_hash', async (req, res) => {
    try {
      const txHash = req.params.tx_hash;
      if (!txHash) {
        return res.status(400).json({ error: 'No txHash provided' });
      }
      const transactions = await query.getTransactionByHash(txHash);
      res.json(transactions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      res.status(500).json({ error: 'An error occurred' });
    }});

  app.get('/health', async (req, res) => {
      res.status(200).json();
  });
  
async function main() {
    const chainId = await node.getChainId();
    let fromBlock = process.env.FROM_BLOCK;
    let toBlock = process.env.TO_BLOCK;
    let indexFrom = await query.getLastIndexedBlock(chainId);
    if (!indexFrom) {
      await save.startIndexingFromBlock(fromBlock, chainId);
      indexFrom = fromBlock;
    }
    while (indexFrom < toBlock) {
        const blockWithTxs = await node.getBlockWithRetries(indexFrom, 5);
        if (blockWithTxs == null) {
            continue
        }
        const blockId = await save.storeBlock(blockWithTxs, chainId);
        const receipts = await node.getTransactionReceiptsWithRetries(blockWithTxs);
        let res = await save.storeTransaction(blockWithTxs, blockId, chainId);
        let ress = await save.storeTransactionReceipts(receipts, chainId);
        await save.updateBlockIndexed(indexFrom, chainId)
        indexFrom++;
    }
}

main();


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});