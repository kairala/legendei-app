"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useAxios } from "../base/useAxios";

export type SignupResponseType = {};

type Payload = {
  name: string;
  email: string;
  password: string;
};

export const useSignupMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: AxiosResponse<SignupResponseType>) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const axios = useAxios();

  return useMutation<AxiosResponse<SignupResponseType>, AxiosError, Payload>({
    mutationFn: (payload: Payload) => axios.post("/auth/sign-up", payload),
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
