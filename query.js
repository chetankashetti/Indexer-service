const pool = require('./database');

async function getTransactionsByAddresses(addresses) {
    const transactions = [];
    for (const address of addresses) {
        const getTransactionsQuery = 'SELECT * FROM transactions WHERE fromAddress = ? OR toAddress = ? ORDER BY blockNumber DESC;';
        const [rows] = await pool.query(getTransactionsQuery, [address, address]);
        console.log(rows);
        transactions.push(rows);
    }
    return transactions;
}

async function getTransactionByHash(txHash) {
    const getTransactionsQuery = 'SELECT * FROM transactions WHERE transactionHash=?;';
    const [rows] = await pool.query(getTransactionsQuery, [txHash]);
    const getLogsQuery = 'SELECT * FROM transaction_logs WHERE transactionHash=?;';
    const [logs] = await pool.query(getLogsQuery, [txHash]);
    if (rows.length > 0){
        // we can decoding logic here
        // extract topic0 and then if we have the abi then check for method and from, to can be found in topics
        rows[0]['logs'] = logs;
    }
    return rows
}

async function getBlockIdByNumber(blockNum) {
    const getBlockIdQuery = `select id from blocks where number= ${blockNum}`;
    let [result] = await pool.query(getBlockIdQuery);
    return result[0].id;
}

async function getLastIndexedBlock(chainId) {
    const getBlockIdQuery = `select blockNumber from block_indexed where chainId= ${chainId}`;
    let [result] = await pool.query(getBlockIdQuery);
    if (result.length > 0) {
        return result[0].blockNumber + 1;  
    }
    return result[0];
}


module.exports = { getBlockIdByNumber, getTransactionsByAddresses, getTransactionByHash, getLastIndexedBlock }; 