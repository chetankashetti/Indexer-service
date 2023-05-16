const pool = require('./database');

async function getTransactionsByAddresses(addresses) {
    transactions = [];
    for (const address of addresses) {
        const getBlockIdQuery = `SELECT * FROM transactions WHERE fromAddress= '${address}' OR toAddress= '${address}' ORDER BY blockNumber DESC;        `;
        let [result] = await pool.query(getBlockIdQuery);
        console.log(result);
        transactions.push(result);
    }
    return transactions;
}


async function getBlockIdByNumber(blockNum) {
    const getBlockIdQuery = `select id from blocks where number= ${blockNum}`;
    let [result] = await pool.query(getBlockIdQuery);
    return result[0].id;
}

module.exports = { getBlockIdByNumber, getTransactionsByAddresses }; 