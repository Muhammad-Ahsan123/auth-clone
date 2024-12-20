// import React, { useEffect } from 'react'
// import toast, { Toaster } from 'react-hot-toast';
// import { useFormik } from 'formik';
// import { resetPasswordValidation } from '../helper/validate'
// import { resetPassword } from '../helper/helper'
// import { useAuthStore } from '../store/store';
// import { useNavigate, Navigate } from 'react-router-dom';
// import useFetch from '../hooks/fetch.hook'

// import styles from '../styles/Username.module.css';

// export default function Reset() {

//     const { username } = useAuthStore(state => state.auth);
//     // console.log('Username from Authstate',
//     //     username
//     // );

//     const navigate = useNavigate();
//     const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession')
//     console.log('Reset Page', status);

//     // console.log(status);
//     useEffect(() => {
//         if (status && status !== 201) {
//             toast.error('Session expired. Please restart the reset process.');
//             navigate('/password'); // Redirect to restart process
//         }
//     }, [status]);

//     const formik = useFormik({
//         initialValues: {
//             password: 'admin@123',
//             confirm_pwd: 'admin@123'
//         },
//         validate: resetPasswordValidation,
//         validateOnBlur: false,
//         validateOnChange: false,
//         onSubmit: async values => {

//             console.log('Password check on reset password', values);

//             let resetPromise = resetPassword({ username, password: values.password })

//             toast.promise(resetPromise, {
//                 loading: 'Updating...',
//                 success: <b>Reset Successfully...!</b>,
//                 error: <b>Could not Reset!</b>
//             });

//             resetPromise.then(function () { navigate('/password') })

//         }
//     })


//     if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
//     if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
//     if (status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

//     return (
//         <div className="container mx-auto relative top-1/2 transform -translate-y-1/2">

//             <Toaster position='top-center' reverseOrder={false}></Toaster>

//             <div className='flex justify-center items-center h-screen'>
//                 <div className={`${styles.glass} h-3/4`} style={{ width: "50%" }}>

//                     <div className="title flex flex-col items-center">
//                         <h4 className='text-5xl font-bold'>Reset</h4>
//                         <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
//                             Enter new password.
//                         </span>
//                     </div>

//                     <form className='py-20' onSubmit={formik.handleSubmit}>
//                         <div className="textbox flex flex-col items-center gap-6">
//                             <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='New Password' />
//                             <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type="text" placeholder='Repeat Password' />
//                             <button className={styles.btn} type='submit'>Reset</button>
//                         </div>

//                     </form>

//                 </div>
//             </div>
//         </div>
//     )
// }



import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/validate';
import { resetPassword } from '../helper/helper';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';

import styles from '../styles/Username.module.css';

export default function Reset() {
    const { username } = useAuthStore(state => state.auth);
    const navigate = useNavigate();

    const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');

    // Handle session expiration or invalid session
    useEffect(() => {
        if (status === 440) {
            toast.error('Session expired. Please restart the reset process.');
            navigate('/');
        }
    }, [status, navigate]);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_pwd: '',
        },
        validate: resetPasswordValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            const resetPromise = resetPassword({ username, password: values.password });

            toast.promise(resetPromise, {
                loading: 'Updating...',
                success: <b>Password Reset Successfully!</b>,
                error: <b>Could not reset password.</b>,
            });

            resetPromise.then(() => navigate('/password'));
        },
    });

    if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
    if (serverError && serverError.message)
        return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

    return (
        <div className="container mx-auto relative top-1/2 transform -translate-y-1/2">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="flex justify-center items-center h-screen">
                <div className={`${styles.glass} h-3/4`} style={{ width: '50%' }}>
                    <div className="title flex flex-col items-center">
                        <h4 className="text-5xl font-bold">Reset</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Enter a new password.
                        </span>
                    </div>

                    <form className="py-20" onSubmit={formik.handleSubmit}>
                        <div className="textbox flex flex-col items-center gap-6">
                            <input
                                {...formik.getFieldProps('password')}
                                className={styles.textbox}
                                type="password"
                                placeholder="New Password"
                            />
                            <input
                                {...formik.getFieldProps('confirm_pwd')}
                                className={styles.textbox}
                                type="password"
                                placeholder="Repeat Password"
                            />
                            <button className={styles.btn} type="submit">
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
