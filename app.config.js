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
      edgeToEdgeEnabled: true,
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
          backgroundColor: "#FFF9CC",
          image: "./assets/images/splash.png",
          resizeMode: "contain",
          imageWidth: 200,
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Permirtir o uso do Face ID para desbloquear o aplicativo Legendei.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Legendei as imagens para podermos gerar legendas para você. Suas fotos serão armazenadas de forma segura e não serão compartilhadas com ninguém.",
          cameraPermission:
            "Legendei a câmera para tirar fotos e podermos gerar legendas para você. Suas fotos serão armazenadas de forma segura e não serão compartilhadas com ninguém.",
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
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "mobile",
          organization: "legendei",
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
