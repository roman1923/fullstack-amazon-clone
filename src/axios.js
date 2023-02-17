import axios from "axios";

const instance = axios.create({
    baseURL: "https://us-central1-challenge-5690a.cloudfunctions.net/api"
    //'http://127.0.0.1:5001/challenge-5690a/us-central1/api'
});

export default instance;