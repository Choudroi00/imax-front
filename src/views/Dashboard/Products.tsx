import { ProductsIcon } from "@/assets/svg/ProductsIcon";
import { OrderRequestTable } from "@/components/Dashboard/Products/OrderRequestTable";
import { OrderTable } from "@/components/Dashboard/Products/Orders";
import { ProductTableAll } from "@/components/Dashboard/Products/ProductTableAll";
import { PageTitle } from "@/components/Dashboard/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Attribution } from "@/components/Dashboard/Products/Attribituon";

const ProductsDashboard = () => {
  const [tab, setTab] = useState("all");

  return (
    <section className="w-full">
      <Toaster />
      <div className="flex justify-between items-end">
        <PageTitle
          title="All Prodcuts"
          array={[
            {
              name: "Products",
            },
          ]}
        />
        <Button
          className="text-white bg-green-600 px-5 py-3 rounded-xl font-['Lato'] font-semibold"
          to="/dashboard/products/add"
        >
          Add New Product
        </Button>
      </div>
      <Tabs
        className="mt-5 grid grid-cols-6 gap-4 items-start"
        defaultValue={tab}
      >
        
          <TabsList className="col-span-2 flex flex-col">
            <div className="px-4 py-3 bg-white rounded-3xl flex-col justify-start items-start gap-3 flex w-full">
            <TabsTrigger
              value="all"
              className={cn(
                "px-4 py-3 flex gap-3 items-center rounded-xl",
                tab == "all"
                  ? "bg-indigo-50 text-blue-600 fill-blue-600"
                  : "bg-white text-stone-800 fill-stone-800"
              )}
              onClick={() => setTab("all")}
            >
              <ProductsIcon className="fill-current" />
              <span className="font-['Lato'] text-base font-medium">All</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className={cn(
                "px-4 py-3 flex gap-3 items-center rounded-xl",
                tab == "orders"
                  ? "bg-indigo-50 text-blue-600 fill-blue-600"
                  : "bg-white text-stone-800 fill-stone-800"
              )}
              onClick={() => setTab("orders")}
            >
              <ProductsIcon className="fill-current" />
              <span className="font-['Lato'] text-base font-medium">
                Orders
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="request"
              className={cn(
                "px-4 py-3 flex gap-3 items-center rounded-xl",
                tab == "request"
                  ? "bg-indigo-50 text-blue-600 fill-blue-600"
                  : "bg-white text-stone-800 fill-stone-800"
              )}
              onClick={() => setTab("request")}
            >
              <ProductsIcon className="fill-current" />
              <span className="font-['Lato'] text-base font-medium">
                Request
              </span>
            </TabsTrigger>
            </div>
            <div>
            <div className="mt-5">
              <Attribution />
            </div>
            </div>
          </TabsList>
           
        
        <div className="col-span-4">
          <TabsContent value="all">
            <ProductTableAll />
          </TabsContent>
          <TabsContent value="orders">
            <OrderTable />
          </TabsContent>
          <TabsContent value="request">
            <OrderRequestTable />
          </TabsContent>
        </div>
        
      </Tabs>
    </section>
  );
};

export default ProductsDashboard;
