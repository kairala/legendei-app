import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Input } from "~/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { useSignupMutation } from "../src/features/auth/useSignup";

const signupSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    confirmPassword: z.string().min(1, { message: "Confirme sua senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useSignupMutation({
    onSuccess: () => router.replace("/"),
  });

  const isSubmitting = signupMutation.isPending;

  const onSubmit = async (data: SignupFormData) => {
    signupMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 p-6 justify-center">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-center ">
                Criar Conta
              </Text>
              <Text className="text-base text-center mt-2">
                Preencha os campos abaixo para se cadastrar
              </Text>
            </View>

            <View className="space-y-4">
              {/* Name Field */}
              <View>
                <Text className="mb-2 font-medium">Nome completo</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className={`border rounded-lg ${errors.name ? "border-destructive" : "border-secondary"}`}
                      placeholder="Seu nome completo"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text className="text-destructive mt-1">
                    {errors.name.message}
                  </Text>
                )}
              </View>

              {/* Email Field */}
              <View>
                <Text className="mb-2 font-medium">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className={`border rounded-lg ${errors.name ? "border-destructive" : "border-secondary"}`}
                      placeholder="seu@email.com"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-destructive mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View>
                <Text className="mb-2 font-medium">Senha</Text>
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

              {/* Confirm Password Field */}
              <View>
                <Text className="mb-2 font-medium">Confirmar senha</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className={`border rounded-lg ${errors.confirmPassword ? "border-destructive" : "border-secondary"}`}
                      placeholder="Confirme sua senha"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text className="text-destructive mt-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className={`rounded-lg py-4 mt-4 ${isSubmitting ? "bg-blue-300" : "bg-primary"}`}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white font-bold text-center text-lg">
                    Cadastrar
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <TouchableOpacity
                className="mt-4"
                onPress={() => router.replace("/")}
              >
                <Text className="text-primary text-center">
                  Já tem uma conta? Faça login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
