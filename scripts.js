const pool = require('./database');


const createBlocksTableQuery = `
  CREATE TABLE IF NOT EXISTS blocks (
    id INT NOT NULL AUTO_INCREMENT,
    difficulty BIGINT,
    extraData VARCHAR(255),
    gasLimit BIGINT,
    gasUsed BIGINT,
    blockHash VARCHAR(255),
    miner VARCHAR(255),
    mixHash VARCHAR(255),
    nonce VARCHAR(255),
    number BIGINT,
    parentHash VARCHAR(255),
    receiptsRoot VARCHAR(255),
    sha3Uncles VARCHAR(255),
    size BIGINT,
    stateRoot VARCHAR(255),
    timestamp BIGINT,
    totalDifficulty BIGINT,
    transactionsRoot VARCHAR(255),
    uncles VARCHAR(255),
    chainId BIGINT,
    PRIMARY KEY (id)
);`;

pool.query(createBlocksTableQuery);
console.log('Blocks table created or already exists!');

// create the transactions table if it does not exist
const createTransactionsTableQuery = `
CREATE TABLE IF NOT EXISTS transactions (
    id INT NOT NULL AUTO_INCREMENT,
    blockHash VARCHAR(255),
    blockNumber BIGINT,
    fromAddress VARCHAR(255),
    gas BIGINT,
    gasPrice VARCHAR(255),
    transactionHash VARCHAR(255),
    input LONGTEXT,
    nonce BIGINT,
    toAddress VARCHAR(255),
    transactionIndex BIGINT,
    value VARCHAR(255),
    blockId INT NOT NULL,
    chainId BIGINT,
    PRIMARY KEY (id),
    INDEX idx_transactions_hash (transactionHash),
    FOREIGN KEY (blockId) REFERENCES blocks(id)
);`;

pool.query(createTransactionsTableQuery);
console.log('Transactions table created or already exists!');

// create the transaction receipts table if it does not exist
const createTransactionReceiptsQuery = `
CREATE TABLE IF NOT EXISTS transaction_receipts (
    id INT NOT NULL AUTO_INCREMENT,
    transactionHash VARCHAR(255),
    blockHash VARCHAR(255),
    blockNumber BIGINT,
    contractAddress VARCHAR(255),
    cumulativeGasUsed BIGINT,
    fromAddress VARCHAR(255),
    gasUsed BIGINT,
    logs TEXT,
    logsBloom VARCHAR(255),
    root VARCHAR(255),
    status VARCHAR(255),
    toAddress VARCHAR(255),
    transactionIndex BIGINT,
    chainId BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (transactionHash) REFERENCES transactions(transactionHash)
);`;

pool.query(createTransactionReceiptsQuery);
console.log('Transaction receipts table created or already exists!');

// create the logs table if it does not exist
const createLogsTableQuery = `
CREATE TABLE IF NOT EXISTS transaction_logs (
    id INT NOT NULL AUTO_INCREMENT,
    transactionHash VARCHAR(255),
    blockNumber BIGINT,
    logIndex BIGINT,
    address VARCHAR(255),
    topic0 VARCHAR(255),
    topic1 VARCHAR(255),
    topic2 VARCHAR(255),
    topic3 VARCHAR(255),
    data TEXT,
    chainId BIGINT,
    transactionIndex BIGINT,
    transaction_receipt_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (transaction_receipt_id) REFERENCES transaction_receipts(id)
);`;

pool.query(createLogsTableQuery);
console.log('Logs table created or already exists!');
