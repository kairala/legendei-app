import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../base/useAxios";
import { PlatformName } from "../../../components/components/PlatformSelect";
import { StyleName } from "../../../components/components/StyleSelect";
import { AxiosResponse } from "axios";
import * as Network from "expo-network";

export type GetCaptionsResponseType = {
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

export const buildGetCaptionsQueryKey = () => ["captions"];

export const useGetCaptionsQuery = () => {
  const axios = useAxios();
  const { isInternetReachable } = Network.useNetworkState();

  return useQuery<AxiosResponse<GetCaptionsResponseType[]>>({
    queryKey: buildGetCaptionsQueryKey(),
    queryFn: () => axios.get(`/ia/caption`),
    retry: isInternetReachable ? 3 : false,
  });
};
