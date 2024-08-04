import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { useStateContext } from "@/contexts/ContextProvider";
import { ProductPrice } from "@/types/Dashboard";

export const ProductCard = ({ product }: { product: Product }) => {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const { currency } = useStateContext();

  const curr = JSON.parse( localStorage.currency )
  const rate = parseFloat(curr.value)

  //console.log(curr);
  

  return (
    <div className="relative">
      {product.availability == "out of stock" && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-red-600 px-2 py-1 rounded-md">
          Out of Stock
        </span>
      )}
      <div
        className={cn(
          "flex py-3 px-4 gap-2 flex-col items-center justify-center rounded-xl bg-white shadow",
          product.availability == "out of stock"
            ? "filter grayscale cursor-not-allowed"
            : ""
        )}
      >
        <Link to={"/shop/product/" + product.slug} className="block">
          <img
            src={product.image}
            alt={product.title_en}
            width={271}
            height={281}
            loading="lazy"
            className="object-cover h-[281px] rounded w-full"
          />
        </Link>
        <div className="w-full">
          <Link
            to={"/shop/product/" + product.slug}
            className="text-xl font-bold uppercase text-black/85"
          >
            {language == "en"
              ? product.title_en
              : language == "fr"
              ? product.title_fr
              : product.title_ar}
          </Link>
          <p
            className={cn(
              "text-xs font-medium line-clamp-2 capitalize mt-3",
              language == "ar" ? "text-right" : "text-left"
            )}
          >
            {language == "en"
              ? product.description_en
              : language == "fr"
              ? product.description_fr
              : product.description_ar}{" "}
            <Link
              to={"/shop/product/" + product.slug}
              className="text-blue-600 capitalize"
            >
              View More
            </Link>
          </p>
          <div className="flex mt-3 items-center w-full">
            {product.discount ? (
              <div className="flex gap-2 items-center">
                <del className="text-black/60 text-xs font-medium">
                  {product.base_ref_price ? (parseFloat(product.base_ref_price)+(parseFloat(product.base_ref_price)) * (product.discount/100) )  * rate  : 0} &nbsp;{curr.name.toUpperCase()}
                </del>
                <span className="text-black/85 text-lg font-semibold">
                { parseFloat(product.base_ref_price ?? '0') * rate} &nbsp;{curr.name.toUpperCase()}
                </span>
              </div>
            ) : (
              <span className="text-black/85 text-lg font-semibold">
                
                {product.base_ref_price ? (parseFloat(product.base_ref_price)  * rate)   : 0} &nbsp;{curr.name.toUpperCase()}
              </span>
            )}
          </div>
          <Button
            className="w-full py-3 px-5 bg-blue-600 rounded-md text-white mt-1"
            to={"/shop/product/" + product.slug}
          >
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
};
