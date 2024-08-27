"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteCategory = async (
  id: string,
  restaurantId: string,
  path?: string
) => {
  try {
    await prisma.category.delete({
      where: {
        id,
        restaurantId,
      },
    });

    path && revalidatePath(path);
  } catch (error) {
    throw new Error("Can't delete restaurant");
  }
};
