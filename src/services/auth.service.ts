import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

class AuthService {
  private static instance: AuthService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // No token interceptor needed for auth endpoints
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    preferredLanguage?: string;
  }) {
    try {
      const response = await this.api.post(`/api/auth/register`, data);
      if (response.data?.token) {
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));
        this.api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error("Failed to register:", error);
      throw error;
    }
  }

  public async login(data: { email: string; password: string }) {
    try {
      const response = await this.api.post(`/api/auth/login`, data);
      if (response.data?.token) {
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));
        this.api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  }
}

export default AuthService.getInstance();
