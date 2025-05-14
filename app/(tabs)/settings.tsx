import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "../../components/ui/button";
import useAuthSession from "../../src/features/auth/useAuthSession";

export default function Screen() {
  const { logout } = useAuthSession();

  return (
    <View className="flex flex-col gap-5 p-6 bg-secondary/30 h-full pb-10">
      <Button onPress={logout}>
        <Text>Sair</Text>
      </Button>
    </View>
  );
}
