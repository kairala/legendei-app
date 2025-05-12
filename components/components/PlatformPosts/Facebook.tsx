import { Text, View, Image, Pressable } from "react-native";
import * as ExpoClipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";

type Props = {
  image: string;
  caption: string;
};

export const FacebookPost = ({ image, caption }: Props) => {
  return (
    <View className="bg-white rounded-lg shadow-md mb-4 p-3">
      {/* Header with mock Facebook user */}
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 bg-gray-300 rounded-full mr-2">
          <Image
            source={{ uri: "https://placekitten.com/50/50" }}
            className="w-full h-full rounded-full"
          />
        </View>
        <View>
          <Text className="font-semibold text-sm">Usuário</Text>
          <Text className="text-gray-500 text-xs">Agora</Text>
        </View>
      </View>

      {/* Post caption */}
      <Text className="text-sm mb-3">{caption}</Text>

      {/* Image content */}
      <View className="w-full h-64 bg-gray-200 rounded-md mb-3">
        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-md"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Action buttons */}
      <View className="flex-row justify-between border-t border-b border-gray-200 py-2 mb-2">
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm">Curtida</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm">Comentar</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm">Compartilhar</Text>
        </View>
      </View>

      {/* Copy caption button */}
      <Pressable
        className="bg-blue-500 rounded-md py-2 px-4 self-center"
        onPress={async () => {
          try {
            await ExpoClipboard.setStringAsync(caption);
            Toast.success("Legenda copiada para a área de transferência");
          } catch (error) {
            Toast.error("Falha ao copiar para a área de transferência");
          }
        }}
      >
        <Text className="text-white text-center">Copiar Legenda</Text>
      </Pressable>
    </View>
  );
};
