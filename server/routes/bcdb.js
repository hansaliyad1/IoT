const bcdbController = require('../controllers').bcdb;

module.exports = (router) => {

    router.post('/create', bcdbController.createTransactions);

    router.get('/retrieve', bcdbController.retrieveTransactions)

    return router;
};