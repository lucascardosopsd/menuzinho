"use client";
import { createNewRestaurant } from "@/actions/restaurant/createNewRestaurant";
import { fetchUserRestaurantsByQuery } from "@/actions/restaurant/fetchUserRestaurantsByQuery";
import ReusableModal from "@/components/misc/ReusableModal";
import { restaurantValidator } from "@/validators/restaurant";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import RestaurantForm from "../forms/Restaurant";
import { Separator } from "@/components/ui/separator";
import { Session } from "@/types/session";
import { Region } from "@prisma/client";
import RestaurantCard from "../cards/Restaurant";
import { RestaurantProps } from "@/types/restaurant";
import { slugGen } from "@/tools/slugGen";

interface RestaurantsListProps {
  session: Session;
  regions: Region[];
  restaurants: RestaurantProps[];
}

const RestaurantsList = ({
  session,
  regions,
  restaurants,
}: RestaurantsListProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleNewRestaurant = async (
    data: z.infer<typeof restaurantValidator>
  ) => {
    setLoading(true);

    const restaurantExists = await fetchUserRestaurantsByQuery({
      where: {
        title: data.title,
      },
    });

    if (restaurantExists[0]) {
      toast.error("Já existe um restaurante com este nome!");
      setLoading(false);
      return;
    }

    try {
      await createNewRestaurant({
        ...data,
        slug: slugGen(data.title),
      });
      toast("Restaurante Criado");
    } catch (error) {
      toast("Ocorreu um erro.");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl">Restaurantes</p>
        <ReusableModal
          title="Novo Restaurante"
          trigger="Novo restaurante"
          isOpen={open}
          onOpen={setOpen}
          content={
            <RestaurantForm
              regions={regions}
              loading={loading}
              onSubmit={handleNewRestaurant}
            />
          }
        />
      </div>

      <Separator className="w-full" />

      {restaurants.length ? (
        <div className="grid grid-cols-1 mobile:grid-cols-1 tablet:grid-cols-4 gap-4 pb-4 tablet:pb-0 h-[65vh] overflow-y-auto">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              restaurant={restaurant!}
              session={session}
              key={restaurant.id}
              regions={regions}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[65svh]">
          <p>Você não tem restaurantes criados.</p>
          <div className="flex">
            <p>👆 Crie um clicando em </p>
            <p className="text-primary ml-1">"Novo Restaurante"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
