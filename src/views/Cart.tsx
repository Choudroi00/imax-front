import axiosClient from "@/axios";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { PageTitle } from "@/components/ui/page-title";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStateContext } from "@/contexts/ContextProvider";
import { CartProduct } from "@/types";
import { ProductPrice } from "@/types/Dashboard";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";

const Cart = () => {
  const { currency } = useStateContext();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "cart",
  });
  const fetcher = async () => {
    const response = await axiosClient.get("/cart");
    return response.data;
  };

  const { data, isLoading, mutate } = useSWR("/cart", fetcher);
  const { cart }: { cart: CartProduct[] } = data ?? [];

  if (isLoading) {
    return <Loading />;
  }

  const handleDelete = (id: string | number) => {
    axiosClient
      .delete("/cart/" + id)
      .then((response) => {
        toast("Success!", {
          description: response.data.message || "Product removed from cart",
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

  return (
    <section className="pt-7 pb-20">
      <Toaster />
      {cart && cart.length > 0 ? (
        <>
          <PageTitle page="Cart" link="Shop" path="/shop" />
          <div className="container mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Table className="w-full min-w-[560px]">
                  <TableHeader className="bg-zinc-800">
                    <TableRow>
                      <TableHead className="text-white font-medium text-base text-start">
                        {t("Image")}
                      </TableHead>
                      <TableHead className="w-[250px] text-white font-medium text-base text-start">
                        {t("Product Details")}
                      </TableHead>
                      <TableHead className="text-white font-medium text-base text-start">
                        {t("Price")}
                      </TableHead>
                      <TableHead className="text-white font-medium text-base text-center">
                        {t("Action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.image}
                            alt={product.title_en}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded object-contain"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-neutral-700 text-lg font-normal font-['Lato'] tracking-tight w-[250px]">
                            {i18n.language == "en"
                              ? product.title_en
                              : i18n.language == "ar"
                              ? product.title_ar
                              : product.title_fr}
                          </span>
                          {product.data &&
                            Object.entries(product.data).map(
                              ([key, value]: [string, any]) => (
                                <span
                                  key={key}
                                  className="text-zinc-500 text-sm font-normal font-['Lato']"
                                >
                                  {key.toUpperCase()}: {value}
                                </span>
                              )
                            )}
                        </TableCell>
                                                
                        <TableCell>
                          {data && data.total_amount && currency ? (
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: currency.name || 'usd', // Fallback to 'usd' if currency.name is null or undefined
                            }).format(
                              Number(data.total_amount[currency.name as keyof ProductPrice] || 0)
                            )
                          ) : (
                            // Fallback if currency or data.total_amount is missing
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: 'usd', // Default to 'usd' if currency is null or undefined
                            }).format(0)
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            onClick={() => handleDelete(product.id)}
                            className="w-full"
                          >
                            <img src="/icons/delete.svg" alt="delete" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="lg:col-span-1">
                <div className="w-full bg-white shadow px-6 py-8">
                  <h4 className="text-neutral-700 text-2xl font-normal font-['Lato']">
                    {t("Order Summary")}
                  </h4>
                  <div className="flex justify-between mt-5">
                    <h5>
                      <span className="text-neutral-700 text-lg font-medium font-['Lato'] tracking-tight">
                        {t("Subtotal")}
                      </span>
                      <span className="text-zinc-500 text-base font-medium font-['Lato'] tracking-tight">
                        ({cart.length} items)
                      </span>
                    </h5>
                    <span className="text-neutral-700 text-lg font-medium font-['Lato'] tracking-tight">
                    {data && data.total_amount && currency
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: currency.name,
                        }).format(
                          Number(data.total_amount?.[currency.name as keyof ProductPrice] || 0)
                        )
                      : 0}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Button
                      to="/checkout"
                      className="w-full px-5 py-3 bg-blue-600 rounded-lg disabled:opacity-60"
                    >
                      <span className="text-center text-white text-lg font-medium font-['Lato']">
                        {t("Checkout")}
                      </span>
                    </Button>
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

export default Cart;
