import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Thumbs } from "swiper/modules";
import type { Swiper as TypeSwiper } from "swiper/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, ProductDetails as TypeProductDetails } from "@/types";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { ProductPrice } from "@/types/Dashboard";
import { useStateContext } from "@/contexts/ContextProvider";
import axiosClient from "@/axios";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { renderStars } from "@/lib/renderStars";
import router from "@/router";

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
                  {Number(product.discount) > 0 && (
                    <span className="text-red-500 text-lg font-normal">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {product.inputs?.map((input) => {
                    const title =
                      i18n.language == "en"
                        ? input.title_en
                        : i18n.language == "fr"
                        ? input.title_fr
                        : input.title_ar;
                    const data =
                      typeof input.data === "string"
                        ? JSON.parse(input.data)
                        : {};
                    const options: {
                      option: string;
                      uuid: string;
                    }[] = data.options ?? [];

                    return (
                      <div className="relative w-full" key={input.id}>
                        <Label
                          htmlFor={title}
                          className="text-black/60 text-base font-medium capitalize mb-2 block"
                        >
                          {title}:
                        </Label>
                        {input.type == "text" ? (
                          <Input
                            type="text"
                            className="py-2 w-full px-4 bg-neutral-100 rounded-md"
                            placeholder={"Enter " + title}
                            name={title}
                          />
                        ) : (
                          <Select name={title}>
                            <SelectTrigger className="w-full px-4 bg-neutral-100 rounded-md">
                              <SelectValue placeholder={"Select a " + title} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectGroup>
                                <SelectLabel>{title}</SelectLabel>
                                {options?.map((option) => (
                                  <SelectItem
                                    value={option.option}
                                    key={option.uuid}
                                  >
                                    {option.option}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    );
                  })}
                  <div className="relative mt-4">
                    <Label
                      htmlFor="denomination"
                      className="text-black/60 text-base font-medium capitalize mb-2 block"
                    >
                      Denomination:
                    </Label>
                    <Select
                      name="denomination"
                      defaultValue={product.slug}
                      onValueChange={(value) =>
                        router.navigate("/shop/product/" + value)
                      }
                    >
                      <SelectTrigger className="w-full px-4 bg-neutral-100 rounded-md">
                        <SelectValue placeholder={"Select a denomination"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup className="w-full">
                          <SelectLabel>Select Denomination</SelectLabel>
                          {denominations &&
                            denominations.map((option) => {
                              return (
                                <SelectItem
                                  value={option.slug}
                                  key={option.id}
                                  className="w-full"
                                >
                                  <div className="flex justify-between w-full">
                                    <p className="text-black/80 text-sm font-normal truncate w-48 text-start">
                                      {i18n.language == "en"
                                        ? option.title_en
                                        : i18n.language == "fr"
                                        ? option.title_fr
                                        : option.title_ar}
                                    </p>
                                  </div>
                                </SelectItem>
                              );
                            })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6 flex md:flex-row flex-col gap-6">
                  <Button
                    className="bg-blue-600 py-2 px-8 rounded-lg gap-3 disabled:opacity-60 w-full"
                    onClick={handleAddToWishlist}
                    disabled={loadingWishlist}
                  >
                    {!loadingWishlist && (
                      <img
                        src="/icons/wishlist.svg"
                        alt="wishlist"
                        width={14}
                        height={17}
                      />
                    )}
                    <span className="text-white text-lg font-normal">
                      {loadingWishlist ? t("loading...") : t("addToWishlist")}
                    </span>
                  </Button>
                  <div className="flex py-3 px-10 justify-center items-center rounded-md border border-neutral-200 w-full">
                    {product.discount ? (
                      <div className="flex gap-2 items-center">
                        <del className="text-neutral-500 text-xs font-medium">
                          {product.base_ref_price}
                        </del>
                        <span className="text-neutral-700 text-lg font-medium">
                        {product.base_ref_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-neutral-700 text-lg font-medium">
                        {product.base_ref_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flex gap-10">
                  <div className="flex-1 flex gap-4 items-center">
                    <img
                      src="/icons/category.svg"
                      alt="category"
                      width={44}
                      height={44}
                    />
                    <span className="text-neutral-700 text-lg font-normal">
                      {i18n.language == "en"
                        ? product.category.category_en
                        : i18n.language == "fr"
                        ? product.category.category_fr
                        : product.category.category_ar}
                    </span>
                  </div>
                  <div className="flex-1 flex gap-4 items-center">
                    <img
                      src="/icons/type.svg"
                      alt="category"
                      width={44}
                      height={44}
                    />
                    <span className="text-neutral-700 text-lg font-normal capitalize">
                      {i18n.language == "en"
                        ? product.type_en
                        : i18n.language == "fr"
                        ? product.type_fr
                        : product.type_ar}
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <Button
                    className="w-full px-10 py-2.5 bg-blue-600 rounded-lg gap-3 disabled:opacity-60"
                    type="submit"
                    disabled={loading}
                  >
                    <img
                      src="/icons/cart-2.svg"
                      alt="cart"
                      width={20}
                      height={20}
                    />
                    <span className="text-white text-lg font-medium">
                      {loading ? t("loading...") : t("addToCart")}
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
