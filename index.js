const Web3 = require('web3');
require('./scripts');
const node = require('./eth_client.js');
const save = require('./data.js');


async function main() {
    let chainId = await node.getChainId();
    console.log(chainId)
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


main();


