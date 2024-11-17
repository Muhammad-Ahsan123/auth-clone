const jwt = require('jsonwebtoken');

// Middleware to check if the user is authorized
async function checkAuthorization(req, res, next) {
    try {
        // Ensure the token exists in the Authorization header
        if (!req.headers.authorization) {
            return res.status(401).send('User authentication Required');
        }

        // Extract the token from the Authorization header
        const tokenForAuthorization = req.headers.authorization.split(" ")[1];

        // If the token is not present or doesn't have the Bearer prefix
        if (!tokenForAuthorization) {
            return res.status(401).send('User authentication Required');
        }

        // Verify the token using the JWT secret key
        const decodedToken = await jwt.verify(tokenForAuthorization, process.env.JWT_KEY);

        // Attach the decoded user information to the request object (to be used in further route handlers)
        req.user = decodedToken;  // This is the key change here
        console.log('Request DOT USER', req.user);

        // Call the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid or expired, return 401 Unauthorized
        return res.status(401).send('User authentication Required');
    }
}

// Middleware to set local variables for OTP
async function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}

// Export both functions as part of an object
module.exports = {
    checkAuthorization,
    localVariables
};
