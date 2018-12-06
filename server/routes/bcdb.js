const auth = require('./auth');
const bcdbController = require('../controllers').bcdb;

module.exports = (router) => {

    router.post('/create', auth.ensureAuthorized, bcdbController.createTransactions);

    router.get('/search/:term', auth.ensureAuthorized, bcdbController.searchTransactions)

    return router;
};