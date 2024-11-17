const jwt = require('jsonwebtoken')

const jsonWebToken = (owner) => {
    // return jwt.sign({ email: owner.email, userid: owner._id }, process.env.JWT_KEY)
    return jwt.sign(
        { email: owner.email, userid: owner._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }  // Optional: set token expiration to 1 hour
    );
}
module.exports.jsonWebToken = jsonWebToken