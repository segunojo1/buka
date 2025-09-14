import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

class AppService {
    private static instance: AppService;
    private api: AxiosInstance;

    private constructor() {
        this.api = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers: {
                "Content-Type": "application/json"
            }
        });
        this.api.interceptors.request.use(
            (config) => {
                const token = Cookies.get("token");
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    public static getInstance(): AppService {
        if (!AppService.instance) {
            AppService.instance = new AppService();
        }
        return AppService.instance;
    }

    public async addStreak() {
        try {
            const response = await this.api.post(`/api/user/streak/increment`);
            return response.data;
        } catch (error) {
            console.error("Failed to add streak:", error);
            throw error;
        }
    }

    public async getStreak() {
        try {
            const response = await this.api.get(`/api/user/getstreak`);
            return response.data.streakCount;
        } catch (error) {
            console.error("Failed to get streak:", error);
            throw error;
        }
    }

    public async chatText(payload: any) {
        const {message, sessionId, userLocation, language} = payload
         try {
            const response = await this.api.post(`/api/chat/text`, {
                message,
                sessionId,
                userLocation,
                language
            });
            return response.data;
        } catch (error) {
            console.error("Failed to send chat message:", error);
            throw error; 
        }
    }
}

export default AppService.getInstance()