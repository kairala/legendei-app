import React from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import {
  PaymentSheetError,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import { useGetProductsQuery } from "../src/features/stripe/useGetProducts";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { H1, H2, H3, H4 } from "../components/ui/typography";
import { Button } from "../components/ui/button";
import { useCreatePaymentIntentMutation } from "../src/features/stripe/createPaymentIntent";
import Stripe from "stripe";
import { useGetMeQuery } from "../src/features/auth/useMe";

const width = Dimensions.get("window").width;

const PlanScreen = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { refetch: refetchMe } = useGetMeQuery();

  const { data: products } = useGetProductsQuery();

  const createPaymentIntent = useCreatePaymentIntentMutation({
    onSuccess: async (data) => {
      const clientSecret = (data.data.latest_invoice as Stripe.Invoice)
        .confirmation_secret?.client_secret;
      // Call the Stripe payment sheet here with the client secret
      // @ts-expect-error -- wrong type
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        returnURL: "legendei://payment-sheet",
        allowsDelayedPaymentMethods: false,
      });
      if (error) {
      }

      const { error: errorPayment } = await presentPaymentSheet();
      if (errorPayment) {
        if (errorPayment.code === PaymentSheetError.Failed) {
          // Handle failed
        } else if (errorPayment.code === PaymentSheetError.Canceled) {
          // Handle canceled
        }
      } else {
        // Payment succeeded
      }

      refetchMe();
    },
  });

  const carrouselItems = products?.data.map((product) => ({
    id: product.id,
    imageUrl: product.images[0],
    name: product.name,
    description: product.description,
    price: product.metadata.price,
    features: product.features.map((feature) => ({
      id: feature.id,
      name: feature.entitlement_feature.name,
    })),
    prices: product.prices.map((price) => ({
      id: price.id,
      unit_amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
      interval_count: price.recurring?.interval_count,
      nickname: price.nickname,
      product_id: price.product,
      isDefault: product.default_price === price.id,
    })),
  }));

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Carousel
        ref={ref}
        width={width}
        data={carrouselItems || []}
        loop={false}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.8,
          parallaxScrollingOffset: 100,
        }}
        renderItem={({ index, item }) => {
          return (
            <Card>
              <CardHeader>
                <H1 className="text-primary">{item.name}</H1>
              </CardHeader>

              <CardContent>
                <View className="space-y-4 mb-10">
                  <View className="flex gap-4">
                    {item.features.map((feature) => (
                      <View key={feature.id} className="flex-col items-start">
                        <H3>&#x2022; {feature.name}</H3>
                      </View>
                    ))}
                  </View>
                </View>
              </CardContent>

              <CardFooter>
                <View className="flex-row flex-wrap gap-2 mt-8">
                  {item.prices.map((price) => (
                    <View
                      className="bg-secondary/30 flex-1 flex flex-col gap-10 p-4 rounded-lg"
                      key={price.id}
                    >
                      <H2>{price.interval === "month" ? "Mensal" : "Anual"}</H2>

                      <View className="flex-row items-end gap-2">
                        <H4>R$</H4>
                        <H1 className="text-primary">
                          {((price.unit_amount || 0) / 100).toFixed(2)}
                        </H1>
                      </View>

                      <Button
                        disabled={createPaymentIntent.isPending}
                        onPress={async () => {
                          createPaymentIntent.mutate({ priceId: price.id });
                        }}
                      >
                        {createPaymentIntent.isPending ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <H4>Assinar</H4>
                        )}
                      </Button>
                    </View>
                  ))}
                </View>
              </CardFooter>
            </Card>
          );
        }}
      />
    </View>
  );
};

export default function SignupScreen() {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="legendei" // required for 3D Secure and bank redirects
    >
      <PlanScreen />
    </StripeProvider>
  );
}
