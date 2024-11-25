// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getUsername } from '../helper/helper';  // Assuming this is a function
// axios.defaults.baseURL = import.meta.env.VITE_SERVER_DOMAIN;

// export default function useFetch(query) {
//     const [getData, setData] = useState({
//         isLoading: false,
//         apiData: undefined,
//         status: null,
//         serverError: null,
//     });

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setData(prev => ({ ...prev, isLoading: true }));

//                 // Fetch username (assuming getUsername is an async function returning a username string)
//                 const { username } = !query ? await getUsername() : '';
//                 // console.log('USERNAME', username);

//                 let url;
//                 if (!query) {
//                     // Only append username when query is not provided
//                     url = `/api/user/${username}`;
//                 } else {
//                     // Construct URL using query
//                     url = `/api/${query}`;
//                 }

//                 const { data, status } = await axios.get(url);

//                 if (status === 200) {
//                     setData(prev => ({
//                         ...prev,
//                         isLoading: false,
//                         apiData: data,
//                         status: status,
//                     }));
//                 } else {
//                     setData(prev => ({
//                         ...prev,
//                         isLoading: false,
//                         status: status,
//                     }));
//                 }
//             } catch (error) {
//                 setData(prev => ({
//                     ...prev,
//                     isLoading: false,
//                     serverError: error.message || error,
//                 }));
//             }
//         };

//         fetchData();
//     }, [query]); // Ensure useEffect runs whenever `query` changes

//     return [getData, setData];
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_DOMAIN;

export default function useFetch(query) {
    const [getData, setData] = useState({
        isLoading: false,
        apiData: undefined,
        status: null,
        serverError: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true, serverError: null }));

                // Fetch username if `query` is not provided
                const { username } = !query ? await getUsername() : "";
                const url = !query ? `/api/user/${username}` : `/api/${query}`;

                // Make API call
                const response = await axios.get(url);
                const { data, status } = response;

                // Set state for successful response
                setData(prev => ({
                    ...prev,
                    isLoading: false,
                    apiData: data,
                    status,
                    serverError: null,
                }));
            } catch (error) {
                // Handle errors and capture `status`
                const status = error.response?.status || null;
                const message = error.response?.data?.error || error.message;

                setData(prev => ({
                    ...prev,
                    isLoading: false,
                    apiData: undefined,
                    status,
                    serverError: message,
                }));
            }
        };

        fetchData();
    }, [query]); // Re-run if `query` changes

    return [getData, setData];
}
