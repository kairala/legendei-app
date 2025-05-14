"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useAxios } from "../base/useAxios";
import Stripe from "stripe";

export type CreatePaymentIntentResponseType = Stripe.Subscription;

type Payload = {
  priceId: string;
};

export const useCreatePaymentIntentMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    response: AxiosResponse<CreatePaymentIntentResponseType>
  ) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const axios = useAxios();

  return useMutation<
    AxiosResponse<CreatePaymentIntentResponseType>,
    AxiosError,
    Payload
  >({
    mutationFn: (payload: Payload) => axios.post("/stripe/intent", payload),
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
