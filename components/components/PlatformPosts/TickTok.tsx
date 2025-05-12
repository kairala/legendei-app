import { Text, View, Image, Pressable } from "react-native";
import {} from "../../ui/text";
import * as ExpoClipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";

type Props = {
  image: string;
  caption: string;
};

export const TickTokPost = ({ image, caption }: Props) => {
  return (
    <View className="w-full bg-black rounded-xl overflow-hidden mb-4">
      {/* Post container */}
      <View className="relative">
        {/* Image area */}
        <Image
          source={{ uri: image }}
          className="w-full aspect-[9/16] bg-gray-800"
          resizeMode="cover"
        />

        {/* Overlay gradient for better text visibility */}
        <View className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Interactive buttons (right side) */}
        <View className="absolute bottom-12 right-3 items-center space-y-4">
          {/* Like button */}
          <View className="items-center">
            <Pressable className="p-1">
              <Text className="text-white text-3xl">❤️</Text>
            </Pressable>
            <Text className="text-white text-xs font-medium">123K</Text>
          </View>

          {/* Comment button */}
          <View className="items-center">
            <Pressable className="p-1">
              <Text className="text-white text-3xl">💬</Text>
            </Pressable>
            <Text className="text-white text-xs font-medium">1.5K</Text>
          </View>

          {/* Share button */}
          <View className="items-center">
            <Pressable className="p-1">
              <Text className="text-white text-3xl">↪️</Text>
            </Pressable>
            <Text className="text-white text-xs font-medium">Compartilhar</Text>
          </View>
        </View>

        {/* Caption area (bottom) */}
        <View className="absolute bottom-4 left-4 right-16 p-1">
          <Text className="text-white font-bold mb-1">@ticktokuser</Text>
          <Text className="text-white text-sm" numberOfLines={2}>
            {caption}
          </Text>
        </View>
      </View>

      {/* Copy caption button */}
      <Pressable
        className="p-4 bg-gray-900 flex-row justify-between items-center"
        onPress={async () => {
          await ExpoClipboard.setStringAsync(caption);
          Toast.success("Legenda copiada para a área de transferência");
        }}
      >
        <Text className="text-white font-medium">Copiar Legenda</Text>
        <View className="bg-gray-700 rounded-full px-3 py-1">
          <Text className="text-white">Copiar</Text>
        </View>
      </Pressable>
    </View>
  );
};
