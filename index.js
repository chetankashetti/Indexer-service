require('./scripts');
const node = require('./eth_client.js');
const save = require('./data.js');

async function main() {
    const chainId = await node.getChainId();
    let fromBlock = 8001867;
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