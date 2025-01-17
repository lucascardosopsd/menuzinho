import { fetchUserRestaurants } from "@/actions/restaurant/fetchUserRestaurants";
import RestaurantsList from "@/components/restaurant/lists/Restaurants";
import { fetchSubscriptionsByQuery } from "@/actions/subscription/fetchManySubscriptions";
import { SubscriptionWithPlanProps } from "@/types/plan";
import { planLimits } from "@/constants/planLimits";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface CustomFetchSubscriptionsByQueryResProps {
  subscriptions: SubscriptionWithPlanProps[];
  pages: number;
}

export default async function Dashboard() {
  const user = await useCurrentUser();
  const restaurants = await fetchUserRestaurants();

  const { subscriptions } =
    await fetchSubscriptionsByQuery<CustomFetchSubscriptionsByQueryResProps>({
      page: 0,
      take: 10,
      query: {
        where: { userId: user?.id },
        include: {
          Plan: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    });

  const limits = planLimits[subscriptions[0]?.Plan?.alias || "free"];

  return (
    <main className="flex flex-col items-center justify-center h-[calc(100svh-4rem)] gap-8 ">
      <RestaurantsList restaurants={restaurants!} limits={limits} />
    </main>
  );
}
