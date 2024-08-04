import type { Wishlist as WishlistType } from "@/types";
import { TabsContent } from "../ui/tabs";
import { WishlistCard } from "./WishlistCard";
import { WishlistEmpty } from "./WishlistEmpty";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import axiosClient from "@/axios";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { Skeleton } from "../ui/skeleton";

export const Wishlist = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "profile",
  });
  const link = "/wishlists";
  const fetcher = async () => {
    const response = await axiosClient.get(link);
    return response.data;
  };

  const { data, mutate, isLoading, error } = useSWR(link, fetcher);
  const wishlists: WishlistType[] = data?.wishlists ?? [];

  const handleDeleteProduct = (id: string | number) => {
    axiosClient
      .post("/wishlists/" + id)
      .then((response) => {
        toast("Success!", {
          description: response.data.message || "Product Removed from wishlist",
          className: "bg-green-600 border-0",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
        mutate();
      })
      .catch((error) => {
        toast("Error!", {
          description: error.response?.data?.message || "An error occurred",
          className: "bg-red-600 border-0",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
      });
  };

  if (error) {
    return <div>Error loading wishlists</div>;
  }

  return (
    <TabsContent value="wishlist">
      <Toaster />
      {isLoading && (
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, index) => (
            <div className="flex items-center justify-between" key={index}>
              <div className="flex items-center gap-8">
                <Skeleton className="size-6 rounded-full" />
                <div className="flex items-start gap-5">
                  <Skeleton className="rounded-xl w-[105px] h-[120px]" />
                  <div className="block">
                    <Skeleton className="rounded w-[195px] h-[28px]" />
                    <Skeleton className="rounded w-[115px] h-[20px] mt-3" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <Skeleton className="rounded w-[105px] h-[24px]" />
                <Skeleton className="rounded w-[135px] h-[45px]" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && wishlists?.length > 0 ? (
        <>
          <h3 className="text-neutral-700 text-[28px] font-normal leading-[33.50px] tracking-wide">
            {t("wishlist")}
          </h3>
          <div className="flex flex-col mt-10 gap-5">
            {wishlists.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                handleDeleteProduct={handleDeleteProduct}
              />
            ))}
          </div>
        </>
      ) : (
        !isLoading && <WishlistEmpty />
      )}
    </TabsContent>
  );
};
