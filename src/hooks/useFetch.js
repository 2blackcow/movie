import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../constants/api.config';

const useFetch = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_CONFIG.BASE_URL}${endpoint}`, {
                params: {
                    api_key: API_CONFIG.API_KEY,
                    language: API_CONFIG.LANGUAGE
                }
            });

            setData(response.data.results || response.data);
            setError(null);
        } catch (error) {
            setError(error.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;