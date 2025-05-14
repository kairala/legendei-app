import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "../../components/ui/button";
import useAuthSession from "../../src/features/auth/useAuthSession";
import { useRouter } from "expo-router";

export default function Screen() {
  const { logout } = useAuthSession();
  const router = useRouter();

  return (
    <View className="flex flex-col gap-5 p-6 bg-secondary/30 h-full pb-10">
      <Button onPress={logout}>
        <Text>Sair</Text>
      </Button>

      <Button onPress={() => router.push("/payment")}>
        <Text>Pagamento</Text>
      </Button>
    </View>
  );
}
