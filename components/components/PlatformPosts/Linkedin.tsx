import { Text, View, Image, Pressable } from "react-native";

import * as ExpoClipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";

type Props = {
  image: string;
  caption: string;
};

export const LinkedinPost = ({ image, caption }: Props) => {
  return (
    <View className="bg-white rounded-xl shadow-md w-full mb-4">
      {/* Header section */}
      <View className="flex-row p-4 items-center">
        <View className="h-12 w-12 rounded-full bg-gray-300 mr-3 overflow-hidden">
          <Image
            source={{ uri: "https://placehold.co/100x100" }}
            className="h-full w-full"
          />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-sm">Usuário</Text>
          <Text className="text-gray-500 text-xs">Profissional • Conexão</Text>
          <Text className="text-gray-500 text-xs">2h • 🌍</Text>
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
      </View>

      {/* Content section */}
      <View className="px-4 py-2">
        <Text className="text-sm mb-3">{caption}</Text>
        {image && (
          <View className="h-64 w-full overflow-hidden bg-gray-100">
            <Image
              source={{ uri: image }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      {/* Footer section */}
      <View className="border-t border-gray-200 mt-2">
        <View className="flex-row justify-between px-2 py-3">
          <Pressable className="flex-row items-center px-2">
            <Text className="text-gray-600 text-sm">👍 Curtir</Text>
          </Pressable>
          <Pressable className="flex-row items-center px-2">
            <Text className="text-gray-600 text-sm">💬 Comentar</Text>
          </Pressable>
          <Pressable className="flex-row items-center px-2">
            <Text className="text-gray-600 text-sm">↪️ Compartilhar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
