import axios from "axios";


const loggedAPI = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});


// Автоматическое добавление access-токена в каждый запрос текущего axios-instance
loggedAPI.interceptors.request.use(config => {

    const accessToken = localStorage.getItem("access");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;

    },

    error => Promise.reject(error)

);


// Автоматическое обновление access-токена, если он был просрочен, используется текущий axios-instance
loggedAPI.interceptors.request.use(

    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry && localStorage.getItem("refresh")) {

            originalRequest._retry = true;

            try {

                const refreshToken = localStorage.getItem("refresh");

                const AccessTokenRequest = await axios.post("/api/refresh-token", {
                    refresh: refreshToken,
                });

                const newAccessToken = AccessTokenRequest.data.access;

                localStorage.setItem("access", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return loggedAPI(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/login";
            }

        }

        return Promise.reject(error);

});


export default loggedAPI;