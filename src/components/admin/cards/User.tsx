"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { z } from "zod";
import { FaTrash } from "react-icons/fa6";
import DeleteModal from "@/components/restaurant/DeleteModal";
import { adValidator } from "@/validators/ad";
import { toast } from "sonner";
import { UserProps } from "@/types/user";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { deleteUser } from "@/actions/user/deleteUser";
import { usePathname, useSearchParams } from "next/navigation";
import { revalidateRoute } from "@/actions/revalidateRoute";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/tools/copyToClipboard";

interface UserCardProps {
  user: UserProps;
}

const UserCard = ({ user }: UserCardProps) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();

  const handleOnSubmit = async (data: z.infer<typeof adValidator>) => {
    try {
      setLoading(true);

      toast.success("Anúncio atualizado");

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteUser({ id: user.id });

      revalidateRoute({ fullPath: `${pathname}?${params}` });

      toast.success("Usuário deletado");

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex">
      <CardHeader className="flex-row items-center justify-between relative">
        <div className="flex gap-5">
          <Avatar>
            <AvatarImage src={user.image!} />
          </Avatar>

          <div className="flex items-center">{user.name}</div>
        </div>

        <div className="flex gap-5">
          <DeleteModal
            action={handleDelete}
            dialogTitle="Apagar usuário"
            triggerText={<FaTrash />}
            dialogDescription={
              <>
                <p>
                  Você está apagando o usuário:{" "}
                  <span className="text-red-500">{user.name}</span>
                </p>
                <p>Deseja continuar?</p>
              </>
            }
          />
        </div>
      </CardHeader>

      <CardContent>
        <Button
          size="icon"
          onClick={() => copyToClipboard(user.id, "", "Id copiado!")}
          className="right-5 top-5"
        >
          id
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
