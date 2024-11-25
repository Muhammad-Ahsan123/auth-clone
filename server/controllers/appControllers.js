const bcrypt = require('bcrypt')
const cookie = require('cookie-parser')
const { jsonWebToken } = require('../utils/jwt');  // Correct import
const otpGenerator = require('otp-generator');  // Correct import
const UserModel = require('../model/User.model')

async function register(req, res) {
    try {
        const { username, password, email, profile } = req.body;

        const existUsername = await UserModel.findOne({ username });
        if (existUsername) return res.status(409).send('Username already exists');

        const existEmail = await UserModel.findOne({ email });
        if (existEmail) return res.status(409).send('Email already exists');

        if (password) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) return res.status(500).send({ msg: 'Error generating salt' });

                bcrypt.hash(password, salt, async function (err, hash) {
                    if (err) return res.status(500).send({ msg: 'Error hashing password' });

                    try {
                        const user = await UserModel.create({
                            username,
                            email,
                            password: hash,
                            profile: profile || '',  // Default to empty string if no profile provided
                        });

                        res.status(201).send({
                            msg: 'User Successfully Created'
                        });

                    } catch (err) {
                        console.error(err);  // Log error for debugging
                        res.status(500).send({ msg: 'Error creating user' });
                    }
                });
            });
        } else {
            res.status(400).send({ msg: 'Password is required' });
        }

    } catch (error) {
        console.error(error);  // Log error for debugging
        return res.status(500).send(error);
    }
}



async function login(req, res) {
    try {
        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });
        if (!user) return res.status(409).send({ error: "User doesn't exist" });

        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.status(500).send({ error: 'Error while comparing password' });
            }

            if (result) {
                // Generate token
                const token = jsonWebToken(user);
                res.cookie('token', token, {
                    httpOnly: true,    // Makes the cookie accessible only to the server
                    secure: process.env.NODE_ENV === 'production', // Secure cookie in production
                    maxAge: 3600000    // Set cookie expiration time (1 hour)
                });

                res.status(201).send({
                    msg: 'Successfully logged in',
                    username: user.username,
                    token
                });
            } else {
                res.status(401).send({ error: 'Invalid password' });
            }
        });
    } catch (error) {
        return res.status(500).send({ error: "Server error occurred" });
    }
}



// get method http://localhost:8080/api/user/:username 

async function verifyUser(req, res, next) {
    try {
        const username = req.query.username || req.params.username || req.body.username;
        if (!username) {
            return res.status(404).send({ error: 'Username is required' });
        }
        let doesusername = await UserModel.findOne({ username });

        if (!doesusername) {
            return res.status(404).send({ error: 'User does not exist from verify' });
        }

        next();
    } catch (error) {
        res.status(404).send({ error: "Authentication error" });
    }
}



async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) return res.status(404).send({ error: 'Invalid Username' });

        const user = await UserModel.findOne({ username }).select('-password');

        if (!user) {
            return res.status(404).send({ error: "Couldn't find username" });
        }

        return res.status(200).send({ msg: user });
    } catch (error) {
        res.status(500).send({ error: "Cannot find user data" });
    }
}




async function updateUser(req, res) {
    const { userid } = req.user;  // Get the user ID from the request (assuming it's authenticated)
    const body = req.body;         // Get the updated data from the request body
    console.log('user id', userid);

    try {
        // If password is being updated, hash it
        if (body.password) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(body.password, 10);  // Hash the password
            body.password = hashedPassword;  // Replace the plain password with the hashed one
        }

        // Perform the update
        const result = await UserModel.updateOne({ _id: userid }, { $set: body });

        // Check if any document was modified
        if (result.modifiedCount === 0) {
            return res.status(404).send({ error: 'No changes made to the user' });  // No changes made
        }

        return res.status(200).send({ msg: 'User Updated' });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }
}



// GET method http://localhost:8080/api/generateOTP 
async function generateOTP(req, res) {

    req.app.locals.OTP = await otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
    // res.json('Generate OTP')
}



// GET method http://localhost:8080/api/verifyOTP 
// async function verifyOTP(req, res) {
//     const { code } = req.query
//     if (parseInt(req.app.locals.OTP) === parseInt(code)) {
//         req.app.locals.OTP = null
//         req.app.locals.resetSession = true
//         return res.status(201).send({ msg: 'Verify Successfully' })
//     }

//     return res.status(401).send({ err: 'Invalid OTP' })

//     // res.json('Verify OTP')
// }
async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true; // Set session flag
        return res.status(201).send({ msg: 'Verified Successfully' });
    }

    return res.status(401).send({ err: 'Invalid OTP' });
}


// GET method http://localhost:8080/api/createResetSession 
// async function createResetSession(req, res) {
//     console.log('createResetSession before resetPassword:', req.app.locals.resetSession);

//     if (req.app.locals.resetSession) {
//         req.app.locals.resetSession = false // allow access to this route granted
//         return res.status(201).send({ msg: 'Access Granted' })
//     }
//     return res.status(440).send({ err: 'Session Expired' })
// }
async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        // return res.status(201).send({ msg: 'Access Granted' });
        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: 'Session Expired' });
}



// async function resetPassword(req, res) {
//     console.log('resetPassword before resetPassword:', req.app.locals.resetSession);

//     const { username, password } = req.body;  // Get the username and new password from the request body

//     try {
//         if (!req.app.locals.resetSession) return res.status(440).send({ err: 'Invalid Session' })
//         // Check if the username exists in the database
//         const user = await UserModel.findOne({ username });

//         if (!user) {
//             return res.status(404).send({ error: 'Username does not exist' });
//         }

//         // Hash the new password before saving it
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Update the password in the database with the hashed password
//         user.password = hashedPassword;
//         await user.save();  // Save the updated user document

//         req.app.locals.resetSession = false;  // Reset session if needed

//         return res.status(200).send({ msg: 'Password successfully reset' });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: 'An error occurred while resetting the password' });
//     }
// }
async function resetPassword(req, res) {
    console.log('resetSession before resetPassword:', req.app.locals.resetSession);

    if (!req.app.locals.resetSession) {
        return res.status(440).send({ error: 'Session expired!' });
    }

    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send({ error: 'Username does not exist' });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        req.app.locals.resetSession = false; // Clear session after reset
        return res.status(200).send({ msg: 'Password successfully reset' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).send({ error: 'An error occurred while resetting the password' });
    }
}


module.exports = {
    register,
    login,
    getUser,
    updateUser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetPassword,
    verifyUser
};