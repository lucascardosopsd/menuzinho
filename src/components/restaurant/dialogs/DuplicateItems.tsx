import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useItemStore } from "@/context/item";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createNewItem } from "@/actions/item/createNewItem";
import { ImSpinner2 } from "react-icons/im";
import { revalidateRoute } from "@/actions/revalidateRoute";
import { useUserSession } from "@/hooks/useUserSession";
import { fetchSubscriptionsByQuery } from "@/actions/subscription/fetchManySubscriptions";
import { planLimits } from "@/constants/planLimits";
import { SubscriptionWithPlanProps } from "@/types/subscription";
import { fetchItemsByQuery } from "@/actions/item/fetchItemsByQuery";

interface CustomFetchSubscriptionsByQueryResProps {
  subscriptions: SubscriptionWithPlanProps[];
  pages: number;
}

const DuplicateItemsDialog = () => {
  const { idList, setAllIds } = useItemStore();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDuplicate = async () => {
    setLoading(true);
    toast(
      <div className="flex gap-2 items-center">
        <p>Duplicando itens</p>
        <ImSpinner2 className="animate-spin" />
      </div>
    );
    try {
      const user = await useUserSession();

      const items = await fetchItemsByQuery({ where: { userId: user?.id } });

      const { subscriptions } =
        await fetchSubscriptionsByQuery<CustomFetchSubscriptionsByQueryResProps>(
          {
            page: 0,
            take: 1,
            query: {
              where: { userId: user?.id },
              include: {
                Plan: true,
              },
            },
          }
        );

      const limits = planLimits[subscriptions[0].Plan.alias];

      if (idList.length > 1) {
        for (const id of idList) {
          const { id: currentId, ...rest } = items.filter(
            (item) => item.id == id
          )[0];

          if (items.length >= limits.items) {
            toast.info("Limite de itens atingido");

            break;
          }

          if (currentId) {
            await createNewItem({
              data: {
                ...rest,
              },
            });

            revalidateRoute({ fullPath: pathname });
          }

          toast(`Item ${items[0].title} duplicado.`);
        }
        toast("Duplicações completas!");

        return;
      }

      if (items.length >= limits.items) {
        toast.info("Limite de itens atingido");

        return;
      }

      const { id: _, ...rest } = items.filter(
        (item) => item.id == idList[0]
      )[0];

      await createNewItem({ data: { ...rest } });
      revalidateRoute({ fullPath: pathname });

      toast(`Item ${items[0].title} duplicado.`);
    } catch (error) {
      toast("Erro ao duplicar itens");
      throw new Error("Error when duplicate items");
    } finally {
      setAllIds([]);
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Duplicar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Duplicar {idList.length == 1 ? "item" : "Items"}
          </DialogTitle>
          <DialogDescription>
            <p>
              {idList.length == 1
                ? "Você está duplicando um item, deseja continuar?"
                : "Você está duplicando uma lista de items, tem certeza que deseja continuar?"}
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={handleDuplicate} disabled={loading}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateItemsDialog;
