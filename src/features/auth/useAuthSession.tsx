import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

// Define the shape of our auth state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

// Define the auth context value shape
interface AuthContextValue extends AuthState {
  setAccessToken: (accessToken: string) => Promise<boolean>;
  setRefreshToken: (refreshToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAccessExpired: boolean;
  isRefreshExpired: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  // Load stored auth state on startup
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("auth_token");
        const refreshToken =
          await SecureStore.getItemAsync("auth_refresh_token");

        if (accessToken && refreshToken) {
          setState({
            isAuthenticated: true,
            accessToken,
            refreshToken,
            user: null,
          });
        }
      } catch (error) {
        console.error("Failed to load auth state", error);
      }
    };

    loadStoredAuth();
  }, []);

  const setAccessToken = async (accessToken: string): Promise<boolean> => {
    // Store the access token securely
    await SecureStore.setItemAsync("auth_token", accessToken);

    // Update state
    setState((prevState) => ({
      ...prevState,
      isAuthenticated: true,
      accessToken,
    }));

    return true;
  };

  const setRefreshToken = async (refreshToken: string): Promise<boolean> => {
    // Store the refresh token securely
    await SecureStore.setItemAsync("auth_refresh_token", refreshToken);
    // Update state
    setState((prevState) => ({
      ...prevState,
      refreshToken,
    }));
    return true;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Clear stored auth data
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("auth_refresh_token");

      // Reset state
      setState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      router.dismissTo("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isAccessExpired = useMemo(() => {
    if (!state.accessToken) {
      return true;
    }

    const payload = jwtDecode(state.accessToken);
    const { exp, iat } = payload as { exp: number; iat: number };
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isExpired = exp < currentTime - 60 * 5; // 5 minutes

    return isExpired;
  }, [state.accessToken]);

  const isRefreshExpired = useMemo(() => {
    if (!state.refreshToken) {
      return true;
    }

    const payload = jwtDecode(state.refreshToken);
    const { exp, iat } = payload as { exp: number; iat: number };
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = exp < currentTime;

    return isExpired;
  }, [state.refreshToken]);

  const value: AuthContextValue = {
    ...state,
    logout,
    setAccessToken,
    setRefreshToken,
    isAccessExpired,
    isRefreshExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for accessing auth context
export const useAuthSession = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthSession must be used within an AuthProvider");
  }

  return context;
};

export default useAuthSession;
