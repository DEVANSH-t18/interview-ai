import axios from "axios"


const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl.startsWith("http")) {
        return envUrl;
    }
    if (typeof window !== "undefined" && window.location.hostname.endsWith(".onrender.com")) {
        const backendHostname = window.location.hostname.replace("frontend", "backend");
        return `https://${backendHostname}`;
    }
    return "http://localhost:3000";
}

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.log(err)
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {

    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
    }

}