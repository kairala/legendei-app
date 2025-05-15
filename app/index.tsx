import * as React from "react";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/login");
  }, []);
}
