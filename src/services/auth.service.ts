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

  private setAuthTokens(accessToken: string, refreshToken: string) {
    // Set tokens in cookies with appropriate expiration
    const accessTokenExpiry = new Date();
    accessTokenExpiry.setHours(accessTokenExpiry.getHours() + 1); // 1 hour expiry for access token
    
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days expiry for refresh token

    Cookies.set('access_token', accessToken, { expires: accessTokenExpiry });
    Cookies.set('refresh_token', refreshToken, { expires: refreshTokenExpiry });
    
    // Set default auth header for axios
    this.api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  private clearAuthTokens() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    delete this.api.defaults.headers.common['Authorization'];
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
      if (response.data?.accessToken && response.data?.refreshToken) {
        this.setAuthTokens(response.data.accessToken, response.data.refreshToken);
        Cookies.set('user', JSON.stringify(response.data.user));
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
      if (response.data?.accessToken && response.data?.refreshToken) {
        this.setAuthTokens(response.data.accessToken, response.data.refreshToken);
        Cookies.set('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  }

  public async refreshAccessToken() {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await this.api.post('/api/auth/refresh', { refreshToken });
      
      if (response.data?.accessToken) {
        const accessToken = response.data.accessToken;
        
        const accessTokenExpiry = new Date();
        accessTokenExpiry.setHours(accessTokenExpiry.getHours() + 1);
        Cookies.set('access_token', accessToken, { expires: accessTokenExpiry });
        
        // Update axios default header
        this.api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return accessToken;
      }
      
      throw new Error('No access token in response');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearAuthTokens();
      throw error;
    }
  }

  public async logout() {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        // Try to call the logout endpoint to invalidate the refresh token
        await this.api.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearAuthTokens();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }


  public async getUser() {
    try {
      const response = await this.api.get(`/api/auth/me`);
      return response.data;
    } catch (error) {
      console.error("Failed to get user", error);
      throw error
    }
  }

  public async changePassword({currentPassword, newPassword}: { currentPassword: string; newPassword: string}) {
    try {
      const response = await this.api.put(`/api/auth/change-password`, {currentPassword, newPassword});
      return response.data;
    } catch (error) {
      console.error("Failed to change password", error);
      throw error
    }
  }
  
}

export default AuthService.getInstance();
