const jwt = require('jsonwebtoken');

module.exports = {
    ensureAuthorized(req, res, next) {
        const bearerHeader = req.headers['authorization']; // Create token found in headers

        // Check if token was found in headers
        if (!bearerHeader) {
            res.json({success: false, message: 'No token provided'}); // Return error
        } else {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];

            // Verify the token is valid
            jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
                // Check if error is expired or invalid
                if (err) {
                    res.json({success: false, message: 'Token invalid: ' + err}); // Return error for token validation
                } else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    }
}