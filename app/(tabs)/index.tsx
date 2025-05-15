import * as React from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import * as ImagePicker from "expo-image-picker";
import { Button } from "~/components/ui/button";
import {
  PlatformName,
  PlatformSelect,
} from "~/components/components/PlatformSelect";
import { StyleSelect } from "~/components/components/StyleSelect";
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
import { useGetMeQuery } from "../../src/features/auth/useMe";
import { H4 } from "../../components/ui/typography";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { cn } from "../../lib/utils";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "../../components/ui/badge";
import { Trash2 } from "../../lib/icons/TrashIcon";

const formSchema = z.object({
  numberOfCharacters: z.coerce
    .number()
    .min(50, "Número de caracteres é obrigatório")
    .max(500, "Número máximo de caracteres é 500"),
  platform: z.enum(["Instagram", "LinkedIn", "TickTok", "Facebook"]),
  style: z.enum(["criativo", "engraçado", "informativo"]),
  keywords: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

export default function Screen() {
  const [image, setImage] = React.useState<ImagePickerAsset | null>(null);

  const [caption, setCaption] = React.useState<string | null>(null);
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const [currentKeyword, setCurrentKeyword] = React.useState<string>("");
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

  const {
    control,
    getValues,
    formState: { errors },
    reset,
    handleSubmit: submitForm,
  } = useForm<FormData>({
    defaultValues: {
      numberOfCharacters: 150,
      platform: "Instagram",
      style: "criativo",
      keywords: [],
    },
    resolver: zodResolver(formSchema),
  });

  const { data: me, refetch: refetchMe } = useGetMeQuery();

  const currentPlan = React.useMemo(() => {
    if (!me?.data) {
      return "free";
    }
    return me.data.currentPlan;
  }, [me?.data]);

  const totalCaptions = React.useMemo(() => {
    if (!currentPlan || currentPlan === "free") {
      return 2;
    }
    if (currentPlan === "gold") {
      return 5;
    }

    if (currentPlan === "platinum") {
      return -1;
    }

    return 2;
  }, [currentPlan]);

  const canCreateCaption = React.useMemo(() => {
    if (!totalCaptions || !me?.data) {
      return false;
    }

    const { usedCaptionsToday } = me.data;
    if (currentPlan === "platinum") {
      return true;
    }
    if (currentPlan === "free") {
      return usedCaptionsToday < 2;
    }
    if (currentPlan === "gold") {
      return usedCaptionsToday < 5;
    }
    return usedCaptionsToday < 2;
  }, [me?.data, totalCaptions]);

  const buildCaptionLimit = () => {
    if (!totalCaptions || !me?.data) {
      return null;
    }

    const { usedCaptionsToday } = me.data;

    if (currentPlan === "platinum") {
      return null;
    }

    return (
      <View>
        <View className="flex flex-row items-center justify-center">
          <H4 className="">Você usou </H4>
          <H4
            className={`font-bold ${usedCaptionsToday < totalCaptions ? "" : "text-destructive"}`}
          >
            {usedCaptionsToday}
          </H4>
          <H4 className=""> de </H4>
          <H4 className="font-bold">{totalCaptions}</H4>
          <H4 className=""> legendas hoje.</H4>
        </View>
        {usedCaptionsToday >= totalCaptions ? (
          <H4 className="mt-5 text-center border-2 p-4 rounded-xl border-muted-foreground border-dashed">
            Clique aqui{"\n"}e altere seu plano para criar mais
          </H4>
        ) : null}
      </View>
    );
  };

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
        style: getValues("style"),
        network: getValues("platform") as PlatformName,
        numberOfCharacters: Number(getValues("numberOfCharacters") || 150),
        keywords: getValues("keywords"),
      });
    },
  });

  const generateCaptionMutation = useGenerateCaptionMutation({
    onSuccess: (response) => {
      setCaption(response.data.caption);
      refetchMe();
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
        Toast.error("Precisamos de permissão para acessar sua galeria.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
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
      try {
        const permission = await requestCameraPermission();
        if (!permission.granted) {
          Toast.error("Precisamos de permissão para acessar sua câmera.");
          return;
        }
      } catch (err) {
        console.log("Error requesting camera permission", err);
        Toast.error("Erro ao solicitar permissão para acessar a câmera.");
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
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

  const onSubmit = (data: FormData) => {
    const options = ["Câmera", "Galeria", "Cancelar"];
    const cancelButtonIndex = 2;
    const cameraIndex = 0;
    const galleryIndex = 1;

    if (!canCreateCaption) {
      router.push("/payment");
      return;
    }

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case cameraIndex:
            useCamera();
            break;
          case galleryIndex:
            pickImage();
            break;
          case cancelButtonIndex:
            // Cancel button pressed
            break;
          default:
            // Handle other options if needed
            break;
        }
      }
    );
  };

  return (
    <View className="flex flex-col gap-5 p-6 bg-secondary/30 h-full pb-10">
      {!caption && (
        <View className="flex-1 flex flex-col gap-6 h-full ">
          <View className="flex flex-row gap-5 ">
            <View className="flex-1">
              <Controller
                control={control}
                name="platform"
                render={({ field: { onChange, value } }) => (
                  <PlatformSelect
                    value={value}
                    onChange={(value) => {
                      onChange(value || "Instagram");
                    }}
                  />
                )}
              />
              {errors.platform && (
                <Text className="text-destructive mt-1">
                  {errors.platform.message}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Controller
                control={control}
                name="style"
                render={({ field: { onChange, value } }) => (
                  <StyleSelect
                    value={value}
                    onChange={(value) => {
                      onChange(value || "criativo");
                    }}
                  />
                )}
              />
              {errors.style && (
                <Text className="text-destructive mt-1">
                  {errors.style.message}
                </Text>
              )}
            </View>
          </View>
          <View>
            <Label className="mb-2">
              <Text># Caracteres</Text>
            </Label>
            <Controller
              control={control}
              name="numberOfCharacters"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={
                    currentPlan !== "free"
                      ? "#Caracteres"
                      : "Disponível apenas no plano pago"
                  }
                  onChangeText={onChange}
                  value={currentPlan !== "free" ? value.toString() : undefined}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  editable={currentPlan !== "free"}
                />
              )}
            />
            {errors.numberOfCharacters && (
              <Text className="text-destructive mt-1">
                {errors.numberOfCharacters.message}
              </Text>
            )}
          </View>

          <View>
            <Label className="mb-2">
              <Text>Palavras Chave</Text>
            </Label>
            <Controller
              control={control}
              name="keywords"
              render={({ field: { onChange, value } }) => (
                <>
                  <Input
                    placeholder={
                      currentPlan !== "free"
                        ? "Palavras chave"
                        : "Disponível apenas no plano pago"
                    }
                    value={currentKeyword}
                    onChangeText={setCurrentKeyword}
                    editable={currentPlan !== "free"}
                    onEndEditing={(e) => {
                      if (!currentKeyword) {
                        return;
                      }
                      if (value.includes(currentKeyword)) {
                        Toast.warn("Palavra chave já existe");
                        return;
                      }
                      onChange([...value, currentKeyword]);
                      setCurrentKeyword("");
                    }}
                  />
                  <ScrollView horizontal>
                    <View className="flex flex-row gap-2 mt-2">
                      {value.map((keyword, index) => (
                        <Badge
                          key={`remove-keyword-${index}`}
                          className="h-8 flex items-center justify-center"
                        >
                          <TouchableOpacity
                            onPress={() => {
                              const newKeywords = [...value];
                              newKeywords.splice(index, 1);
                              onChange(newKeywords);
                            }}
                            className="flex flex-row items-center justify-center gap-2"
                          >
                            <Text className="text-lg">{keyword}</Text>
                            <Trash2 className="color-secondary" size={18} />
                          </TouchableOpacity>
                        </Badge>
                      ))}
                    </View>
                  </ScrollView>
                </>
              )}
            />
          </View>

          <TouchableOpacity
            className="flex-1"
            disabled={
              uploadFileMutation.isPending || generateCaptionMutation.isPending
            }
            onPress={submitForm(onSubmit)}
          >
            <View
              className={cn(
                "h-full w-full bg-secondary flex justify-center items-center rounded-2xl border-dashed border-2",
                canCreateCaption ? "border-primary" : "border-destructive"
              )}
            >
              {uploadFileMutation.isPending ||
              generateCaptionMutation.isPending ? (
                <View className="flex-1 flex justify-center items-center h-auto w-full p-6">
                  {uploadFileMutation.isPending && (
                    <Text>Fazendo upload da imagem...</Text>
                  )}

                  {generateCaptionMutation.isPending && (
                    <Text>Gerando legenda...</Text>
                  )}

                  <Progress value={progress} />
                </View>
              ) : (
                <View>
                  {canCreateCaption && (
                    <H4 className="font-normal">
                      Escolha a imagem para gerar a legenda
                    </H4>
                  )}
                  {buildCaptionLimit()}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {caption && getValues("platform") === "Instagram" && image && (
        <View className="flex-1">
          <InstagramPost image={image.uri} caption={caption} />
        </View>
      )}

      {caption && getValues("platform") === "LinkedIn" && image && (
        <View className="flex-1">
          <LinkedinPost image={image.uri} caption={caption} />
        </View>
      )}

      {caption && image && getValues("platform") === "TickTok" && (
        <View className="flex-1">
          <TickTokPost image={image.uri} caption={caption} />
        </View>
      )}

      {caption && image && getValues("platform") === "Facebook" && (
        <View className="flex-1">
          <FacebookPost image={image.uri} caption={caption} />
        </View>
      )}

      {caption && (
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
              reset({
                numberOfCharacters: 150,
                platform: "Instagram",
                style: "criativo",
                keywords: [],
              });
              if (isLoaded && me?.data.currentPlan === "free") {
                show();
              }
            }}
            className="flex-1"
          >
            <Text>Voltar</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
