"use client";
import { Item } from "@prisma/client";
import ItemCard from "./cards/Item";
import { adStore } from "@/context/ads";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, useInView, motion } from "framer-motion";
import { createView } from "@/actions/createView";
import AdCard from "./cards/adCard";
import { currentCategoryStore } from "@/context/currentCategory";
import { pickAd } from "@/actions/ad/pickAd";

interface ItemsListProps {
  items: Item[];
  themeColor: string;
  regionId: string;
}

const ItemsList = ({ items, themeColor, regionId }: ItemsListProps) => {
  const { currentAd, setCurrentAd } = adStore();
  const { categoryId } = currentCategoryStore();
  const [adOrder, setAdOrder] = useState(0);

  const adRef = useRef(null);
  const isAdInView = useInView(adRef, { once: true });

  const handlePickAd = async () => {
    const ad = await pickAd({
      regionId: regionId,
    });

    setCurrentAd(ad);
  };

  useEffect(() => {
    handlePickAd();
  }, [regionId]);

  const handleCreateView = () => {
    try {
      createView({
        restaurantId: items[0].restaurantId!,
        adId: currentAd?.id!,
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAd && isAdInView) return handleCreateView();
  }, [isAdInView]);

  useEffect(() => {
    const length = items.filter((item) => item.categoryId == categoryId).length;

    const randomNum = Math.floor(Math.random() * (length - 0 + 1) + 0);

    setAdOrder(randomNum);
  }, [categoryId]);

  return (
    <div className="flex flex-col gap-5">
      <AnimatePresence>
        {items
          .filter((item) => item.categoryId == categoryId)
          .sort((a, b) => Number(b.highlight) - Number(a.highlight))
          .map((item, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span
                style={{
                  order: index,
                }}
              >
                <ItemCard
                  item={item}
                  themeColor={themeColor}
                  key={item.id}
                  highlight={item.highlight}
                />
              </span>
            </motion.div>
          ))}

        {currentAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span
              ref={adRef}
              style={{
                order: adOrder,
              }}
            >
              <AdCard ad={currentAd} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemsList;
