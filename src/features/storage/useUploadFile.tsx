"use client";

import { useMutation } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import useAuthSession from "../auth/useAuthSession";
import { FileSystemUploadResult } from "expo-file-system";

export type UploadFileResponseType = {
  createdAt: Date;
  fileName: string;
  fileSize: number;
  fileType: string;
  key: string;
  updatedAt: Date;
  url: string;
};

type Payload = {
  image: ImagePickerAsset;
};

export const useUploadFileMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: FileSystemUploadResult) => void;
  onError?: (error: unknown) => void;
}) => {
  const { accessToken } = useAuthSession();

  return useMutation<FileSystemUploadResult, unknown, Payload>({
    mutationFn: ({ image }: Payload) =>
      FileSystem.uploadAsync(
        `${process.env.EXPO_PUBLIC_API_URL}/storage/upload`,
        image.uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          mimeType: image.type,
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),
    onSuccess: (response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });
};
