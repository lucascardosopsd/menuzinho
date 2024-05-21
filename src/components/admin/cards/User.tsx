"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { FaPen, FaTrash } from "react-icons/fa6";
import DeleteModal from "@/components/restaurant/DeleteModal";
import { toast } from "sonner";
import { UserProps } from "@/types/user";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { deleteUser } from "@/actions/user/deleteUser";
import { usePathname, useSearchParams } from "next/navigation";
import { revalidateRoute } from "@/actions/revalidateRoute";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/tools/copyToClipboard";
import ReusableModal from "@/components/misc/ReusableModal";
import UserForm from "../forms/user";
import { z } from "zod";
import { updateUser } from "@/actions/user/updateUser";
import { userValidatorSchema } from "@/validators/user";
import { useState } from "react";

interface UserCardProps {
  user: UserProps;
  preview?: boolean;
}

const UserCard = ({ user, preview = false }: UserCardProps) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();

  const handleUpdateUser = async (
    data: z.infer<typeof userValidatorSchema>
  ) => {
    setLoading(true);
    try {
      await updateUser({ id: user?.id!, user: data });

      setIsModalOpen(false);

      toast.info("Usuário atualizado");

      revalidateRoute({ fullPath: `${pathname}?${params}` });
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
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
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex gap-5">
          <Avatar>
            <AvatarImage src={user.image!} />
          </Avatar>

          <div className="flex items-center">{user.name}</div>
        </div>

        {!preview && (
          <div className="flex gap-5">
            <Button
              size="icon"
              onClick={() => copyToClipboard(user.id, "", "Id copiado!")}
              className="right-5 top-5"
              variant="secondary"
            >
              ID
            </Button>

            <ReusableModal
              title="Editar usuário"
              trigger={<FaPen />}
              content={
                <UserForm
                  defaultValues={user}
                  onSubmit={handleUpdateUser}
                  loading={loading}
                />
              }
              isOpen={isModalOpen}
              onOpen={setIsModalOpen}
            />

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
        )}
      </CardHeader>
    </Card>
  );
};

export default UserCard;
