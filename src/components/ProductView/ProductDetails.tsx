import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Thumbs } from "swiper/modules";
import type { Swiper as TypeSwiper } from "swiper/types";
import { useTranslation } from "react-i18next";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { renderStars } from "@/lib/renderStars";
import axiosClient from "@/axios";
import { useStateContext } from "@/contexts/ContextProvider";
import { Product, ProductDetails as TypeProductDetails, ProductAttribute, ProductVariant } from "@/types"; 

export const ProductDetails = ({
  product,
  denominations,
}: {
  product: TypeProductDetails;
  denominations: Product[];
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>();
  const [swiper, setSwiper] = useState<TypeSwiper | any>();
  const [direction] = useState<"vertical" | "horizontal" | undefined>(
    window.innerWidth >= 1025 ? "vertical" : "horizontal"
  );
  const { i18n, t } = useTranslation("translation", {
    keyPrefix: "productDetails",
  });
  const { currency } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;

    const formData = new FormData(event.currentTarget);
    const dataInput: any[] = [];

    formData.forEach((value, key) => {
      dataInput.push({ key, value });

      if (!value) {
        hasError = true;
        toast("Error!", {
          description: `Please enter a value for the "${key}" field.`,
          className: "bg-red-600 border-0",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
      }
    });

    if (!hasError) {
      const data = { product_id: product.id, data: JSON.stringify(dataInput) };
      setLoading(true);

      axiosClient
        .post("/cart", data)
        .then((response) => {
          toast("Success!", {
            description: response.data.message || "Product added to cart",
            className: "bg-green-600 border-0",
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddToWishlist = () => {
    const data = { product_id: product.id };
    setLoadingWishlist(true);

    axiosClient
      .post("/wishlists", data)
      .then((response) => {
        toast("Success!", {
          description: response.data.message || "Product added to wishlist",
          className: "bg-green-600 border-0",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
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
      })
      .finally(() => {
        setLoadingWishlist(false);
      });
  };
 
  //DISCOUNT
  const baseRefPrice = Number(product.base_ref_price);
  const discount = Number(product.discount);
  
  // Calculate the price before discount
  const prixAvantDiscount = (baseRefPrice + discount) * baseRefPrice;
  return (
    <section className="py-14">
      <Toaster />
      <div className="container">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-16">
          <div className="col-span-1">
            <div className="flex xl:flex-row flex-col-reverse items-center gap-8">
              <div className="relativ xl:w-20 w-full flex gap-6 items-center justify-center xl:flex-col flex-row">
                <Swiper
                  dir="ltr"
                  loop={true}
                  spaceBetween={10}
                  slidesPerView={3}
                  breakpoints={{
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 5,
                      spaceBetween: 10,
                    },
                    1025: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                    },
                  }}
                  watchSlidesProgress={true}
                  onSwiper={setThumbsSwiper}
                  modules={[Thumbs]}
                  className="flex flex-col items-center justify-center gap-6 xl:h-[257px] w-full"
                  direction={direction}
                >
                  {product.images &&
                    product.images?.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image.image}
                          alt="image"
                          className="object-cover rounded-lg w-full h-16"
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex xl:flex-col flex-row justify-center items-center gap-3">
                  <Button
                    onClick={() => swiper?.slidePrev()}
                    className="xl:rotate-0 -rotate-90"
                  >
                    <img
                      src="/icons/navigation-up.svg"
                      alt="navigation up"
                      width={30}
                      height={30}
                    />
                  </Button>
                  <Button
                    onClick={() => swiper?.slideNext()}
                    className="xl:rotate-0 -rotate-90"
                  >
                    <img
                      src="/icons/navigation-down.svg"
                      alt="navigation down"
                      width={30}
                      height={30}
                    />
                  </Button>
                </div>
              </div>
              <Swiper
                onSwiper={(swiper) => setSwiper(swiper)}
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                dir="ltr"
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[Thumbs]}
                className="min-h-full overflow-hidden w-full xl:h-[493px]"
                direction={direction}
              >
                {product.images &&
                  product.images?.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.image}
                        alt="playstation"
                        width={458}
                        height={493}
                        className="object-cover lg:min-w-full xl:w-[458px] h-[493px] rounded-2xl mx-auto"
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
          <div className="col-span-1">
            <form onSubmit={onSubmit}>
              <div className="pb-6 border-b border-stone-300">
                <h3 className="text-black/90 text-3xl tracking-wide font-semibold">
                  {i18n.language == "en"
                    ? product.title_en
                    : i18n.language == "fr"
                    ? product.title_fr
                    : product.title_ar}
                </h3>
                <div className="flex gap-6 items-center mt-5">
                  <div className="flex gap-2.5 items-center">
                    {renderStars(product.rate)}
                  </div>
                  <div className="flex gap-4 items-center">
                    <img
                      src="/icons/comment.svg"
                      alt="comment"
                      width={20}
                      height={17}
                    />
                    <span className="text-zinc-500 text-base font-normal">
                      {product.comments} {t("comments")}
                    </span>
                  </div>
                  <div>
                    {/* Display discount if available */}
                    {discount > 0 && (
                      <div>
                        <span className="text-red-500 text-lg font-normal">
                          -{discount}%
                        </span>
                        {/* Display the price before discount */}
                        <div className="text-neutral-700 text-lg font-medium">
                          Prix avant discount: {prixAvantDiscount.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                {product.attributes?.map((attribute) => {
                  const attr = attribute as unknown as {
                    title_en?: string;
                    title_fr?: string;
                    title_ar?: string;
                    id: number;
                    variants: ProductVariant[];
                  };

                  const title = i18n.language === "en"
                    ? attr.title_en
                    : i18n.language === "fr"
                    ? attr.title_fr
                    : attr.title_ar;

                  return (
                    <div className="relative w-full" key={attr.id}>
                      <label className="text-black/60 text-base font-medium capitalize mb-2 block">
                        {title || "Unknown"}
                      </label>
                      <select className="w-full px-4 bg-neutral-100 rounded-md">
                        {attr.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}

                                    
                  <div className="relative mt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {loading ? t("addingToCart") : t("addToCart")}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <Button
              onClick={handleAddToWishlist}
              className="mt-4 w-full py-4 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              disabled={loadingWishlist}
            >
              {loadingWishlist ? t("addingToWishlist") : t("addToWishlist")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

