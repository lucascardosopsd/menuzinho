"use client";
import { ReactElement, ReactNode, cloneElement, useState } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ButtonVariants } from "@/types/button";
import { CategoryProps } from "@/types/category";

interface CategorySheetProps {
  defaultValues?: CategoryProps | undefined;
  triggerText: string | ReactNode;
  triggerVariant: ButtonVariants;
  sheetTitle: string | ReactNode;
  sheetDescription?: string;
  triggerClassname?: string;
  restaurantId?: string;
  categoryForm: ReactElement;
}

const CategorySheet = ({
  triggerText,
  sheetTitle,
  sheetDescription,
  triggerClassname,
  categoryForm,
}: CategorySheetProps) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className={triggerClassname}>
        <Button>{triggerText}</Button>
      </SheetTrigger>

      <SheetContent className="w-svw tablet:w-[50svw]">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetTitle>{sheetDescription}</SheetTitle>
        </SheetHeader>

        {cloneElement(categoryForm, { toggleOpen: toggleOpen })}
      </SheetContent>
    </Sheet>
  );
};

export default CategorySheet;
