"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

export type UploadFileResponseType = {
  statusCode: 200;
  body: {
    message: string;
    fileUrl: string;
  };
  headers: {
    "Content-Type": "application/json";
  };
};

type Payload = {
  file: string;
};

export const useUploadFileMutation = ({
  onSuccess,
}: {
  onSuccess?: (response: AxiosResponse<UploadFileResponseType>) => void;
}) => {
  return useMutation<
    AxiosResponse<UploadFileResponseType>,
    AxiosError,
    Payload
  >({
    mutationFn: (payload: Payload) =>
      axios.post(
        "https://fa53irs7pg.execute-api.us-east-1.amazonaws.com/hml/upload",
        payload
      ),
    onSuccess: (response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    },
  });
};
