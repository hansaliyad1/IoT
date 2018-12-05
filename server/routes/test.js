const testController = require('../controllers').test

module.exports = (router) => {

    router.get('/test', testController.test)

    return router;
};