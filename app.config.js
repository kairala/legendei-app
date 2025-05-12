const IS_DEV = process.env.LENGENDEI_ENV === "dev";
const IS_STAGING = process.env.LENGENDEI_ENV === "staging";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "br.com.kairala.legendei.dev";
  }

  if (IS_STAGING) {
    return "br.com.kairala.legendei.staging";
  }

  return "br.com.kairala.legendei";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Legendei (Dev)";
  }

  if (IS_STAGING) {
    return "Legendei (Staging)";
  }

  return "Legendei";
};

export default {
  expo: {
    name: getAppName(),
    slug: "legendei",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "legendei",
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: getUniqueIdentifier(),
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
