"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useAxios } from "../base/useAxios";
import { ErrorResponseType } from "../../types/errorResponse";

export type SignupResponseType = {
  accessToken: string;
  refreshToken: string;
};

type Payload = {
  email: string;
  password: string;
};

export const useSignInMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: AxiosResponse<SignupResponseType>) => void;
  onError?: (error: AxiosError<ErrorResponseType>) => void;
}) => {
  const axios = useAxios();

  return useMutation<
    AxiosResponse<SignupResponseType>,
    AxiosError<ErrorResponseType>,
    Payload
  >({
    mutationFn: (payload: Payload) => axios.post("/auth/sign-in", payload),
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
