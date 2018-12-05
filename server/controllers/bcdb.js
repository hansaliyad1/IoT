const driver = require('bigchaindb-driver');

module.exports = {

    createTransactions(req, res) {

        // BigchainDB server instance
        const API_PATH = 'http://50.116.41.123:9984/api/v1/';
        const API_PATH_ = 'http://198.74.54.95:9984/api/v1/';
        const LOCAL_API_PATH = 'http://localhost:9984/api/v1/';

        // Create a new keypair.
        const alice = new driver.Ed25519Keypair();

        // Construct a transaction payload
        const tx = driver.Transaction.makeCreateTransaction(
            // Define the asset to store, in this example it is the current temperature
            // (in Celsius) for the city of Berlin.
            { city: 'Berlin, DE', temperature: 22, datetime: new Date().toString() },

            // Metadata contains information about the transaction itself
            // (can be `null` if not needed)
            { what: 'My first BigchainDB transaction' },

            // A transaction needs an output
            [ driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(alice.publicKey))
            ],
            alice.publicKey
        );

        // Sign the transaction with private keys
        const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey);

        // Send the transaction off to BigchainDB
        const conn = new driver.Connection(LOCAL_API_PATH);

        conn.postTransactionCommit(txSigned)
            .then(retrievedTx =>
                console.log('Transaction', retrievedTx.id, 'successfully posted.')
            );

    }

};