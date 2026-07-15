import api from "./api";

export const authService = {
  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // Store token after successful login
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
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
  },

  /**
   * Verify if token exists
   */
  verifyToken: () => {
    return !!localStorage.getItem("token");
  },
};