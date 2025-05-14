import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastManager from "toastify-react-native";
import { AuthProvider } from "../src/features/auth/useAuthSession";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: "Login",
                headerShown: false,
                headerRight: () => <ThemeToggle />,
                headerStyle: {
                  backgroundColor: isDarkColorScheme
                    ? DARK_THEME.colors.background
                    : LIGHT_THEME.colors.background,
                },
              }}
            />

            <Stack.Screen
              name="signup"
              options={{
                title: "Criar conta",
                headerRight: () => <ThemeToggle />,
                headerShown: false,
                headerStyle: {
                  backgroundColor: isDarkColorScheme
                    ? DARK_THEME.colors.background
                    : LIGHT_THEME.colors.background,
                },
              }}
            />

            <Stack.Screen
              name="payment"
              options={{
                title: "Planos",
                headerRight: () => <ThemeToggle />,
                headerStyle: {
                  backgroundColor: isDarkColorScheme
                    ? DARK_THEME.colors.background
                    : LIGHT_THEME.colors.background,
                },
              }}
            />

            <Stack.Screen
              name="(tabs)"
              options={{
                title: "Consiga sua legenda",
                headerShown: false,
                headerRight: () => <ThemeToggle />,
                headerStyle: {
                  backgroundColor: isDarkColorScheme
                    ? DARK_THEME.colors.background
                    : LIGHT_THEME.colors.background,
                },
              }}
            />
          </Stack>
          <PortalHost />
          <ToastManager />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
