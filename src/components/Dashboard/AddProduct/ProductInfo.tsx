import { Button } from "@/components/ui/button";
import {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
import { FormGroup } from "../ui/FormGroup";
import { SelectCategory } from "./SelectCategory";
import { ProductImage } from "./ProductImage";
import {
  type ProductInfo as TypeProduct,
  type Product,
  type ProductImage as TypeImage,
  ProductPrice, ProductAttribute, ProductAttributeInfo, ProductVariant, LanguageVariant,
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

  // const [discount, setDiscount] = useState(price?.discount ?? 0);

  const [attributes,setAttributes] = useState<ProductAttribute[] | undefined >( product?.attributes )



  const handleAddAttribute = () => {
    setAttributes((prevState : ProductAttribute[] | undefined) : ProductAttribute[] => {
      if (prevState){
        return [...prevState, {
          name:baseAttributes ? baseAttributes[0].name : '',
          name_variants:baseAttributes ? baseAttributes[0].name_variants : [] as LanguageVariant[],
          variants:[] as ProductVariant[]

        } ]
      }else{
        return [{
          name:baseAttributes ? baseAttributes[0].name : '',
          name_variants:baseAttributes ? baseAttributes[0].name_variants : [] as LanguageVariant[],
          variants:[] as ProductVariant[]

        }]
      }
    })
  }
  const handleRemoveAttribute = (id:number)=> {
    setAttributes((prevState: ProductAttribute[] | undefined): ProductAttribute[]=>{
      return prevState ? [...prevState?.filter((item,index)=> index !== id)] : []
    })
  }

  const handleAddVariation = (attrId: number)=>{
    setAttributes((prevState: ProductAttribute[] | undefined) : ProductAttribute[]=>{
      if (prevState){
        return [
          ...prevState.map((item,index):ProductAttribute=>{
            if (index === attrId) {
              return {
                name: item.name,
                name_variants: item.name_variants,
                variants: [...item.variants, {id: item.variants.length, product_id: 0 ,name: '', price: '', attr_id: 0, name_variants: [],}]
              }
            }
            return item
          }),

        ]
      }else{
        return []
      }
    })
  }
  const handleRemoveVariation = (attrId: number, id: number)=>{
    setAttributes((prevState: ProductAttribute[] | undefined): ProductAttribute[] =>{
      if(prevState){
        return [
          ...prevState.map((item :ProductAttribute, index: number) : ProductAttribute=>{
            if (index === attrId){
              return {
                name: item.name,
                name_variants: item.name_variants,
                variants: item.variants.filter((itm : ProductVariant, ind: number)=> {
                  return ind !== id
                })
              }
            }

            return item
          })
        ]
      }else {
        return []
      }

    })
  }

  const handleAddTranslation = (attrId: number, varId: number)=>{
    setAttributes((prevState: ProductAttribute[] | undefined) : ProductAttribute[] => {
      if (prevState){
        return [
          ...prevState.map((attrItem: ProductAttribute, attrIndex: number): ProductAttribute =>{
            if (attrIndex === attrId){
              return {
                ...attrItem,
                variants: attrItem.variants.map((varItem : ProductVariant, varIndex): ProductVariant =>{
                  if(varIndex === varId){
                    return {
                      ...varItem,
                      name_variants: varItem.name_variants ? [...varItem.name_variants,{name: '',lang: 'en'}] : [{name:'',lang:''}]
                    }
                  }
                  return varItem
                })
              }
            }
            return attrItem
          })
        ]
      }else{
        return []
      }
    })
  }
  const handleRemoveTranslation = (attrId: number,varId: number, id:number) => {
    setAttributes((prevState: ProductAttribute[] | undefined) : ProductAttribute[] => {
      if (prevState){
        return [
          ...prevState.map((attrItem: ProductAttribute, attrIndex: number): ProductAttribute =>{
            if (attrIndex === attrId){
              return {
                ...attrItem,
                variants: attrItem.variants.map((varItem : ProductVariant, varIndex): ProductVariant =>{
                  if(varIndex === varId){
                    return {
                      ...varItem,
                      name_variants: varItem.name_variants?.filter((translation: LanguageVariant, transIndex:number)=> transIndex !== id)
                    }
                  }
                  return varItem
                })
              }
            }
            return attrItem
          })
        ]
      }else{
        return []
      }
    })
  }

  const handleAttributeChange = (id: number, change: string)=>{
    setAttributes((prevState:ProductAttribute[] | undefined): ProductAttribute[]=>{
      return !prevState ? [] : [
        ...prevState.map((attribute,attrIndex)=>{
          return id === attrIndex ? {
            ...attribute,
            name: change,
          } : attribute
        }),

      ]
    })
  }
  const handleVariantNameChange = (attrId: number, id: number, change: string) => {
    setAttributes((prevState: ProductAttribute[] | undefined): ProductAttribute[]=>{
      return !prevState ? [] : [
        ...prevState.map((attribute, attrIndex ) : ProductAttribute=>{
          return attrId !== attrIndex ? attribute : {
            ...attribute,
            variants: [...attribute.variants.map((variant: ProductVariant, varIndex: number)=>{
              return varIndex !== id ? variant : {
                ...variant,
                name:change,

              }
            })]
          }
        })
      ]
    })
  }
  const handleVariantPriceChange = (attrId: number, id: number, change: string)=> {
    setAttributes((prevState: ProductAttribute[] | undefined): ProductAttribute[]=>{
      return !prevState ? [] : [
        ...prevState.map((attribute, attrIndex ) : ProductAttribute=>{
          return attrId !== attrIndex ? attribute : {
            ...attribute,
            variants: [...attribute.variants.map((variant: ProductVariant, varIndex: number):ProductVariant=>{
              return varIndex !== id ? variant : {
                ...variant,
                price: change ,

              }
            })]
          }
        })
      ]
    })
  }
  const handleVariantTranslationLangChange = useCallback((attrId: number, varId: number,id: number , change: string) => {
    setAttributes((prevState: ProductAttribute[] | undefined): ProductAttribute[]=>{
      return !prevState ? [] : [
        ...prevState.map((attribute, attrIndex ) : ProductAttribute=>{
          return attrId !== attrIndex ? attribute : {
            ...attribute,
            variants: [...attribute.variants.map((variant: ProductVariant, varIndex: number)=>{
              return varIndex !== varId ? variant : {
                ...variant,
                name_variants: variant.name_variants ?  [...variant.name_variants.map((translation,transIndex)=> transIndex === id ? {...translation,lang: change} : translation )]  : [],

              }
            })]
          }
        })
      ]
    })
  },[])
  const handleVariantTranslationTranslationChange = (attrId: number, varId: number,id: number , change: string) => {
    setAttributes((prevState: ProductAttribute[] | undefined): ProductAttribute[]=>{
      return !prevState ? [] : [
        ...prevState.map((attribute, attrIndex ) : ProductAttribute=>{
          return attrId !== attrIndex ? attribute : {
            ...attribute,
            variants: [...attribute.variants.map((variant: ProductVariant, varIndex: number)=>{
              return varIndex !== varId ? variant : {
                ...variant,
                name_variants: variant.name_variants ?  [...variant.name_variants.map((translation,transIndex)=> transIndex === id ? {...translation,name: change} : translation )]  : [],

              }
            })]
          }
        })
      ]
    })
  }

  const AttributesView2 = ()=>{







    return (
        <div className="flex flex-col mt-6">
          <div>

            <button
            title="n"
                type={"button"}
                onClick={handleAddAttribute}
                className="p-3 hover:bg-slate-100 mb-4  ease-in text-gray-700 duration-150 rounded-xl transition">
              <AudioLinesIcon className=" text-gray-400"/>
            </button>
          </div>
          {
            attributes?.map((item, attrIndex) => {
              return (
                  <div key={attrIndex} className="w-full mb-4 flex flex-col">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="type">
                      Attribute : {item.name}
                    </label>

                    <div className="flex flex-col">
                      <div className="rounded-t-xl w-full bg-slate-50 flex flex-col">
                        <div className={"flex flex-row"} >

                          <select
                              id="type"
                              name="type"
                              onChange={({target: {value}})=>handleAttributeChange(attrIndex,value)}
                              className="appearance-none bg-transparent rounded-xl w-full py-4 me-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">

                            <option value={item.name}>{item.name}</option>
                            {baseAttributes?.map((attr, index) => {
                              return (
                                  <option key={index}  value="ref">{attr.name}</option>
                              )
                            })}

                          </select>

                          <button
                          title="n"
                              type={"button"}
                              onClick={(e)=>handleRemoveAttribute(attrIndex)}
                              className="p-3 hover:bg-slate-100 ease-in text-gray-700 duration-150 rounded-xl transition">
                            <XIcon className=" text-gray-400"/>
                          </button>
                        </div>

                        <div className={"flex justify-items-center flex-row px-4"} >
                          <div className={"text-gray-800 flex flex-col justify-items-center items-center justify-center"} >
                            Add Variant
                          </div>
                          <button
                          title="n"
                              type={"button"}
                              onClick={(e)=>handleAddVariation(attrIndex)}
                              className="p-3 ms-4 duration-150 rounded-xl transition text-gray-700 hover:bg-slate-100 ease-in">
                            <PlusIcon className=" text-gray-400"/>
                          </button>
                        </div>

                      </div>

                      <div className="rounded-b-xl bg-slate-50 ms-4 pe-4 flex flex-row">
                        <div className="rounded-full bg-slate-200 w-[5px]"></div>

                        <div className={"flex flex-col"} >
                          {item.variants.map((variant, varIndex) => {
                            return (
                                <div key={varIndex} className="ps-5 flex-1 py-5 flex flex-col">
                                  <div className="flex gap-4">
                                    <input
                                        type="text"
                                        autoComplete={"off"}
                                        name={`variant_name`}
                                        placeholder="Name"
                                        value={attributes[attrIndex].variants[varIndex].name}
                                        onChange={({target : {value}})=>handleVariantNameChange(attrIndex,varIndex,value)}
                                        className=" appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                                    />
                                    <input
                                        type="text"
                                        autoComplete={"off"}
                                        name={`price`}
                                        placeholder="Price"
                                        value={attributes[attrIndex].variants[varIndex].price}
                                        onChange={(e)=>handleVariantPriceChange(attrIndex,varIndex,e.target.value)}
                                        className=" appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />

                                    <button
                                    title="n"
                                        type="button"
                                        onClick={(e) => {
                                          handleRemoveVariation(attrIndex,varIndex)
                                        }}
                                        className="p-3 hover:bg-slate-100 ease-in duration-150 rounded-xl transition">
                                      <MinusIcon className=" text-gray-400"/>
                                    </button>
                                  </div>


                                  <div className={"flex ps-8"}>
                                    <h2 className="mt-4 mb-4 me-24 text-gray-600">
                                      Translations
                                    </h2>
                                    <button
                                    title="n"
                                        type="button"
                                        onClick={(e) => {
                                          handleAddTranslation(attrIndex,varIndex)
                                        }}
                                        className="p-3 ms-24 hover:bg-slate-100 ease-in duration-150 rounded-xl transition"
                                    >
                                      <PlusIcon className=" text-gray-400"/>
                                    </button>
                                  </div>
                                  {
                                    variant.name_variants?.map((translation, transIndex)=>{
                                      return (
                                          <div className="flex ps-8 gap-4">
                                            <input
                                                key={`langname.${transIndex}`}
                                                type="text"
                                                name={``}
                                                placeholder="Language"
                                                value={translation.lang}
                                                onChange={(e)=>handleVariantTranslationLangChange(attrIndex,varIndex,transIndex,e.target.value)}
                                                className=" appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                                            />
                                            <input
                                                key={`trans.${transIndex}`}
                                                type="text"
                                                name={``}
                                                placeholder="Translation"
                                                value={translation.name}
                                                onChange={(e)=>handleVariantTranslationTranslationChange(attrIndex,varIndex,transIndex,e.target.value)}
                                                className=" appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />

                                            <button
                                            title="n"
                                                type="button"
                                                onClick={(e) => {
                                                  handleRemoveTranslation(attrIndex,varIndex,transIndex)
                                                }}
                                                className="p-3 hover:bg-slate-100 ease-in duration-150 rounded-xl transition"
                                            >
                                              <MinusIcon className=" text-gray-400"/>
                                            </button>
                                          </div>
                                      )
                                    })
                                  }


                                </div>
                            )
                          })}
                        </div>

                      </div>
                    </div>
                  </div>
              )
            })
          }

        </div>
    )
  }

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
      attributes,
      
      short_description_variants: [
        {
          name: formData.get("short_description_fr")?.toString() ?? "0",
          lang: 'fr'
        },
        {
          name: formData.get("short_description_ar")?.toString() ?? "0",
          lang: 'ar'
        },

      ]


    }

    setProductInfo(product)

    setProduct((old)=> old ? {
      ...old,
      ...product,
      attributes,
      images
    }: {
      ...product,
      attributes,
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
        <AttributesView baseAttributes={baseAttributes} />


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
