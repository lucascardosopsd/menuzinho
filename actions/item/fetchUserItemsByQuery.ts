"use server";
import prisma from "@/lib/prisma";
import { useUserSession } from "@/hooks/useUserSession";
import { Prisma } from "@prisma/client";
import { ItemProps } from "@/types/item";
import { revalidatePath } from "next/cache";

export type ItemsQuery = Prisma.ItemFindManyArgs;

interface fetchUserItemsByQueryReturnProps {
  count: number;
  items: ItemProps[];
}

export const fetchUserItemsByQuery = async (
  query: ItemsQuery,
  path?: string
): Promise<fetchUserItemsByQueryReturnProps> => {
  const user = await useUserSession();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const safeQuery = {
    ...query,
    orderBy: {
      title: "asc",
    },
    where: {
      ...query.where,
      title: {
        contains: query.where?.title as string,
        mode: "insensitive",
      },
      description: {
        contains: query.where?.description as string,
        mode: "insensitive",
      },
      price: query.where?.price,
      active: query.where?.active,
      sale: query.where?.sale,
      userId: user.id,
    },
  } satisfies ItemsQuery;

  try {
    const count = await prisma.item.count({
      where: {
        userId: user.id,
      },
    });
    const items = await prisma.item.findMany(safeQuery);

    if (path) revalidatePath(path);
    return { count, items };
  } catch (error) {
    console.log(error);
    throw new Error("Can't fetch items");
  }
};