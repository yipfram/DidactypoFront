import axios from 'axios';

const api = axios.create({
    baseURL: 'https://didactyback.gamberge.org',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;