"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { StyleName } from "../../components/components/StyleSelect";
import { PlatformName } from "../../components/components/PlatformSelect";

export type GenerateCaptionType = {
  statusCode: 200;
  body: {
    caption: string;
  };
  headers: {
    "Content-Type": "application/json";
  };
};

type Payload = {
  imageUrl: string;
  style: StyleName;
  platform: PlatformName;
};

export const useGenerateCaptionMutation = ({
  onSuccess,
}: {
  onSuccess?: (response: AxiosResponse<GenerateCaptionType>) => void;
}) => {
  return useMutation<AxiosResponse<GenerateCaptionType>, AxiosError, Payload>({
    mutationFn: (payload: Payload) =>
      axios.post(
        "https://fa53irs7pg.execute-api.us-east-1.amazonaws.com/hml/process",
        { body: payload }
      ),
    onSuccess: (response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    },
  });
};
