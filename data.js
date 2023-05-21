const pool = require('./database');
const query = require('./query');

// Function to store a block in the blocks table
async function storeBlock(block, chainId) {
  const insertBlockQuery = `
  INSERT INTO blocks(difficulty, extraData, gasLimit, gasUsed, blockHash, miner, mixHash, nonce, number, parentHash,
     receiptsRoot, sha3Uncles, size, stateRoot, timestamp, totalDifficulty, transactionsRoot, uncles, chainId
  ) VALUES (${block.difficulty}, '${block.extraData}', ${block.gasLimit}, ${block.gasUsed}, '${block.hash}',
    '${block.miner}', '${block.mixHash}', '${block.nonce}', ${block.number}, '${block.parentHash}', '${block.receiptsRoot}',
    '${block.sha3Uncles}', ${block.size}, '${block.stateRoot}', ${block.timestamp}, ${block.totalDifficulty}, '${block.transactionsRoot}',
    '${block.uncles}', ${chainId} 
  );
`;
  try {
    const [result] = await pool.query(insertBlockQuery);
    console.log(`Block ${block.number} stored`);
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle unique key constraint violation
      console.error(`Block ${block.number} already exists`);
      // Perform necessary actions or error handling
      return query.getBlockIdByNumber(block.number);
    } else {
      // Handle other errors
      console.error('Error storing block:', error);
      // Perform necessary actions or error handling
    }
  }
}

// Function to store transactions in the transaction table
async function storeTransaction(block, blockId, chainId) {
  for (let i = 0; i < block.transactions.length; i++) {
    const transaction = block.transactions[i];
    const insertTransactionQuery = `INSERT INTO transactions(blockHash, blockNumber, fromAddress, gas, gasPrice, transactionHash, input, nonce, toAddress, transactionIndex,
     value, blockId, chainId) VALUES ('${transaction.blockHash}', ${transaction.blockNumber}, '${transaction.from}', ${transaction.gas}, '${transaction.gasPrice}',
    '${transaction.hash}', '${transaction.input}', '${transaction.nonce}', '${transaction.to}', '${transaction.transactionIndex}', '${transaction.value}', '${blockId}', ${chainId}
  );
`;

    let [result] = await pool.query(insertTransactionQuery);
  }
  console.log(`Block transactions ${block.transactions.length} stored`)

}

async function storeTransactionReceipts(receipts, chainId) {
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i];
    const insertTransactionQuery = `INSERT INTO transaction_receipts(transactionHash, blockHash, blockNumber, contractAddress, cumulativeGasUsed, fromAddress, gasUsed, status, toAddress, transactionIndex, chainId
     ) VALUES ('${receipt.transactionHash}', '${receipt.blockHash}', ${receipt.blockNumber}, '${receipt.contractAddress}', ${receipt.cumulativeGasUsed}, '${receipt.from}',
    '${receipt.gasUsed}', '${receipt.status}', '${receipt.to}', '${receipt.transactionIndex}', ${chainId}
  );
`;

    let [result] = await pool.query(insertTransactionQuery);
    const receipt_id = result.insertId;

    for (let j = 0; j < receipt.logs.length; j++) {
      const log = receipt.logs[j];
      let topic0 = "", topic1 = "", topic2 = "", topic3 = "";
      if (log.topics.length > 0) {
        topic0 = log.topics[0]
      }
      if (log.topics.length > 1) {
        topic1 = log.topics[1]
      }
      if (log.topics.length > 2) {
        topic2 = log.topics[2]
      }
      if (log.topics.length > 3) {
        topic3 = log.topics[3]
      }
      const insertLogQuery = `INSERT INTO transaction_logs(transactionHash, blockNumber, logIndex, address, topic0, topic1, topic2, topic3, data, transactionIndex, transaction_receipt_id, chainId
        ) VALUES ('${log.transactionHash}', ${log.blockNumber}, '${log.logIndex}', '${log.address}', '${topic0}', '${topic1}', '${topic2}', '${topic3}',
       '${log.data}', ${log.transactionIndex}, ${receipt_id}, ${chainId} );
   `;

      let [logres] = await pool.query(insertLogQuery);
    }
  }
  console.log(`Block receipts ${receipts.length} stored`)

}

async function startIndexingFromBlock(blockNumber, chainId) {
  const indexQuery = `INSERT INTO block_indexed(blockNumber, chainId) values(${blockNumber}, ${chainId});`;
  let result = await pool.query(indexQuery);
}

async function updateBlockIndexed(blockNumber, chainId) {
  const indexQuery = `update block_indexed set blockNumber=${blockNumber} where chainId=${chainId};`;
  let result = await pool.query(indexQuery);
}

module.exports = { storeBlock, storeTransaction, storeTransactionReceipts, updateBlockIndexed, startIndexingFromBlock }; 