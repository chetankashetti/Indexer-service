const pool = require('./database');

// Function to store a block in the blocks table
async function storeBlock(block) {
  const insertBlockQuery = `
  INSERT INTO blocks(difficulty, extraData, gasLimit, gasUsed, blockHash, miner, mixHash, nonce, number, parentHash,
     receiptsRoot, sha3Uncles, size, stateRoot, timestamp, totalDifficulty, transactionsRoot, uncles
  ) VALUES (${block.difficulty}, '${block.extraData}', ${block.gasLimit}, ${block.gasUsed}, '${block.hash}',
    '${block.miner}', '${block.mixHash}', '${block.nonce}', ${block.number}, '${block.parentHash}', '${block.receiptsRoot}',
    '${block.sha3Uncles}', ${block.size}, '${block.stateRoot}', ${block.timestamp}, ${block.totalDifficulty}, '${block.transactionsRoot}',
    '${block.uncles}' 
  );
`;

  let [result] = await pool.query(insertBlockQuery);
  console.log(`Block ${block.number} stored`)
  return result.insertId
}

// Function to store transactions in the transaction table
async function storeTransaction(block, blockId) {
  for (let i = 0; i < block.transactions.length; i++) {
    const transaction = block.transactions[i];
    const insertTransactionQuery = `INSERT INTO transactions(blockHash, blockNumber, fromAddress, gas, gasPrice, transactionHash, input, nonce, toAddress, transactionIndex,
     value, blockId) VALUES ('${transaction.blockHash}', ${transaction.blockNumber}, '${transaction.from}', ${transaction.gas}, '${transaction.gasPrice}',
    '${transaction.hash}', '${transaction.input}', '${transaction.nonce}', '${transaction.to}', '${transaction.transactionIndex}', '${transaction.value}', '${blockId}'
  );
`;

    let [result] = await pool.query(insertTransactionQuery);
  }
  console.log(`Block transactions ${block.transactions.length} stored`)

}

async function storeTransactionReceipts(receipts, blockId) {
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i];
    const insertTransactionQuery = `INSERT INTO transaction_receipts(transactionHash, blockHash, blockNumber, contractAddress, cumulativeGasUsed, fromAddress, gasUsed, status, toAddress, transactionIndex
     ) VALUES ('${receipt.transactionHash}', '${receipt.blockHash}', ${receipt.blockNumber}, '${receipt.contractAddress}', ${receipt.cumulativeGasUsed}, '${receipt.from}',
    '${receipt.gasUsed}', '${receipt.status}', '${receipt.to}', '${receipt.transactionIndex}' 
  );
`;

    let [result] = await pool.query(insertTransactionQuery);
    const receipt_id = result.insertId;

    for(let j=0; j < receipt.logs.length;j++){
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
      const insertLogQuery = `INSERT INTO transaction_logs(transactionHash, blockNumber, logIndex, address, topic0, topic1, topic2, topic3, data, transactionIndex, transaction_receipt_id
        ) VALUES ('${log.transactionHash}', ${log.blockNumber}, '${log.logIndex}', '${log.address}', '${topic0}', '${topic1}', '${topic2}', '${topic3}',
       '${log.data}', ${log.transactionIndex}, ${receipt_id} );
   `;
   
       let [logres] = await pool.query(insertLogQuery);
    }
  }
  console.log(`Block receipts ${receipts.length} stored`)

}

module.exports = { storeBlock, storeTransaction, storeTransactionReceipts }; 