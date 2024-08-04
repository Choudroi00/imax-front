import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Wishlist } from "@/types";
import { useTranslation } from "react-i18next";
import { ProductPrice } from "@/types/Dashboard";
import { useStateContext } from "@/contexts/ContextProvider";

export const WishlistCard = ({
  product,
  handleDeleteProduct,
}: {
  product: Wishlist;
  handleDeleteProduct: (id: string | number) => void;
}) => {
  const { t, i18n } = useTranslation("translation");
  const { language } = i18n;
  const { currency } = useStateContext();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Button onClick={() => handleDeleteProduct(product.id)}>
            <img src="/icons/xmark-2.svg" alt="xmark" width={22} height={22} />
          </Button>
          <div className="flex items-start gap-5">
            <img
              src="/images/playstation2.png"
              alt="playstation"
              width={105}
              height={120}
              className="object-cover rounded-xl w-[105px] h-[120px]"
            />
            <div className="block">
              <Link
                to={"/shop/product/" + product.slug}
                className="text-neutral-700 text-lg font-normal tracking-tight"
              >
                {language == "en"
                  ? product.title_en
                  : language == "fr"
                  ? product.title_fr
                  : product.title_ar}
              </Link>
              <p className="mt-3 text-zinc-500 text-sm font-normal">
                CATEGORY:{" "}
                {language == "en"
                  ? product.category.category_en
                  : language == "fr"
                  ? product.category.category_fr
                  : product.category.category_ar}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <span className="text-zinc-500 text-[22px] font-normal tracking-wide">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency?.name,
            }).format(Number(product.prices[currency.name as keyof ProductPrice]))}
          </span>
          <Button className="px-5 h-[45px] bg-blue-600 rounded-lg">
            <span className="text-center text-white text-lg font-medium">
              {t("add to cart")}
            </span>
          </Button>
        </div>
      </div>
      <hr className="w-full h-px bg-gray-200 my-5" />
    </>
  );
};
