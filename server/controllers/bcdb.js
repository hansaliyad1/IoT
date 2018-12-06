const request   = require('request');
const driver    = require('bigchaindb-driver');
const bip39     = require('bip39');
const alice     = new driver.Ed25519Keypair(bip39.mnemonicToSeed('secret').slice(0, 32));


module.exports = {

    createTransactions(req, res) {

        if (!req.body.city) {
            res.json({ success: false, message: 'Please provide City name.' });
        }
        else if (!req.body.temperature) {
            res.json({ success: false, message: 'Please provide temperature.' });
        }
        else if (!req.body.metadata) {
            res.json({ success: false, message: 'Please provide metadata.' });
        }
        else {

            // Construct a transaction payload
            const tx = driver.Transaction.makeCreateTransaction(
                // Define the asset to store, in this example it is the current temperature
                // (in Celsius) for the city of Berlin.
                { city: req.body.city, temperature: req.body.temperature, datetime: new Date().toString() },

                // Metadata contains information about the transaction itself
                // (can be `null` if not needed)
                { what: req.body.metadata },

                // A transaction needs an output
                [ driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(alice.publicKey))
                ],
                alice.publicKey
            );

            // Sign the transaction with private keys
            const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey);

            // Send the transaction off to BigchainDB
            const conn = new driver.Connection(process.env.API_PATH);

            conn.postTransactionCommit(txSigned)
                .then(retrievedTx => {
                    console.log('Transaction', retrievedTx.id, 'successfully posted.');
                    res.json({ success: true, message: 'Successfully Posted.', txID: retrievedTx.id });
                });

        }

    },

    searchTransactions(req, res) {

        if (!req.params.term) {
            res.json({ success: false, message: 'Please provide search term' });
        }
        else {

            let options = {
                method: 'GET',
                url: process.env.API_PATH + 'assets/',
                qs: { search: req.params.term },
                headers:
                    { 'Postman-Token': '2e1f19fb-9a8c-4c6c-aaa7-063b31789428',
                        'cache-control': 'no-cache' } };

            request(options, (error, response, body) => {
                if (error) {
                    res.json({ success: false, message: error })
                }
                else {
                    res.json({ success: true, message: JSON.parse(body) })
                }
            });

        }

    }

};