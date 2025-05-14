export default {
  expo: {
    name: "Legendei",
    slug: "legendei",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "legendei",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "br.com.kairala.legendei",
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: "br.com.kairala.legendei",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          autoHide: true,
          backgroundColor: "#09090b",
          image: "./assets/images/splash.png",
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-9184686440494791~7198467153",
          iosAppId: "ca-app-pub-9184686440494791~5955561886",
        },
      ],
      [
        "expo-web-browser",
        {
          experimentalLauncherActivity: true,
        },
      ],
      [
        "@stripe/stripe-react-native",
        {
          merchantIdentifier: "merchant.com.kairala.legendei",
          enableGooglePay: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "567353ce-f440-48dc-86ba-60a08d6d7d44",
      },
    },
  },
};
