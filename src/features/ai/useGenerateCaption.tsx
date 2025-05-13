"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { StyleName } from "~/components/components/StyleSelect";
import { PlatformName } from "~/components/components/PlatformSelect";
import { useAxios } from "../base/useAxios";

export type GenerateCaptionType = {
  caption: string;
};

type Payload = {
  imageUrl: string;
  style: StyleName;
  network: PlatformName;
};

export const useGenerateCaptionMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: AxiosResponse<GenerateCaptionType>) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const axios = useAxios();

  return useMutation<AxiosResponse<GenerateCaptionType>, AxiosError, Payload>({
    mutationFn: (payload: Payload) => axios.post("/ia/caption", payload),
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
