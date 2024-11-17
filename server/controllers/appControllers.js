const bcrypt = require('bcrypt')
const cookie = require('cookie-parser')
const { jsonWebToken } = require('../utils/jwt');  // Correct import
const otpGenerator = require('otp-generator');  // Correct import
const UserModel = require('../model/User.model')




// Username
// Password
// email
// firstName
// lastName
// mobileNo
// address
// portfolio
// post method http://localhost:8080/api/register 

// async function register(req, res) {
//     try {
//         const { username, password, email, profile } = req.body;

//         // Check if username already exists
//         const existUsername = await UserModel.findOne({ username });
//         if (existUsername) return res.status(409).send('Username already exists');

//         // Check if email already exists
//         const existEmail = await UserModel.findOne({ email });
//         if (existEmail) return res.status(409).send('Email already exists');

//         // If password is provided, hash it and create the user
//         if (password) {
//             const salt = await bcrypt.genSalt(10);
//             const hash = await bcrypt.hash(password, salt);

//             try {
//                 const user = await UserModel.create({
//                     username,
//                     email,
//                     password: hash,
//                     profile: profile || '',
//                 });

//                 // Respond with success
//                 res.status(201).send({ msg: 'User successfully created' });
//             } catch (err) {
//                 console.error(err); // Log the error for debugging
//                 res.status(500).send({ msg: 'Error creating user' });
//             }
//         } else {
//             res.status(400).send({ msg: 'Password is required' });
//         }

//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         return res.status(500).send({ msg: 'Internal server error' });
//     }
// }




async function register(req, res) {
    try {
        const { username, password, email, profile } = req.body;

        // Check if username already exists
        const existUsername = await UserModel.findOne({ username });
        if (existUsername) return res.status(409).send('Username already exists');

        // Check if email already exists
        const existEmail = await UserModel.findOne({ email });
        if (existEmail) return res.status(409).send('Email already exists');

        // If password is provided
        if (password) {
            // Using bcrypt callback for salt generation and hashing
            bcrypt.genSalt(10, function (err, salt) {
                if (err) return res.status(500).send({ msg: 'Error generating salt' });

                bcrypt.hash(password, salt, async function (err, hash) {
                    if (err) return res.status(500).send({ msg: 'Error hashing password' });

                    try {
                        // Create the user after password hashing
                        const user = await UserModel.create({
                            username,
                            email,
                            password: hash,
                            profile: profile || '',  // Default to empty string if no profile provided
                        });

                        // Respond with success
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
            // If no password is provided
            res.status(400).send({ msg: 'Password is required' });
        }

    } catch (error) {
        console.error(error);  // Log error for debugging
        return res.status(500).send(error);
    }
}



// Username
// Password
// post method http://localhost:8080/api/login 

// async function login(req, res) {
//     try {
//         const { username, password } = req.body;

//         // Check if username already exists
//         const emailexisting = await UserModel.findOne({ email });
//         if (!emailexisting) return res.status(409).send('User does"nt exist');


//         bcrypt.compare(password, emailexisting.password, function (err, result) {
//             if (err) {
//                 return res.status(500).send('Error while comparing password');
//             }


//             if (result) {
//                 let token = jsonWebToken(emailexisting)
//                 res.cookie('token', token)


//                 res.cookie('token', token, {
//                     httpOnly: true,    // Makes the cookie accessible only to the server
//                     secure: process.env.NODE_ENV === 'production', // Secure cookie in production
//                     maxAge: 3600000    // Set cookie expiration time (1 hour in milliseconds)
//                 });

//                 res.status(201).send({
//                     msg: 'successfully login user',
//                     username: emailexisting.username,
//                     token
//                 })
//             } else {
//                 res.status(401).send('Invalid password')
//             }
//         });

//     } catch (error) {
//         return res.status(500).send(error)
//     }
// }
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Check if the user exists by username
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
        // First, try to get 'username' from the query string (req.query)
        const username = req.query.username || req.params.username || req.body.username;

        // If no username is found, return an error
        if (!username) {
            return res.status(404).send({ error: 'Username is required' });
        }

        // Check if the user exists in the database
        let doesusername = await UserModel.findOne({ username });

        if (!doesusername) {
            return res.status(404).send({ error: 'User does not exist from verify' });
        }

        next();
    } catch (error) {
        // Handle any other errors
        res.status(404).send({ error: "Authentication error" });
    }
}



async function getUser(req, res) {
    const { username } = req.params;
    // const { username } = req.query
    console.log('getuser', username);

    try {
        if (!username) return res.status(404).send({ error: 'Invalid Username' });


        // Query the user and exclude the password using `.select('-password')`
        const user = await UserModel.findOne({ username }).select('-password');

        console.log('user', user);

        if (!user) {
            return res.status(404).send({ error: "Couldn't find username" });  // User not found
        }

        // Send the response with user details (excluding password)
        return res.status(200).send({ msg: user });
    } catch (error) {
        res.status(500).send({ error: "Cannot find user data" });  // Server error
    }
}




// address
// profile
// firstname
// put method http://localhost:8080/api/update 
// async function updateUser(req, res) {
//     const { userid } = req.user;  // Get the user ID from the route parameters
//     const body = req.body;      // Get the updated data from the request body
//     console.log('user id', userid);

//     try {
//         // Perform the update and get the result object
//         const result = await UserModel.updateOne({ _id: userid }, body);
//         if (result.modifiedCount === 0) {
//             return res.status(404).send({ error: 'No changes made to the user' });  // No changes made
//         }

//         return res.status(200).send({ msg: 'User Updated' });

//     } catch (error) {
//         if (!res.headersSent) {  
//             res.status(500).send({ error: 'Internal Server Error' });
//         }
//     }
// }
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
async function verifyOTP(req, res) {
    const { code } = req.query
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null
        req.app.locals.resetSession = true
        return res.status(201).send({ msg: 'Verify Successfully' })
    }

    return res.status(401).send({ err: 'Invalid OTP' })

    // res.json('Verify OTP')
}


// GET method http://localhost:8080/api/createResetSession 
async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false // allow access to this route granted
        return res.status(201).send({ msg: 'Access Granted' })
    }
    return res.status(440).send({ err: 'Session Expired' })

    // res.json('createResetSession OTP')
}


// PUT method http://localhost:8080/api/resetPassword 
// async function resetPassword(req, res) {

//     const { username, password } = req.body
//     try {
//         let usernameExist = await UserModel.findOne({ username })
//         if (!usernameExist) {
//             return res.status(404).send({ err: 'Email does"nt Exist' })
//         }
//         bcrypt.genSalt(10, function (err, salt) {
//             bcrypt.hash(password, salt, async function (err, hash) {
//                 if (err) return res.status(500).send({ err: 'Error is occured when hashing password' })
//                 let usernameExist = await UserModel.updateOne({ username }, { password: hash })


//                 return res.status(201).send({ msg: 'Password is Successfull Reset' })

//             })
//         })
//     }catch (err) {
//         return res.status(201).send({ msg: 'Reset Password Successfully' })
//     }
// }


async function resetPassword(req, res) {
    const { username, password } = req.body;  // Get the username and new password from the request body

    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ err: 'Invalid Session' })
        // Check if the username exists in the database
        // const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: 'Username does not exist' });
        }

        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database with the hashed password
        user.password = hashedPassword;
        await user.save();  // Save the updated user document

        req.app.locals.resetSession = false;  // Reset session if needed

        return res.status(200).send({ msg: 'Password successfully reset' });

    } catch (error) {
        console.error(error);
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