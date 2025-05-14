import axios from "axios";
import useAuthSession from "../auth/useAuthSession";
import { useCallback, useEffect } from "react";
import { useRouter } from "expo-router";

export const useAxios = () => {
  const {
    accessToken,
    refreshToken,
    isAccessExpired,
    isRefreshExpired,
    setAccessToken,
    setRefreshToken,
    logout,
  } = useAuthSession();
  const router = useRouter();

  const executeRefreshToken = useCallback(async () => {
    try {
      const response = await axios.post<{
        accessToken: string;
        refreshToken: string;
      }>(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;
      await setAccessToken(newAccessToken);
      await setRefreshToken(newRefreshToken);
      console.log("Access token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token: ", error);
    }
  }, [refreshToken]);

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      return;
    }

    if (isAccessExpired) {
      if (isRefreshExpired) {
        logout();
        router.dismissTo("/login");
        return;
      }

      executeRefreshToken();
      return;
    }
  }, [isAccessExpired, isRefreshExpired, accessToken, refreshToken]);

  const axiosInstance = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    console.log("Request made with ", config);
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("Response received: ", response);
      return response;
    },
    (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error: ", error.response.data);
        console.error("Response status: ", error.response.status);
        console.error("Response headers: ", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error("Request error: ", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message: ", error.message);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
