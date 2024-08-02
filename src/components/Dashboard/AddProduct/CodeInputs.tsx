import { Dispatch, SetStateAction, useState } from "react";
import { ProductCodes } from "./ProductCodes";
import { Product, ProductCode, ProductInput } from "@/types/Dashboard";
import { ProductInputs } from "./ProductInputs";
import { Button } from "@/components/ui/button";

export const CodeInputs = ({
  setProduct,
  setActiveTab,
  product,
}: {
  setProduct: Dispatch<SetStateAction<Product | undefined>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
  product: Product | undefined;
}) => {
  const [codes, setCodes] = useState<ProductCode[]>(product?.codes ?? []);
  const [inputs, setInputs] = useState<ProductInput[]>(product?.inputs ?? []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setProduct((old:Product  | undefined):Product | undefined =>
      old ? {
          ...old,
          codes,
          inputs,
        }
        : undefined
    );

    setActiveTab("item-3");
  };

  return (
    <form onSubmit={onSubmit}>
      {product?.type == "automatic" && (
        <ProductCodes setCodes={setCodes} codes={codes} />
      )}
      <ProductInputs inputs={inputs} setInputs={setInputs} />
      <div className="flex justify-between items-center mt-8">
        <div className="block">
          <Button
            type="button"
            onClick={() => setActiveTab("item-1")}
            className="w-20 px-5 py-3 rounded-xl border border-stone-950"
          >
            <span className="text-stone-950 font-semibold font-['Lato']">
              Back
            </span>
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded-xl w-40"
          >
            <span className="text-white font-semibold font-['Lato']">
              Save & Continue
            </span>
          </Button>
          <Button
            type="submit"
            className="w-20 px-5 py-3 rounded-xl border border-stone-950"
          >
            <span className="text-stone-950 font-semibold font-['Lato']">
              Next
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
};
