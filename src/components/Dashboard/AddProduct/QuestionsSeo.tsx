import type { Product, ProductQuestion, ProductSeo } from "@/types/Dashboard";
import { Dispatch, SetStateAction, useState } from "react";
import { FormGroup } from "../ui/FormGroup";
import { ProductQuestions } from "./ProductQuestions";
import { Button } from "@/components/ui/button";

export const QuestionsSeo = ({
  setProduct,
  setActiveTab,
  onSubmitProduct,
  product,
}: {
  setProduct: Dispatch<SetStateAction<Product | undefined>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
  onSubmitProduct: (RequestData: Product | undefined) => void;
  product: Product | undefined;
}) => {
  const [questions, setQuestions] = useState<ProductQuestion[]>(
    product?.questions ?? []
  );
  const [seo, setSeo] = useState<ProductSeo | undefined>(
    product?.seo ?? undefined
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const newSeo = {
      title_en: formData.get("title_en")?.toString() ?? "",
      title_ar: formData.get("title_ar")?.toString() ?? "",
      title_fr: formData.get("title_fr")?.toString() ?? "",
      description_ar: formData.get("description_ar")?.toString() ?? "",
      description_en: formData.get("description_en")?.toString() ?? "",
      description_fr: formData.get("description_fr")?.toString() ?? "",
      keywords_ar: formData.get("keywords_ar")?.toString() ?? "",
      keywords_en: formData.get("keywords_en")?.toString() ?? "",
      keywords_fr: formData.get("keywords_fr")?.toString() ?? "",
    };

    setSeo(newSeo);

    onSubmitProduct(product ? {
      ...product,
      seo: newSeo,
      questions,
    }: undefined);

    setProduct((old) =>
      old
        ? {
            ...old,
            questions,
            seo: newSeo,
          }
        : undefined
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="px-6 py-6 bg-white rounded-3xl">
        <h5 className="text-neutral-400 text-lg font-semibold font-['Lato']">
          SEO
        </h5>
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <FormGroup
                title="Title"
                type="text"
                placeholder="Title"
                name="title_en"
                value={seo?.title_en}
              />
            </div>
            <div className="col-span-1">
              <FormGroup
                title="titre"
                type="text"
                placeholder="titre"
                name="title_fr"
                value={seo?.title_fr}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                title="العنوان"
                type="text"
                placeholder="العنوان"
                dir="rtl"
                name="title_ar"
                value={seo?.title_ar}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="Description"
                name="description_en"
                placeholder="Description"
                value={seo?.description_en}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="Description fr"
                name="description_fr"
                placeholder="Description"
                value={seo?.description_fr}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="الوصف"
                name="description_ar"
                placeholder="الوصف"
                dir="rtl"
                value={seo?.description_ar}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="Keywords"
                name="keywords_en"
                placeholder="Keywords"
                value={seo?.keywords_en}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="Keywords fr"
                name="keywords_fr"
                placeholder="Keywords fr"
                value={seo?.keywords_fr}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="الكلمات الدالة"
                name="keywords_ar"
                placeholder="الكلمات الدالة"
                dir="rtl"
                value={seo?.keywords_ar}
              />
            </div>
          </div>
        </div>
      </div>
      <ProductQuestions questions={questions} setQuestions={setQuestions} />
      <div className="flex justify-between gap-4 mt-8">
        <Button
          type="button"
          onClick={() => setActiveTab("item-2")}
          className="w-20 px-5 py-3 rounded-xl border border-stone-950"
        >
          <span className="text-stone-950 font-semibold font-['Lato']">
            Bake
          </span>
        </Button>
        <Button type="submit" className="bg-blue-600 px-5 py-3 rounded-xl w-40">
          <span className="text-white font-semibold font-['Lato']">Save</span>
        </Button>
      </div>
    </form>
  );
};
