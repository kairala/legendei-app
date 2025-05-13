import * as React from "react";
import { Platform, View } from "react-native";
import { Text } from "~/components/ui/text";
import * as ImagePicker from "expo-image-picker";
import { Button } from "~/components/ui/button";
import {
  PlatformName,
  PlatformSelect,
} from "~/components/components/PlatformSelect";
import { StyleName, StyleSelect } from "~/components/components/StyleSelect";
import {
  UploadFileResponseType,
  useUploadFileMutation,
} from "~/src/features/storage/useUploadFile";
import { useGenerateCaptionMutation } from "~/src/features/ai/useGenerateCaption";
import { Progress } from "~/components/ui/progress";
import { InstagramPost } from "~/components/components/PlatformPosts/Instagram";
import { LinkedinPost } from "~/components/components/PlatformPosts/Linkedin";
import { TickTokPost } from "~/components/components/PlatformPosts/TickTok";
import { FacebookPost } from "~/components/components/PlatformPosts/Facebook";
import { ImagePickerAsset } from "expo-image-picker";
import { TestIds, useInterstitialAd } from "react-native-google-mobile-ads";
import { adUnits } from "../../components/ads/units";

export default function Screen() {
  const [image, setImage] = React.useState<ImagePickerAsset | null>(null);
  const [platform, setPlatform] = React.useState<PlatformName>("Instagram");
  const [style, setStyle] = React.useState<StyleName>("criativo");
  const [caption, setCaption] = React.useState<string | null>(null);
  const { isLoaded, load, show } = useInterstitialAd(
    __DEV__
      ? TestIds.INTERSTITIAL
      : Platform.OS === "android"
        ? adUnits.INTERISTICAL.ANDROID
        : adUnits.INTERISTICAL.IOS,
    {
      requestNonPersonalizedAdsOnly: true,
    }
  );

  React.useEffect(() => {
    if (isLoaded) {
      return;
    }
    load();
  }, [load, isLoaded]);

  const [mediaLibraryPermissionStatus, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [cameraPermissionStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const uploadFileMutation = useUploadFileMutation({
    onSuccess: (response) => {
      const body = JSON.parse(response.body) as UploadFileResponseType;
      generateCaptionMutation.mutate({
        imageUrl: body.url,
        style: style,
        network: platform,
      });
    },
  });

  const generateCaptionMutation = useGenerateCaptionMutation({
    onSuccess: (response) => {
      setCaption(response.data.caption);
    },
    onError: (e) => {
      console.log("Error generating caption", e.response);
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

  React.useEffect(() => {
    if (!image) {
      return;
    }

    handleSubmit();
  }, [image]);

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
      setImage(result.assets[0]);
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
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      return;
    }

    setCaption(null);

    uploadFileMutation.mutate({
      image,
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
          </View>
        </View>
      )}

      {caption && platform === "Instagram" && image && (
        <View className="flex-1">
          <InstagramPost image={image.uri} caption={caption} />
        </View>
      )}

      {caption && image && platform === "LinkedIn" && (
        <View className="flex-1">
          <LinkedinPost image={image.uri} caption={caption} />
        </View>
      )}

      {caption && image && platform === "TickTok" && (
        <View className="flex-1">
          <TickTokPost image={image.uri} caption={caption} />
        </View>
      )}

      {caption && image && platform === "Facebook" && (
        <View className="flex-1">
          <FacebookPost image={image.uri} caption={caption} />
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
            setCaption(null);
            if (isLoaded) {
              show();
            }
          }}
          className="flex-1"
        >
          <Text>Limpar</Text>
        </Button>
      </View>
    </View>
  );
}
