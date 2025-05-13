import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Quote } from "../../lib/icons/QuoteIcon";
import { HistoryIcon } from "../../lib/icons/HistoryIcon";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { adUnits } from "../../components/ads/units";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
        }}
      >
        <Tabs.Screen
          name="history"
          options={{
            title: "",
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ focused }) => {
              return (
                <HistoryIcon
                  className={focused ? "text-primary" : "text-foreground"}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            title: "",
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ focused }) => {
              return (
                <Quote
                  className={focused ? "text-primary" : "text-foreground"}
                />
              );
            },
          }}
        />
      </Tabs>

      <BannerAd
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        unitId={
          __DEV__
            ? TestIds.BANNER
            : Platform.OS === "android"
              ? adUnits.BANNER.ANDROID
              : adUnits.BANNER.IOS
        }
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          networkExtras: {
            collapsible: "bottom",
          },
        }}
      />
    </>
  );
}
