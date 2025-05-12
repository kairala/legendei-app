import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import * as ImagePicker from "expo-image-picker";
import { Button } from "../components/ui/button";
import * as FileSystem from "expo-file-system";
import {
  PlatformName,
  PlatformSelect,
} from "../components/components/PlatformSelect";
import { StyleName, StyleSelect } from "../components/components/StyleSelect";
import { useUploadFileMutation } from "../src/features/useUploadFile";
import { useGenerateCaptionMutation } from "../src/features/useGenerateCaption";
import { BlockQuote } from "../components/ui/typography";
import { Progress } from "../components/ui/progress";
import { Clipboard } from "~/lib/icons/Clipboard";
import * as ExpoClipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";
import { InstagramPost } from "../components/components/PlatformPosts/Instagram";
import { LinkedinPost } from "../components/components/PlatformPosts/Linkedin";
import { TickTokPost } from "../components/components/PlatformPosts/TickTok";
import { FacebookPost } from "../components/components/PlatformPosts/Facebook";

export default function Screen() {
  const [image, setImage] = React.useState<string | null>(null);
  const [imageBase64, setImageBase64] = React.useState<string | null>(null);
  const [platform, setPlatform] = React.useState<PlatformName>("Instagram");
  const [style, setStyle] = React.useState<StyleName>("criativo");
  const [caption, setCaption] = React.useState<string | null>(null);

  const [mediaLibraryPermissionStatus, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [cameraPermissionStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const uploadFileMutation = useUploadFileMutation({
    onSuccess: (response) => {
      generateCaptionMutation.mutate({
        imageUrl: response.data.body.fileUrl,
        style: style,
        platform: platform,
      });
    },
  });

  const generateCaptionMutation = useGenerateCaptionMutation({
    onSuccess: (response) => {
      setCaption(response.data.body.caption);
    },
  });

  const progress = React.useMemo(() => {
    if (uploadFileMutation.isPending) {
      return 33;
    }

    if (generateCaptionMutation.isPending) {
      return 66;
    }

    return 100;
  }, [uploadFileMutation.isPending, generateCaptionMutation.isPending]);

  const getBase64 = async (uri: string) => {
    if (!uri) {
      return null;
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });

    return `data:image/png;base64,${base64}`;
  };

  React.useEffect(() => {
    if (!imageBase64) {
      return;
    }

    handleSubmit();
  }, [imageBase64]);

  const pickImage = async () => {
    if (!mediaLibraryPermissionStatus?.granted) {
      const permission = await requestMediaLibraryPermission();
      if (!permission.granted) {
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
      selectionLimit: 1,
      allowsMultipleSelection: false,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(await getBase64(result.assets[0].uri));
    }
  };

  const useCamera = async () => {
    if (!cameraPermissionStatus?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 0,
      allowsMultipleSelection: true,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(await getBase64(result.assets[0].uri));
    }
  };

  const handleSubmit = async () => {
    if (!imageBase64) {
      console.log("base64 null");
      return;
    }

    setCaption(null);
    uploadFileMutation.mutate({
      file: imageBase64,
    });
  };

  return (
    <View className="flex flex-col gap-5 p-6 bg-secondary/30 h-full pb-10">
      {!caption && (
        <View className="flex-1 flex flex-col gap-6">
          <View className="flex flex-row gap-5 ">
            <View className="flex-1">
              <PlatformSelect
                value={platform}
                onChange={(value) => {
                  setPlatform(value || "Instagram");
                }}
              />
            </View>

            <View className="flex-1">
              <StyleSelect
                value={style}
                onChange={(value) => {
                  setStyle(value || "criativo");
                }}
              />
            </View>
          </View>

          <View className="flex flex-row gap-5 justify-between">
            <Button onPress={pickImage} className="flex-1">
              <Text>Escolha uma Foto</Text>
            </Button>

            <Button onPress={useCamera} className="flex-1">
              <Text>Use a Câmera</Text>
            </Button>
          </View>

          <View className="flex-1 flex justify-center items-center">
            {uploadFileMutation.isPending && (
              <Text>Fazendo upload da imagem...</Text>
            )}

            {generateCaptionMutation.isPending && (
              <Text>Gerando legenda...</Text>
            )}

            {uploadFileMutation.isPending ||
            generateCaptionMutation.isPending ? (
              <Progress value={progress} className="web:w-[60%]" />
            ) : null}

            {caption && (
              <View className="justify-center items-center gap-5 p-6 bg-secondary/30 flex flex-row">
                <BlockQuote className="flex-1">{caption}</BlockQuote>
                <Button
                  onPress={() => {
                    ExpoClipboard.setStringAsync(caption.replaceAll('"', ""));
                    Toast.success("Copiado com sucesso!");
                  }}
                >
                  <Clipboard className="text-secondary" />
                </Button>
              </View>
            )}
          </View>
        </View>
      )}

      {caption && platform === "Instagram" && image && (
        <View className="flex-1">
          <InstagramPost image={image} caption={caption} />
        </View>
      )}

      {caption && image && platform === "LinkedIn" && (
        <View className="flex-1">
          <LinkedinPost image={image} caption={caption} />
        </View>
      )}

      {caption && image && platform === "TickTok" && (
        <View className="flex-1">
          <TickTokPost image={image} caption={caption} />
        </View>
      )}

      {caption && image && platform === "Facebook" && (
        <View className="flex-1">
          <FacebookPost image={image} caption={caption} />
        </View>
      )}

      <View className="flex flex-row gap-5 justify-between w-full">
        <Button
          variant={"default"}
          disabled={
            uploadFileMutation.isPending ||
            generateCaptionMutation.isPending ||
            !caption
          }
          onPress={() => {
            setImage(null);
            setImageBase64(null);
            setCaption(null);
          }}
          className="flex-1"
        >
          <Text>Limpar</Text>
        </Button>
      </View>
    </View>
  );
}
