import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Label } from "../components/ui/label";
import { useSignInMutation } from "../src/features/auth/useSignIn";
import useAuthSession from "../src/features/auth/useAuthSession";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

// Define Zod schema
const formSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Infer TypeScript type from the schema
type FormData = z.infer<typeof formSchema>;

export default function Screen() {
  const router = useRouter();
  const { setAccessToken, setRefreshToken, isAuthenticated } = useAuthSession();
  const [googleError, setGoogleError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const signInMutation = useSignInMutation({
    onSuccess: async (data) => {
      await setAccessToken(data.data.accessToken);
      await setRefreshToken(data.data.refreshToken);

      router.replace("/(tabs)");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    // Handle authentication
    signInMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const googleSignIn = async () => {
    try {
      const callbackUrl = Linking.createURL("", { scheme: "legendei" });

      let result = await WebBrowser.openAuthSessionAsync(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/google`,
        callbackUrl
      );

      if (result.type === "success") {
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("accessToken");
        const refreshToken = url.searchParams.get("refreshToken");
        const error = url.searchParams.get("error");

        if (error) {
          setGoogleError(error);
          return;
        }

        if (!accessToken || !refreshToken) {
          console.error("Missing access token or refresh token");
          return;
        }

        await setAccessToken(accessToken);
        await setRefreshToken(refreshToken);

        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Text className="text-2xl font-bold mb-4">Entrar</Text>

      <View className="w-full">
        <Label className="pb-2">Email</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="w-full"
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-destructive mt-1">{errors.email.message}</Text>
        )}
      </View>

      <View className="w-full">
        <Label className="pb-2">Senha</Label>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="w-full"
              placeholder="Senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text className="text-destructive mt-1">
            {errors.password.message}
          </Text>
        )}
      </View>

      {signInMutation.isError && (
        <Text className="text-destructive mt-1">
          {signInMutation.error?.response?.data?.statusCode === 404
            ? "Usuário não encontrado"
            : signInMutation.error?.response?.data?.statusCode === 401
              ? "Senha incorreta"
              : "Erro ao fazer login"}
        </Text>
      )}

      {googleError && (
        <Text className="text-destructive mt-1">{googleError}</Text>
      )}

      <Button className="w-full mt-2" onPress={handleSubmit(onSubmit)}>
        <Text>Entrar</Text>
      </Button>

      {/* Google Sign In Button */}
      <View className="w-full items-center mt-2">
        <Text className="my-4">ou</Text>
        <GoogleSigninButton
          style={{ width: "100%", height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={googleSignIn}
          className="self-center"
        />
      </View>

      <TouchableOpacity
        onPress={() => console.log("Forgot password")}
        className="mt-2"
      >
        <Text className="text-primary">Esquece a senha?</Text>
      </TouchableOpacity>

      <View className="flex-row mt-4">
        <Text>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.replace("/signup")}>
          <Text className="text-primary">Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
