import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../base/useAxios";
import { AxiosResponse } from "axios";

export type Plan = "free" | "platinum" | "gold";

export type GetMeType = {
  id: string;
  createdAt: Date;
  currentPlan: Plan;
  email: string;
  name: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  updatedAt: Date;
  verified: boolean;
  usedCaptionsToday: number;
};

export const buildGetMeQueryKey = () => ["me"];

export const useGetMeQuery = () => {
  const axios = useAxios();

  return useQuery<AxiosResponse<GetMeType>>({
    queryKey: buildGetMeQueryKey(),
    queryFn: () => axios.get(`/auth/me`),
  });
};
