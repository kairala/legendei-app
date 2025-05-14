import * as React from "react";
import { useRouter } from "expo-router";
import { z } from "zod";

// Define Zod schema
const formSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Infer TypeScript type from the schema
type FormData = z.infer<typeof formSchema>;

export default function Screen() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/login");
  }, []);
}
