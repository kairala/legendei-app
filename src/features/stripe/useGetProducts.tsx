import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../base/useAxios";
import { PlatformName } from "../../../components/components/PlatformSelect";
import { StyleName } from "../../../components/components/StyleSelect";
import { AxiosResponse } from "axios";
import Stripe from "stripe";
import * as Network from "expo-network";

export type GetProductsResponseType = {
  _id: string;
  imageUrl: string;
  style: StyleName;
  network: PlatformName;
  executionTime: number;
  caption: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

export const buildGetProductsQueryKey = () => ["captions"];

export const useGetProductsQuery = () => {
  const axios = useAxios();
  const { isInternetReachable } = Network.useNetworkState();

  return useQuery<
    AxiosResponse<
      (Stripe.Product & {
        prices: Stripe.Price[];
        features: Stripe.ProductFeature[];
      })[]
    >
  >({
    queryKey: buildGetProductsQueryKey(),
    queryFn: () => axios.get(`/stripe/products`),
    retry: isInternetReachable ? 3 : false,
  });
};
