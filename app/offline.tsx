import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { NoInternet } from "../lib/icons/NoInternet";
import * as Network from "expo-network";
import { Button } from "../components/ui/button";

export default function OfflinePage() {
  const router = useRouter();
  const { isInternetReachable } = Network.useNetworkState();

  return (
    <SafeAreaView className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <View className="items-center">
        <View className="h-40 w-40 items-center justify-center mb-6 rounded-full bg-secondary">
          <NoInternet />
        </View>
        <Text className="text-2xl font-bold mb-2 text-center">
          Sem Conexão com a Internet
        </Text>
        <Text className="text-gray-600 mb-8 text-center px-6">
          Por favor, verifique sua conexão e tente novamente.
        </Text>
        <Button
          disabled={!isInternetReachable}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }

            router.dismissTo("/login");
          }}
        >
          <Text className="text-white font-medium">Tentar Novamente</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
