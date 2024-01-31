import { CategoryProps } from "@/types/category";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import CategorySheet from "./sheets/Category";
import { FaCheck, FaPen, FaTrash } from "react-icons/fa6";
import { Button } from "./ui/button";
import { items } from "@/mock/items";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import ItemCard from "./ItemCard";
import { useItemStore } from "@/context/item";

interface CategoryCardProps {
  category: CategoryProps;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { idList, setAllIds } = useItemStore();

  return (
    <AccordionItem
      className="flex flex-col mx-4 border-none"
      value={category.id.toString()}
    >
      <AccordionTrigger className="flex items-center p-4 h-16 w-full border border-border rounded">
        <p>{category.title}</p>
        <div className="flex gap-4 ml-auto mr-2">
          <CategorySheet
            sheetTitle="Editar Categoria"
            triggerText={<FaPen />}
            triggerVariant="default"
            defaultValues={category}
          />

          <Button variant="destructive">
            <FaTrash />
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col space-y-2 mt-2 ">
          <AnimatePresence>
            {items.filter((item) => item.categoryId == category.id).length >
              1 &&
              idList.length >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex gap-4 px-3">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const categoryItemsId = items
                          .filter((item) => item.categoryId == category.id)
                          .map((item) => item.id);

                        return (
                          <Checkbox
                            checked={idList.length == categoryItemsId.length}
                            onClick={() => {
                              idList.length !== categoryItemsId.length
                                ? setAllIds(categoryItemsId)
                                : setAllIds([]);
                            }}
                          />
                        );
                      })()}

                      <p className="text-mutted">Todos</p>

                      <Separator orientation="vertical" />
                    </div>

                    <Button size="sm">Apagar</Button>

                    <Button size="sm" variant="outline">
                      Transferir
                    </Button>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          <div className="flex items-center gap-4 px-3 text-accent">
            <p>
              <FaCheck />
            </p>
            <p className="flex-[2] pl-4">Nome</p>
            <div className="flex-1 flex gap-4">
              <p className="flex-1">Preço</p>
              <p className="flex-1">Tipo</p>
              <p className="flex-1">Status</p>
              <p className="flex-1 flex justify-center">Ações</p>
            </div>
          </div>
          {items.length > 0 &&
            items
              .filter((item) => item.categoryId == category.id)
              .map((item) => (
                <ItemCard category={category} item={item} key={item.id} />
              ))}
        </div>
        {items.filter((item) => item.categoryId == category.id).length == 0 && (
          <p className="text-center p-4">Categoria sem items.</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategoryCard;
