import { Button } from "@/components/ui/button";
import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import { FormGroup } from "../ui/FormGroup";
import { SelectCategory } from "./SelectCategory";
import { ProductImage } from "./ProductImage";
import {
  type ProductInfo as TypeProduct,
  type Product,
  type ProductImage as TypeImage,
  ProductPrice, ProductAttribute, ProductAttributeInfo, ProductVariant, LanguageVariant,
  SaveVariant,
} from "@/types/Dashboard";
import { SelectType } from "./SelectType";
import {AudioLinesIcon, MinusIcon, Plane, PlusIcon, XIcon} from "lucide-react";
import {at} from "lodash";
import AttributesView from "@/components/Dashboard/Products/AttributesView.tsx";

export const ProductInfo = ({
  setProduct,
  setActiveTab,
  product,
    baseAttributes
}: {
  setProduct: Dispatch<SetStateAction<Product | undefined>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
  product: Product | undefined;
  baseAttributes: ProductAttributeInfo[] | undefined
}) => {
  const [images, setImages] = useState<TypeImage[] | undefined>(product?.images);

  const [categoryId, setCategoryId] = useState<string>(product?.category_id?.toString() ?? "");

  const [type, setType] = useState(product?.type ?? "");

  //const [price, setPrice] = useState<number | undefined>(product?.base_ref_price);

  const [productInfo, setProductInfo] = useState<TypeProduct | undefined>(product ?? undefined);

  //const [discount, setDiscount] = useState(price?.discount ?? 0);

  const [attributes,setAttributes] = useState<ProductAttribute[] | undefined >( product?.attributes )


  const [savedAttributes, saveAttribute] = useState<SaveVariant[] | undefined >()
  const [savedAttsCopy, setAttrCopy] = useState<ProductAttribute[] | undefined>(product?.attributes)

  

  

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const formData = new FormData(event.target as HTMLFormElement);

    const product : TypeProduct = {
      title_en: formData.get("title_en")?.toString() ?? "",
      title_ar: formData.get("title_ar")?.toString() ?? "",
      title_fr: formData.get("title_fr")?.toString() ?? "",
      description_en: formData.get("description_en")?.toString() ?? "",
      description_fr: formData.get("description_fr")?.toString() ?? "",
      description_ar: formData.get("description_ar")?.toString() ?? "",
      category_id: categoryId,
      type,

      base_ref_price: formData.get('base_ref_price')?.toString() ?? "0",
      short_description: formData.get("short_description")?.toString() ?? "",
      discount: formData.get("discount")?.toString() ?? "0",
      variants: savedAttsCopy?.flatMap((attr)=>{
        
        return attr.variants?.map((variant)=>{
          return {
            ...variant,
            attr_id: baseAttributes?.find((battr)=> battr.name === attr.name )?.id
          }
        })
      }) as SaveVariant[] ,
      
      short_description_variants: [
        {
          name: formData.get("short_description_fr")?.toString() ?? "0",
          lang: 'fr'
        },
        {
          name: formData.get("short_description_ar")?.toString() ?? "0",
          lang: 'ar'
        },

      ],

      attributes: savedAttsCopy


    }

    console.log(product.attributes?.flat);
    

    setProductInfo(product)
    

    setProduct((old)=> old ? {
      ...old,
      ...product,
      
      images
    }: {
      ...product,
      
      images
    })



    setActiveTab("item-2");

  }

  // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //
  //   const formData = new FormData(event.target as HTMLFormElement);
  //
  //   const product: TypeProduct = {
  //     title_en: formData.get("title_en")?.toString() ?? "",
  //     title_ar: formData.get("title_ar")?.toString() ?? "",
  //     title_fr: formData.get("title_fr")?.toString() ?? "",
  //     description_en: formData.get("description_en")?.toString() ?? "",
  //     description_fr: formData.get("description_fr")?.toString() ?? "",
  //     description_ar: formData.get("description_ar")?.toString() ?? "",
  //     category_id: categoryId,
  //     type,
  //   };
  //
  //   const prices: ProductPrice = {
  //     usd: formData.get("price_usd")?.toString() ?? "",
  //     eur: formData.get("price_eur")?.toString() ?? "",
  //     egp: formData.get("price_egp")?.toString() ?? "",
  //     aed: formData.get("price_aed")?.toString() ?? "",
  //     dzd: formData.get("price_dzd")?.toString() ?? "",
  //     kwd: formData.get("price_kwd")?.toString() ?? "",
  //     sar: formData.get("price_sar")?.toString() ?? "",
  //     imx: formData.get("imx")?.toString() ?? "",
  //     discount,
  //   };
  //   setPrice(prices);
  //
  //   setProductInfo(product);
  //
  //   setProduct((old) =>
  //     old
  //       ? {
  //           ...old,
  //           ...product,
  //           images,
  //           prices,
  //         }
  //       : {
  //           ...product,
  //           images,
  //           prices,
  //         }
  //   );
  //
  //   setActiveTab("item-2");
  // };

  return (
      <form onSubmit={onSubmit}>
        <div className="px-6 py-6 bg-white rounded-3xl">
          <h5 className="text-neutral-400 text-lg font-semibold font-['Lato']">
            Main Info
          </h5>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ProductImage images={images} setImages={setImages}/>
              </div>
              <div className="col-span-1">
                <SelectCategory
                    setCategoryId={setCategoryId}
                    categoryId={categoryId}
                />
              </div>
              <div className="col-span-1">
                <SelectType setType={setType} type={type}/>
              </div>
              <div className="col-span-1">
                <FormGroup
                    title="Title"
                    type="text"
                    placeholder="Title"
                    name="title_en"
                    value={productInfo?.title_en}
                />
              </div>
              <div className="col-span-1">
                <FormGroup
                    title="titre"
                    type="text"
                    placeholder="titre"
                    name="title_fr"
                    value={productInfo?.title_fr}
                />
              </div>
              <div className="col-span-2">
                <FormGroup
                    title="العنوان"
                    type="text"
                    placeholder="العنوان"
                    dir="rtl"
                    name="title_ar"
                    value={product?.title_ar}
                />
              </div>
              {/** working there  */}
              {/** working there  */}
              {/** working there  */}
              {/** working there  */}
              <div className="col-span-1">
                <FormGroup
                    title="Base Price"
                    type="text"
                    placeholder="Base Price"
                    name="base_ref_price"
                    value={product?.base_ref_price}
                />
              </div>
              <div className="col-span-1">
                <FormGroup
                    title="Discount"
                    type="text"
                    placeholder="Discount"
                    name="discount"
                    value={product?.discount}
                />
              </div>

              <div className="col-span-2">
                <FormGroup
                    title="Short Description"
                    type="text"
                    placeholder="Short Description"
                    name="short_description"
                    value={product?.short_description}
                />
              </div>
              <div className="col-span-2">
                <FormGroup
                    title="Short Description FR"
                    type="text"
                    placeholder="Short Description"
                    name="short_description_fr"
                    value={product ? product.short_description_variants ? product.short_description_variants[0].name : '' : ''}
                />
              </div>

              <div className="col-span-2">
                <FormGroup
                    title="وصف قصير"
                    type="text"
                    placeholder="Short Description"
                    name="short_description_ar"
                    dir="rtl"
                    value={product ? product.short_description_variants ? product.short_description_variants[1].name : '' : ''}
                />
              </div>

              <div className="col-span-2">
                <FormGroup
                    type="textarea"
                    title="Description"
                    name="description_en"
                placeholder="Description"
                value={productInfo?.description_en}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="Description fr"
                name="description_fr"
                placeholder="Description"
                value={productInfo?.description_fr}
              />
            </div>
            <div className="col-span-2">
              <FormGroup
                type="textarea"
                title="الوصف"
                name="description_ar"
                placeholder="الوصف"
                dir="rtl"
                value={productInfo?.description_ar}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 bg-white rounded-3xl mt-6">
        <h5 className="text-neutral-400 text-lg font-semibold font-['Lato']">
          Attributes
        </h5>
        <AttributesView baseVariants={product?.attributes} saveAttributes={setAttrCopy} saveVariants={saveAttribute} baseAttributes={baseAttributes} />


        <div className="mt-6">
          <div className="grid grid-cols-2">
            <div className=" col-span-1 "></div>
          </div>
        </div>


      </div>
      <div className="flex justify-end gap-4 mt-8">
        <Button type="submit" className="bg-blue-600 px-5 py-3 rounded-xl w-40">
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
    </form>
  );
};
