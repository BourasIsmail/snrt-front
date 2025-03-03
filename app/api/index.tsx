import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { User } from "@/app/types/User";

const client = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
type FailedPromise = {
    resolve: (value?: string | PromiseLike<string> | undefined) => void;
    reject: (reason?: unknown) => void;
};

let failedQueue: FailedPromise[] = [];

const processQueue = (error: Error | null, token: string | undefined = undefined) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const refreshToken = async () => {
    const refreshToken = await getCookie("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await api.post("/user/refresh-token", { token: refreshToken });
    const newToken = response.data.token;
    setCookie("token", newToken);
    return newToken;
};

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    const newToken = await refreshToken();
                    client.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    resolve(axios(originalRequest));
                } catch (err: unknown) {
                    processQueue(err as Error, undefined);
                    reject(err);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        return Promise.reject(error);
    }
);

client.interceptors.request.use(
    async (config) => {
        const token = await getCookie("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const api = client;

const tokenPayload = async () => {
    const token = await getCookie("token");
    if (!token) return null;
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    const tokenPay = JSON.parse(decodedPayload);
    return tokenPay.sub;
};

export function getCurrentUser() {
    return async () => {
        const email = await tokenPayload();
        if (!email) return null;
        const token = await getCookie("token");
        const { data } = await api.get("/user/email/" + email, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };
}

export async function getCurrentUsers(): Promise<User> {
    const token = await getCookie("token");
    if (!token) throw new Error("No token found");

    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.sub;

    const { data } = await api.get("/user/getUsersByEmail/" + email);
    return data;
}

export function getUsers() {
    return async () => {
        const token = await getCookie("token");
        const { data } = await api.get("/user/getUsers", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };
}

export function logout() {
    deleteCookie("token");
    deleteCookie("refreshToken");
    window.location.href = "/login";
}