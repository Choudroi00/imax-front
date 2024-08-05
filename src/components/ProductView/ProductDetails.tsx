import { Swiper, SwiperSlide } from "swiper/react";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Thumbs } from "swiper/modules";
import type { Swiper as TypeSwiper } from "swiper/types";
import { useTranslation } from "react-i18next";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { renderStars } from "@/lib/renderStars";
import axiosClient from "@/axios";
import { useStateContext } from "@/contexts/ContextProvider";
import {
  Product,
  ProductDetails as TypeProductDetails,
  ProductAttribute,
  ProductVariant,
} from "@/types";
import { HeartIcon, ShoppingCartIcon, TruckIcon } from "lucide-react";
import { CategoriesIcon } from "@/assets/svg/CategoriesIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import { log } from "console";

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

  

  const curr = currency
  const rate = parseFloat(curr?.value ?  curr.value : '1')

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;

    const formData = new FormData(event.currentTarget);
    const dataInput: any[] = [];

    const data = { product_id: product.id, data: JSON.stringify(variants) };
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
  //const baseRefPrice = Number(product.base_ref_price) * Number(currency?.value);
  const discount = Number(product.discount);
  

  // Calculate the price before discount
  //const prixAvantDiscount = ((baseRefPrice + discount) * baseRefPrice) / 100;

  const [variants,setVariants] = useState(product.attributes.map((attr,index)=>{
    return {
      attr_id: index,
      id: attr.variants[0].id
    }
  }))

  //console.log(variants);
  

  const handleVariantsChange = (attr_id: number, id: string)=>{
    setVariants((prevState)=>{
      return [...prevState.map((item)=>{
          return item.attr_id === attr_id ? {...item, id: Number( id )} : item
        })]
      
    })
    
  }

  const sumVariants = () : number => {
    const prices = product.attributes.map((attr) : number=> {
      const n = parseFloat(attr.variants.find((variant)=> variants.find((nvariant)=> nvariant.id === variant.id )  )?.price ?? '0')
      console.log(n);
      
      return n
    }  )
    console.log(prices);
    

    const totale = prices.reduce((acc, current)=> acc + current)

    return totale

  }

  const [totale_price,setTotalePrice] = useState( parseFloat((product.base_ref_price ?? '0') + sumVariants()) * rate)

  useEffect(()=> {
    const prices = product.attributes.map((attr) : number=> {
      const n = parseFloat(attr.variants.find((variant)=> variants.find((nvariant)=> nvariant.id === variant.id )  )?.price ?? '0')
      console.log(n);
      
      return n
    }  )
    console.log(prices);
    

    const totale = prices.reduce((acc, current)=> acc + current)
    setTotalePrice((parseFloat((product.base_ref_price ?? '0')) + totale) * rate)
    console.log(totale_price);
    
  }, variants)
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
                          Product Price: {totale_price}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex border-b flex-col gap-4">
                  {product.short_description}
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {product.attributes?.map((attribute,index) => {
                    return (
                      <div className="relative w-full mb-3" key={attribute.id}>
                      <label className="text-black/60 text-base font-medium capitalize mb-2 block">
                          {attribute.name || "Unknown"}
                        </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="w-full px-4 py-4 flex flex-row justify-between bg-neutral-100 rounded-md">
                            
                                  <Fragment  >
                                    
                                    <span className="text-neutral-800 text-base font-medium me-4 font-['Cairo']">
                                      {attribute.variants.find((vari)=> vari.id ===  variants.find((item)=> item.attr_id === index )?.id)?.name}
                                    </span>
                                    <span className="text-neutral-800 text-base font-medium font-['Cairo']">
                                      { parseFloat(attribute.variants.find((vari)=> vari.id ===  variants.find((item)=> item.attr_id === index )?.id)?.price ?? '0') * rate } &nbsp; { curr?.name }
                                    </span>

                                  </Fragment>
                               
                            <img
                              src="/icons/arrow-down.svg"
                              alt="arrow down"
                              width={10}
                              height={12}
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full z-50  py-4 bg-neutral-100 rounded-md">
                          <DropdownMenuRadioGroup
                            value={attribute.variants[0].name}
                            onValueChange={(value)=> handleVariantsChange(index, value) }
                          >
                            {attribute.variants.map((variant) => (
                              <DropdownMenuRadioItem
                                key={variant.id}
                                value={String(variant.id)}
                                className="flex gap-2 rounded-xl transition-all duration-150 ease-in px-4 justify-start py-4 hover:bg-stone-200"
                              >
                                <span className="text-neutral-800 text-base font-medium font-['Cairo']">
                                  {variant.name}
                                </span>
                                <span className="text-neutral-800 text-base font-medium font-['Cairo']">
                                  {parseFloat(variant.price) * rate} &nbsp; { curr?.name }
                                </span>
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    );
                  })}
                  {/* {product.attributes?.map((attribute) => {
                    const attr = attribute as ProductAttribute;

                    const title = attr.name;

                    return (
                      <div className="relative w-full" key={attr.id}>
                        <label className="text-black/60 text-base font-medium capitalize mb-2 block">
                          {title || "Unknown"}
                        </label>
                        <select className="w-full px-4 py-4 bg-neutral-100 rounded-md">
                          {attr.variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })} */}

                  <div className="relative mt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 bg-blue-600 text-white font-semibold text-xl rounded-lg hover:bg-blue-700 transition"
                    >
                      <ShoppingCartIcon className="me-6 text-white text-xl"></ShoppingCartIcon>
                      {loading ? t("addingToCart") : t("addToCart")}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex flex-row justify-between px-8 mt-6 ">
              <div className="flex flex-row items-center">
                <div className=" rounded-full aspect-square p-4 bg-slate-100 me-4">
                  <CategoriesIcon className="text-slate-600" />
                </div>
                <div className="text-slate-700 text-lg">Discourd</div>
              </div>
              <div className="flex flex-row items-center">
                <div className=" rounded-full aspect-square p-4 bg-slate-100 me-4">
                  <TruckIcon className="text-slate-600 " />
                </div>
                <div className="text-slate-700 text-lg">{product.type}</div>
              </div>
            </div>
            <Button
              onClick={handleAddToWishlist}
              className="mt-4 w-full py-4 px-6 bg-yellow-500 text-white text-xl font-semibold rounded-lg hover:bg-yellow-600 transition"
              disabled={loadingWishlist}
            >
              <HeartIcon className="me-6 text-white text-xl"></HeartIcon>
              {loadingWishlist ? t("addingToWishlist") : t("addToWishlist")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
