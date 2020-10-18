import axios from 'axios'
const httpClient = axios.create({
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        "X-App-Token": process.env.VUE_APP_TOKEN,
    }
});

export default httpClient;