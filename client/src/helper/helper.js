import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
axios.defaults.baseURL = import.meta.env.VITE_SERVER_DOMAIN


// export async function getUsername() {
//     const token = localStorage.getItem('token')
//     const decodeToken = jwtDecode(token)
//     console.log('Token', decodeToken);
//     return decodeToken;  // Or specific data like decoded.username
// }
export async function getUsername() {
    const token = localStorage.getItem('token');
    if (!token || typeof token !== 'string') {
        console.log('Token is missing or invalid');
        return null;  // Return null or handle this case in a different way
    }

    try {
        const decodeToken = jwtDecode(token);  // Decode token
        console.log('Decoded Token:', decodeToken);  // Check the decoded token here
        return decodeToken;
    } catch (error) {
        console.log('Error decoding token:', error);
        return null;
    }
}


/** authenticate function */
export async function authenticate(username) {
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error: "Username doesn't exist...!" }
    }
}

/** get User details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "Password doesn't Match...!" }
    }
}

/** register user function */
export async function registerUser(credentials) {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials);
        console.log('ha bhai resgister ho gaya user', credentials);

        let { username, email } = credentials;

        /** send email */
        if (status === 201) {
            await axios.post('/api/registerEmail', { username, userEmail: email, text: msg })
        }

        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}

/** login function */
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            console.log('hai ga username bhai');

            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't Match...!" })
    }
}


/** update user profile function */
export async function updateUser(response) {
    try {

        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } });

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error: "Couldn't Update Profile...!" })
    }
}

/** generate OTP */
export async function generateOTP(username, userEmail) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

        // send mail with the OTP
        if (status === 201) {
            let { data: { email } } = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerEmail', { username, userEmail, text, subject: "Password Recovery OTP" })
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } })
        return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }) {
    try {
        console.log('Ha bhai reset ho raha hai');

        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}