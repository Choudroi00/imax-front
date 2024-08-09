import { ProductInfo } from "@/components/Dashboard/AddProduct/ProductInfo";
import { CodeInputs } from "@/components/Dashboard/AddProduct/CodeInputs";
import { PageTitle } from "@/components/Dashboard/ui/PageTitle";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {Product, ProductAttributeInfo} from "@/types/Dashboard";
import { QuestionsSeo } from "@/components/Dashboard/AddProduct/QuestionsSeo";
import axiosClient from "@/axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useParams } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import router from "@/router";

const ProductView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("item-1");
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(false);
  const [productAttributes, setAttributes] = useState<ProductAttributeInfo[] | undefined>()

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get("/dashboard/products/" + id)
        .then(({ data }) => {
          setProduct(data.data);
          
          
        })
        .catch(() => {
          router.navigate("/404");
        })
        .finally(() => {
          setLoading(false);
        });



    }
    axiosClient
        .get('/dashboard/attributes')
        .then((resp)=> {
          setAttributes(resp.data.attributes)
          console.log(resp.data)
        })
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  const onSubmitProduct = (RequestData = product) => {
    let res;
    if (id) {
      res = axiosClient.put("/dashboard/products/" + id, RequestData);
    } else {
      res = axiosClient.post("/dashboard/products", RequestData);
    }

    res
      .then((response) => {
        toast("Success!", {
          description: response.data.message || "Product added to cart",
          className: "bg-green-600 border-0",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
        router.navigate("/dashboard/products");
      })
      .catch((error) => {
        if (error.response.status == 422) {
          Object.keys(error.response.data.errors).forEach((key: string) => {
            error.response.data.errors[key].forEach((errorMessage: string) => {
              toast("Error validation failed " + key, {
                description: errorMessage,
                className: "bg-red-600 border-0",
                action: {
                  label: "Close",
                  onClick: () => {},
                },
              });
            });
          });
        } else {
          toast("Error!", {
            description: error.response?.data?.message || "An error occurred",
            className: "bg-red-600 border-0",
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
        }
      });
  };

  return (
    <section className="w-full">
      <Toaster />
      <PageTitle
        title={id ? "Update Product" : "Add New Product"}
        array={[
          {
            name: "Products",
            path: "/dashboard/products",
          },
          {
            name: "Product",
          },
        ]}
      />
      <Tabs value={activeTab} className="mt-4">
        <TabsList className="justify-start w-full px-6 py-4 bg-white rounded-3xl">
          <div className="relative w-full after:absolute after:inset-x-0 after:top-1/2 after:block after:h-px after:-translate-y-1/2 after:rounded-lg after:bg-neutral-400">
            <div className="relative z-10 flex justify-between">
              {["item-1", "item-2", "item-3"].map((item) => (
                <div
                  key={item}
                  className="flex items-center w-auto gap-4 px-2 bg-white"
                >
                  <span
                    className={cn(
                      "bg-indigo-50 rounded-full border border-blue-600 size-10 text-center font-bold flex items-center justify-center",
                      activeTab === item
                        ? "bg-indigo-50 border-blue-600 text-blue-600"
                        : "bg-white border-stone-950 text-stone-950"
                    )}
                  >
                    <span className="text-base font-semibold font-['Lato']">
                      {item === "item-1" ? "1" : item === "item-2" ? "2" : "3"}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-base font-semibold font-['Lato']",
                      activeTab === item ? "text-blue-600" : "text-stone-950"
                    )}
                  >
                    {item === "item-1"
                      ? "Product Info"
                      : item === "item-2"
                      ? "Code & Inputs"
                      : "Questions & SEO"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="item-1">
            <ProductInfo
              setProduct={setProduct}
              setActiveTab={setActiveTab}
              product={product}
              baseAttributes={productAttributes}
            />
          </TabsContent>
          <TabsContent value="item-2">
            <CodeInputs
              setProduct={setProduct}
              setActiveTab={setActiveTab}
              product={product}
            />
          </TabsContent>
          <TabsContent value="item-3">
            <QuestionsSeo
              setProduct={setProduct}
              setActiveTab={setActiveTab}
              onSubmitProduct={onSubmitProduct}
              product={product}
            />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};

export default ProductView;
