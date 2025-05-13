import { Text, View, Image, Pressable } from "react-native";
import * as ExpoClipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";

type Props = {
  image: string;
  caption: string;
};

export const InstagramPost = ({ image, caption }: Props) => {
  return (
    <View className="bg-white rounded-lg shadow mb-4 w-full max-w-md">
      {/* Post header */}
      <View className="flex-row items-center justify-between p-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-gray-300 mr-2"></View>
          <Text className="font-semibold">usuário</Text>
        </View>
        <Text>•••</Text>
      </View>

      {/* Post image */}
      <View className="w-full aspect-square bg-gray-200">
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
        />
      </View>

      {/* Action buttons */}
      <View className="p-3">
        <View className="flex-row justify-between mb-2">
          <View className="flex-row space-x-4">
            <Text className="text-2xl">♥</Text>
            <Text className="text-2xl">💬</Text>
            <Text className="text-2xl">📤</Text>
          </View>
          <Text className="text-2xl">🔖</Text>
        </View>

        {/* Likes */}
        <Text className="font-semibold mb-1">123 likes</Text>

        {/* Caption */}
        <View className="flex-row flex-wrap">
          <Text className="font-semibold mr-1">usuário</Text>

          <Pressable
            onPress={() => {
              ExpoClipboard.setStringAsync(caption.replaceAll('"', ""));
              Toast.success("Copiado com sucesso!");
            }}
          >
            <Text>{caption}</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => {
            ExpoClipboard.setStringAsync(caption);
            Toast.success("Legenda copiada para a área de transferência");
          }}
          className="p-2"
        >
          <Text className="text-blue-500">Copiar Legenda</Text>
        </Pressable>

        {/* Comments/timestamp */}
        <Text className="text-gray-500 text-sm mt-1">
          Ver todos os 10 comentários
        </Text>
        <Text className="text-gray-400 text-xs mt-1">2 HORAS ATRÁS</Text>
      </View>
    </View>
  );
};
