const bcdbController = require('../controllers').bcdb;

module.exports = (router) => {

    router.post('/create', bcdbController.createTransactions);

    return router;
};