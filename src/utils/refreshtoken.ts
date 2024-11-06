// utils/refreshToken.ts

import axios from "axios";

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    const response = await axios.post("/api/refresh-token", { refreshToken });

    if (response.data.success) {
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Store the new tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return accessToken;
    } else {
      throw new Error("Failed to refresh token.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to refresh access token.");
  }
};
