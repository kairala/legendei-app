import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";

const GITHUB_AVATAR_URI =
  "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

export default function Screen() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/upload");
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Button onPress={() => router.replace("/upload")}>
        <Text>Entrar</Text>
      </Button>
    </View>
  );
}
