import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";
import authService from "./auth.service";

class AppService {
  private static instance: AppService;
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedRequests: Array<() => void> = [];

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get("buka_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is not 401 or if we already tried to refresh the token
        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        // Prevent multiple refresh attempts
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedRequests.push(() => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${Cookies.get(
                  "buka_token"
                )}`;
              }
              this.api(originalRequest).then(resolve).catch(reject);
            });
          });
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          // Try to refresh the token
          await authService.refreshAccessToken();

          // Process all the failed requests in the queue
          this.failedRequests.forEach((callback) => callback());
          this.failedRequests = [];

          // Retry the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${Cookies.get(
              "buka_token"
            )}`;
          }
          return this.api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear auth and redirect to login
          await authService.logout();
          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
        }
      }
    );
  }

  public static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  //==================================================BUSYNESS ENDPOINTS===================================================
  public async getBusyness(placeId: string) {
    try {
      const response = await this.api.post(`/api/Busyness/check`, { placeId });
      return response.data;
    } catch (error) {
      console.error("Failed to get busyness", error);
      throw error;
    }
  }
  public async getBusynessSimple(placeId: string) {
    try {
      const response = await this.api.post(`/api/Busyness/simple`, { placeId });
      return response.data;
    } catch (error) {
      console.error("Failed to get busyness simple", error);
      throw error;
    }
  }
  public async getBusynessQuick({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) {
    try {
      const response = await this.api.post(`/api/Busyness/quick`, {
        latitude,
        longitude,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get busyness quick", error);
      throw error;
    }
  }

  public async getSpotBusyness({
    placeId,
    spotId,
  }: {
    placeId?: string;
    spotId: string;
  }) {
    try {
      const response = await this.api.get(`/api/Busyness/${spotId}`, {
        params: {
          placeId,
          spotId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get spot busyness", error);
      throw error;
    }
  }

  public async recordUserCheckIn({
    userId,
    spotId,
  }: {
    userId: string;
    spotId: string;
  }) {
    try {
      const response = await this.api.post(`/api/Busyness/check-in`, {
        userId,
        spotId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to record user check-in", error);
      throw error;
    }
  }

  public async getHourlyBusyness(placeId: string) {
    try {
      const response = await this.api.get(`/api/Busyness/pattern/${placeId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get hourly busyness", error);
      throw error;
    }
  }

  public async getAlternativesSpots(spotId: string) {
    try {
      const response = await this.api.get(
        `/api/Busyness/${spotId}/alternatives`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get alternatives", error);
      throw error;
    }
  }

  //this checks the busyness for multiple places
  public async getBatchBusyness({
    places,
    includeHeatmap = true,
  }: {
    places: string[];
    includeHeatmap?: boolean;
  }) {
    try {
      const response = await this.api.post(`/api/busyness/batch`, {
        places,
        includeHeatmap,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get batch busyness", error);
      throw error;
    }
  }

  //get all business levels, this is the most useless endpoint tho it just returns a static enum i can create myself
  public async getBusynessLevels() {
    try {
      const response = await this.api.get(`/api/Busyness/levels`);
      return response.data;
    } catch (error) {
      console.error("Failed to get busyness levels", error);
      throw error;
    }
  }
  //==================================================END OF BUSYNESS ENDPOINTS====================================================

  //================================================BEGINNING OF CHAT ENDPOINTS====================================================
  public async chatText(payload: any) {
    const { message, sessionId, userLocation, language } = payload;
    try {
      const response = await this.api.post(`/api/chat/text`, {
        message,
        sessionId,
        userLocation,
        language,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to send chat message:", error);
      throw error;
    }
  }

  public async sendVoiceChat(payload: {
    audioFile: File;
    sessionId: string;
    userLocation: { latitude: number; longitude: number };
    language: string;
    audioFormat: string;
  }) {
    const formData = new FormData();
    formData.append('audio', payload.audioFile);
    formData.append('sessionId', payload.sessionId);
    formData.append('language', payload.language);
    formData.append('audioFormat', payload.audioFormat);
    formData.append('latitude', payload.userLocation.latitude.toString());
    formData.append('longitude', payload.userLocation.longitude.toString());

    try {
      const response = await this.api.post(`/api/chat/voice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to send voice chat message:", error);
      throw error;
    }
  }

  public async getChatHistory(sessionId: string) {
    try {
      const response = await this.api.get(`/api/chat/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get chat history:", error);
      throw error;
    }
  }

  public async createChatSession() {
    try {
      const response = await this.api.post(`/api/chat/session`);
      return response.data;
    } catch (error) {
      console.error("Failed to create chat session:", error);
      throw error;
    }
  }
  //================================================END OF CHAT ENDPOINTS====================================================


  //================================================BEGINNING OF SPOT ENDPOINTS====================================================
  public async getNearbySpots(params: { latitude: number; longitude: number}) {
    try {
        const response = await this.api.get(`/api/spot/nearby`, {params});
        return response.data;
    } catch (error) {
      console.error("Failed to get nearby spots:", error);
      throw error;
    }
  }
}

export default AppService.getInstance();
