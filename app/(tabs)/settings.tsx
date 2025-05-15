import * as React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "../../components/ui/button";
import useAuthSession from "../../src/features/auth/useAuthSession";
import { useRouter } from "expo-router";
import { Separator } from "../../components/ui/separator";
import { ScrollView } from "react-native";

export default function Screen() {
  const { logout } = useAuthSession();
  const router = useRouter();

  return (
    <ScrollView className="flex flex-col gap-5 p-6 bg-secondary/30 h-full pb-10">
      <Button onPress={() => router.push("/payment")}>
        <Text>Pagamento</Text>
      </Button>

      <Separator className="my-4" />

      <Button onPress={logout} variant="outline" className="border-destructive">
        <Text>Sair</Text>
      </Button>
    </ScrollView>
  );
}
