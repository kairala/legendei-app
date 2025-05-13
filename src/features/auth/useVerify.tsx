"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useAxios } from "../base/useAxios";

export type VerifyUserResponseType = boolean;

type Payload = {
  email: string;
};

export const useVerifyUserMutation = ({
  onSuccess,
}: {
  onSuccess?: (response: AxiosResponse<VerifyUserResponseType>) => void;
}) => {
  const axios = useAxios();

  return useMutation<
    AxiosResponse<VerifyUserResponseType>,
    AxiosError,
    Payload
  >({
    mutationFn: (payload: Payload) => axios.post("/verify", { body: payload }),
    onSuccess: (response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    },
  });
};
