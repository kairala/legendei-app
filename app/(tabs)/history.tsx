import * as React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { Text } from "~/components/ui/text";
import { useGetCaptionsQuery } from "../../src/features/ai/useListCaptions";
import { Button } from "../../components/ui/button";
import { Clipboard as ClipboardIcon } from "~/lib/icons/Clipboard";
import * as ExpoClipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";
import { H2 } from "../../components/ui/typography";
import moment from "moment";
import { Card, CardContent } from "../../components/ui/card";
import {} from "react-native-gesture-handler";

export default function Screen() {
  const { data: captionsResponse, isLoading, refetch } = useGetCaptionsQuery();

  const captions = React.useMemo(() => {
    if (!captionsResponse) {
      return [];
    }

    return captionsResponse.data;
  }, [captionsResponse]);

  return (
    <View className="flex flex-col gap-5 p-6 bg-secondary/30 h-full pb-10">
      <H2>Minhas legendas</H2>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : captions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text>Nenhuma legenda encontrada</Text>
        </View>
      ) : (
        <FlatList
          data={captions}
          keyExtractor={(item, index) =>
            item._id?.toString() || index.toString()
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <Card className="p-4 rounded-lg shadow-sm mb-3">
              <CardContent className="p-4 rounded-lg shadow-sm mb-3 flex flex-row gap-4">
                <View className="flex items-center justify-center">
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-24 h-24 rounded-md mb-2"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-medium mb-1">{item.caption}</Text>

                  <Text className="text-xs">
                    {item.createdAt &&
                      moment(item.createdAt).format("DD/MM/YYYY")}
                  </Text>
                </View>

                <View className="flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    onPress={() => {
                      ExpoClipboard.setStringAsync(
                        item.caption.replaceAll('"', "")
                      );
                      Toast.success(
                        "Legenda copiada para a área de transferência"
                      );
                    }}
                  >
                    <ClipboardIcon className="text-foreground" />
                  </Button>
                </View>
              </CardContent>
            </Card>
          )}
          className="w-full"
        />
      )}
    </View>
  );
}
