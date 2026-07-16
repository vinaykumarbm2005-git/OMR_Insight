import api from "./api";

export const authService = {
  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login: async (credentials, rememberMe = false) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // Store token after successful login
      if (response.data.success) {
        const token = response.data.data.token;
        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: "Unable to connect to server.",
      };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  },

  /**
   * Verify if token exists
   */
  verifyToken: () => {
    return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
  },
};