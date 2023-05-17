const pool = require('./database');

async function getTransactionsByAddresses(addresses) {
    const transactions = [];
    for (const address of addresses) {
        const getTransactionsQuery = 'SELECT * FROM transactions WHERE fromAddress = ? OR toAddress = ? ORDER BY blockNumber DESC;';
        const [rows] = await pool.query(getTransactionsQuery, [ address, address ]);
        console.log(rows);
        transactions.push(rows);
    }
    return transactions;
}

async function getBlockIdByNumber(blockNum) {
    const getBlockIdQuery = `select id from blocks where number= ${blockNum}`;
    let [result] = await pool.query(getBlockIdQuery);
    return result[0].id;
}

module.exports = { getBlockIdByNumber, getTransactionsByAddresses }; 