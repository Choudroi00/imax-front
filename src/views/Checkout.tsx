import axiosClient from "@/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loading } from "@/components/ui/loading";
import { PageTitle } from "@/components/ui/page-title";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useStateContext } from "@/contexts/ContextProvider";
import router from "@/router";
import { CartProduct } from "@/types";
import { ProductPrice } from "@/types/Dashboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

const Checkout = () => {
  const [method, setMethod] = useState("card");
  const [check, setCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const { currency } = useStateContext();
  const { i18n, t } = useTranslation("translation", {
    keyPrefix: "checkout",
  });
  const [coupon, setCoupon] = useState<string>();
  const link = "/cart";

  const fetcher = async () => {
    const response = await axiosClient.get(link);

    return response.data;
  };

  const { data, isLoading } = useSWR(link, fetcher);
  const { cart }: { cart: CartProduct[] } = data ?? [];

  const handleCheckout = () => {
    let data: {
      currency: string;
      method: string;
      coupon?: string;
    } = {
      currency,
      method,
    };

    coupon ? (data.coupon = coupon) : "";

    setLoading(true);
    axiosClient
      .post("/checkout", data)
      .then(({ data }) => {
        if (data.url) {
          location.href = data.url;
        } else {
          router.navigate("/checkout/success");
        }
        toast("Error!", {
          description: data?.message || "An error occurred",
          className: "bg-red-600 border-0",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
        setLoading(false);
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
        setLoading(false);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="pt-7 pb-20">
      <Toaster />
      {cart && cart.length > 0 ? (
        <>
          <PageTitle page="Cart" link="Shop" path="/shop" />
          <div className="container mt-12">
            <h3 className="lg:text-3xl text-2xl text-neutral-900 font-semibold ps-5 relative before:absolute before:h-full before:w-1.5 before:rounded-xl before:bg-blue-600 before:top-0 before:start-0">
              {t("Check Out")}
            </h3>
            <div className="mt-6">
              <h4 className="text-neutral-700 text-xl font-normal font-['Lato'] leading-loose tracking-wide">
                {t("Payment Method")}
              </h4>
              <p className="text-neutral-700 text-base font-normal font-['Lato']">
                {t("All transactions are secure and encrypted.")}
              </p>
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-2 mt-6 gap-8">
              <div className="col-span-2">
                <div className="bg-neutral-100 rounded-xl w-full py-6 px-5">
                  <ToggleGroup
                    type="single"
                    className="flex flex-col *:w-full *:h-auto"
                    defaultValue={currency?.name == "imx" ? "imx" : "card"}
                    onValueChange={(value) => setMethod(value ?? "card")}
                  >
                    <ToggleGroupItem
                      value="card"
                      aria-label="Toggle card"
                      className="justify-between md:items-center !items-start group md:flex-row flex-col"
                      disabled={currency?.name == "imx"}
                    >
                      <div className="flex gap-5 items-center">
                        <div className="w-4 h-4 border-neutral-700 border rounded-full relative">
                          <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-data-[state=on]:block hidden" />
                        </div>
                        <div className="text-start">
                          <h5 className="text-neutral-700 text-xl font-normal font-['Lato']">
                            {t("Credit Card")}
                          </h5>
                          <p className="text-neutral-700 text-base font-normal font-['Lato']">
                            {t("We accept all major credit cards.")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <img
                          src="/icons/mastercard.svg"
                          alt="mastercard"
                          className="size-10"
                        />
                        <img
                          src="/icons/visa.svg"
                          alt="visa"
                          className="size-10"
                        />
                        <img
                          src="/icons/american-express.svg"
                          alt="american-express"
                          className="size-10"
                        />
                        <img
                          src="/icons/discover.svg"
                          alt="discover"
                          className="size-10"
                        />
                      </div>
                    </ToggleGroupItem>
                    <div className="my-6 border-y border-stone-300" />
                    {/* <ToggleGroupItem
                  value="apple_pay"
                  aria-label="Toggle apple pay"
                  className="justify-between items-center group"
                  disabled={currency == "imx"}
                >
                  <div className="flex gap-5 items-center">
                    <div className="w-4 h-4 border-neutral-700 border rounded-full relative">
                      <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-data-[state=on]:block hidden" />
                    </div>
                    <div className="text-start">
                      <h5 className="text-neutral-700 text-xl font-normal font-['Lato']">
                        Apple Pay
                      </h5>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <img
                      src="/icons/apple_pay.svg"
                      alt="apple pay"
                      className="size-10"
                    />
                  </div>
                </ToggleGroupItem>
                <div className="my-6 border-y border-stone-300" />
                <ToggleGroupItem
                  value="google_pay"
                  aria-label="Toggle google pay"
                  className="justify-between items-center group"
                  disabled={currency == "imx"}
                >
                  <div className="flex gap-5 items-center">
                    <div className="w-4 h-4 border-neutral-700 border rounded-full relative">
                      <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-data-[state=on]:block hidden" />
                    </div>
                    <div className="text-start">
                      <h5 className="text-neutral-700 text-xl font-normal font-['Lato']">
                        Google Pay
                      </h5>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <img
                      src="/icons/google_pay.svg"
                      alt="google pay"
                      className="size-10"
                    />
                  </div>
                </ToggleGroupItem> */}
                    <ToggleGroupItem
                      value="paypal"
                      aria-label="Toggle paypal"
                      className="justify-between items-center group"
                      disabled={currency?.name == "imx"}
                    >
                      <div className="flex gap-5 items-center">
                        <div className="w-4 h-4 border-neutral-700 border rounded-full relative">
                          <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-data-[state=on]:block hidden" />
                        </div>
                        <div className="text-start">
                          <h5 className="text-neutral-700 text-xl font-normal font-['Lato']">
                            {t("Paypal")}
                          </h5>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <img
                          src="/icons/paypal.svg"
                          alt="paypal"
                          className="size-10"
                        />
                      </div>
                    </ToggleGroupItem>
                    <div className="my-6 border-y border-stone-300" />
                    <ToggleGroupItem
                      value="chargily"
                      aria-label="Toggle chargily"
                      className="justify-between items-center group"
                      disabled={currency?.name == "dzd"}
                    >
                      <div className="flex gap-5 items-center">
                        <div className="w-4 h-4 border-neutral-700 border rounded-full relative">
                          <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-data-[state=on]:block hidden" />
                        </div>
                        <div className="text-start">
                          <h5 className="text-neutral-700 text-xl font-normal font-['Lato']">
                            Chargily
                          </h5>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <img
                          src="/images/chargily.png"
                          alt="chargily"
                          className="size-10"
                        />
                      </div>
                    </ToggleGroupItem>
                    <div className="my-6 border-y border-stone-300" />
                    <ToggleGroupItem
                      value="imx"
                      aria-label="Toggle website"
                      className="justify-between md:items-center !items-start group md:flex-row flex-col"
                      defaultChecked={currency?.name == "imx" ? true : false}
                    >
                      <div className="flex gap-5 items-center">
                        <div className="w-4 h-4 border-neutral-700 border rounded-full relative">
                          <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-data-[state=on]:block hidden" />
                        </div>
                        <div className="text-start">
                          <h5 className="text-neutral-700 text-xl font-normal font-['Lato']">
                            {t("Purchase using IMX Currency")} (
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "imx",
                            }).format(data.total_amount_imx)}
                            )
                          </h5>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <img
                          src="/images/logo.png"
                          alt="paypal"
                          className="size-10"
                        />
                      </div>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex gap-4 mt-5">
                  <input
                    type="text"
                    id="coupon"
                    placeholder="Enter coupon"
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-48 py-2 px-5 border rounded text-sm text-gray-400 font-normal placeholder:text-sm placeholder:text-gray-400 placeholder:font-normal font-['Lato']"
                  />
                </div>
                <div className="flex items-start space-x-2 text-left mt-2">
                  <Checkbox
                    className="mt-0.5"
                    defaultChecked
                    onCheckedChange={(check: boolean) => setCheck(check)}
                  />
                  <p className="text-black/60 text-base font-normal font-['Lato']">
                    {t("I knowledge that I have read and understood the")}{" "}
                    <Link
                      to="/terms-of-services"
                      className="text-blue-600 text-base font-normal font-['Lato'] underline"
                    >
                      {t("Terms of Service")}
                    </Link>{" "}
                    {t("and agree to abide by them")}
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    className="md:w-96 px-5 py-3 bg-blue-600 rounded-lg disabled:opacity-60"
                    disabled={check ? (loading ? true : false) : true}
                    onClick={handleCheckout}
                  >
                    <span className="text-center text-white text-lg font-medium font-['Lato']">
                      {loading ? t("Loading...") : t("Pay Now")}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-1 col-span-2 row-start-1">
                <div className="w-full bg-white shadow px-6 py-8">
                  <h4 className="text-neutral-700 text-2xl font-normal font-['Lato']">
                    {t("Order Summary")}
                  </h4>
                  <ScrollArea className="h-64 my-5 w-full border-y-2 border-solid rounded-none border-stone-100">
                    {cart &&
                      cart.map((product) => (
                        <div
                          className="py-4 flex items-center gap-4"
                          key={product.id}
                        >
                          <img
                            src={product.image}
                            alt={product.title_en}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="text-start">
                            <Link
                              to={"/shop/product/" + product.slug}
                              className="block"
                            >
                              <span className="text-neutral-700 text-sm font-normal font-['Lato'] tracking-tight uppercase">
                                {i18n.language == "en"
                                  ? product.title_en
                                  : i18n.language == "fr"
                                  ? product.title_fr
                                  : product.title_ar}{" "}
                              </span>
                              <span className="text-zinc-500 text-sm font-normal font-['Lato'] tracking-tight">
                                x 1
                              </span>
                            </Link>
                            <span className="text-zinc-500 text-sm font-normal font-['Lato'] tracking-tight mt-2.5">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency:currency?.name,
                              }).format(
                                Number(
                                  product.prices[currency?.name as keyof ProductPrice]
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                  </ScrollArea>
                  <div className="flex justify-between">
                    <h5>
                      <span className="text-neutral-700 text-lg font-normal font-['Lato'] tracking-tight">
                        {t("Subtotal")}{" "}
                      </span>
                      <span className="text-zinc-500 text-base font-normal font-['Lato'] tracking-tight">
                        ( {cart && cart.length} {t("items")} )
                      </span>
                    </h5>
                    <span className="text-neutral-700 text-lg font-normal font-['Lato'] tracking-tight">
                      {cart &&
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency:currency?.name,
                        }).format(
                          Number(
                            data.total_amount[currency?.name as keyof ProductPrice]
                          )
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full py-12 flex flex-col justify-center items-center">
          <img
            src="/images/empty-cart.svg"
            alt="empty-cart"
            className="max-w-full"
          />
          <div className="mt-11 text-center">
            <h2 className="text-black text-4xl font-bold font-['Lato']">
              {t("Your cart is empty and sad")} :(
            </h2>
            <p className="text-zinc-500 text-base font-normal font-['Lato']">
              {t("Add something to make it happy!")}
            </p>
          </div>
          <div className="mt-4">
            <Button className="px-12 py-3 bg-blue-600 rounded-lg" to="/shop">
              <span className="text-white text-lg font-bold font-['Lato']">
                {t("Continue Shopping")}
              </span>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checkout;
