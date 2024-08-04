import React, { useState, useCallback, Dispatch, SetStateAction, useEffect } from 'react';
import {ProductAttribute, ProductAttributeInfo, SaveVariant} from "@/types/Dashboard";
import {AudioLinesIcon, MinusIcon, PlusIcon, XIcon} from "lucide-react";
import { ProductVariant } from '@/types';
import { set } from 'lodash';


export interface AttributeViewProps{
    baseAttributes: ProductAttributeInfo[] | undefined
    saveVariants: Dispatch<SetStateAction<SaveVariant[] | undefined>>
    baseVariants?: ProductAttribute[]
    saveAttributes?: Dispatch<SetStateAction<ProductAttribute[] | undefined>>
}

const AttributesView : React.FC<AttributeViewProps>  = ({baseAttributes, saveVariants,saveAttributes,baseVariants}) => {
    /**
     * TODO : - add the prev state 
     *        - in case of an update we still need the the id , so think how u can add it 
     */

    

    const [attributes, setAttributes] = useState<ProductAttribute[] | undefined>(baseVariants ?? []);

    const handleAddAttribute = useCallback(() => {
        setAttributes((prevState) => prevState ? [
            ...prevState,
            {
                name: baseAttributes ? baseAttributes[0].name : '',
                name_variants: baseAttributes ? baseAttributes[0].name_variants : [],
                variants: [],
            },
        ]: []);
    }, [baseAttributes]);

    const handleRemoveAttribute = useCallback((id:number) => {
        setAttributes((prevState) => prevState ? prevState.filter((_, index) => index !== id) :[]);
    }, []);

    const handleAddVariation = useCallback((attrId: number) => {
        setAttributes((prevState) => prevState ?
            prevState.map((item, index) =>
                index === attrId
                    ? {
                        ...item,
                        variants: item.variants ? [
                            ...item.variants,
                            {
                                
                                product_id: 0,
                                name: '',
                                price: '',
                                attr_id: 0,
                                name_variants: [],
                            },
                        ] : [{
                                
                            product_id: 0,
                            name: '',
                            price: '',
                            attr_id: 0,
                            name_variants: [],
                        }],
                    }
                    : item
            ): []
        );
    }, []);

    const handleRemoveVariation = useCallback((attrId: number, id: number) => {
        setAttributes((prevState) => prevState ?
            prevState.map((item, index) =>
                index === attrId
                    ? {
                        ...item,
                        variants: item.variants ? item.variants.filter((_, varIndex) => varIndex !== id) : [] ,
                    }
                    : item
            ) : []
        );
    }, []);

    const handleAddTranslation = useCallback((attrId: number, varId :number) => {
        setAttributes((prevState) => prevState ?
            prevState.map((attrItem, attrIndex) =>
                attrIndex === attrId
                    ? {
                        ...attrItem,
                        variants:attrItem.variants ? attrItem.variants.map((varItem, varIndex) =>
                            varIndex === varId
                                ? {
                                    ...varItem,
                                    name_variants: varItem.name_variants ? [
                                        ...varItem.name_variants,
                                        { name: '', lang: 'en' },
                                    ]: [],
                                }
                                : varItem
                        ) : [],
                    }
                    : attrItem
            ): []
        );
    }, []);

    const handleRemoveTranslation = useCallback((attrId: number, varId: number, id:number) => {
        setAttributes((prevState) =>prevState?
            prevState.map((attrItem, attrIndex) =>
                attrIndex === attrId
                    ? {
                        ...attrItem,
                        variants:  attrItem.variants ?  attrItem.variants.map((varItem, varIndex) =>
                            varIndex === varId
                                ? {
                                    ...varItem,
                                    name_variants: varItem.name_variants ? varItem.name_variants.filter(
                                        (_, transIndex) => transIndex !== id
                                    ):[],
                                }
                                : varItem
                        ) : [],
                    }
                    : attrItem
            ):[]
        );

        
    }, []);

    const handleAttributeChange = useCallback((id:number, change: string) => {
        setAttributes((prevState):ProductAttribute[] => prevState ?
            prevState.map((attribute:ProductAttribute, attrIndex):ProductAttribute =>
                id === attrIndex ? { ...attribute, name: change } : attribute
            ): []
        );
    }, []);

    const handleVariantNameChange = useCallback((attrId:number, id:number, change:string) => {
        setAttributes((prevState):ProductAttribute[] => prevState ?
            prevState.map((attribute, attrIndex) =>
                attrId !== attrIndex
                    ? attribute
                    : {
                        ...attribute,
                        variants: attribute .variants ? attribute.variants.map((variant, varIndex) =>
                            varIndex !== id ? variant : { ...variant, name: change }
                        ) : [],
                    }
            ): []
        );
    }, []);

    const handleVariantPriceChange = useCallback((attrId: number, id: number, change: string) => {
        setAttributes((prevState) => prevState ?
            prevState.map((attribute, attrIndex) =>
                attrId !== attrIndex
                    ? attribute
                    : {
                        ...attribute,
                        variants: attribute.variants?.map((variant, varIndex) =>
                            varIndex !== id
                                ? variant
                                : { ...variant, price: change }
                        ) ?? [],
                    }
            ):[]
        );
    }, []);

    const handleVariantTranslationLangChange = useCallback(
        (attrId: number, varId: number, id:number, change:string) => {
            setAttributes((prevState) =>prevState ?
                prevState.map((attribute, attrIndex) =>
                    attrId !== attrIndex
                        ? attribute
                        : {
                            ...attribute,
                            variants: attribute.variants?.map((variant, varIndex) =>
                                varIndex !== varId
                                    ? variant
                                    : {
                                        ...variant,
                                        name_variants: variant.name_variants
                                            ? variant.name_variants.map((translation, transIndex) =>
                                                transIndex === id
                                                    ? { ...translation, lang: change }
                                                    : translation
                                            )
                                            : [],
                                    }
                            ),
                        }
                ):[]
            );
        },
        []
    );

    const handleVariantTranslationTranslationChange = useCallback(
        (attrId:number, varId:number, id:number, change:string) => {
            setAttributes((prevState) =>prevState ?
                prevState.map((attribute, attrIndex) =>
                    attrId !== attrIndex
                        ? attribute
                        : {
                            ...attribute,
                            variants: attribute.variants?.map((variant, varIndex) =>
                                varIndex !== varId
                                    ? variant
                                    : {
                                        ...variant,
                                        name_variants: variant.name_variants
                                            ? variant.name_variants.map((translation, transIndex) =>
                                                transIndex === id
                                                    ? { ...translation, name: change }
                                                    : translation
                                            )
                                            : [],
                                    }
                            ),
                        }
                ):[]
            );
        },
        []
    );

    useEffect(()=>{
        // saveVariants((prevState: SaveVariant[] | undefined) : SaveVariant[]=>{
        //     return !prevState ? attributes?.map((attrItem)=>{
        //         return attrItem.variants?.map((varItem) : SaveVariant=>{
        //             return {
        //                 id: varItem.id,
        //                 attr_id: baseAttributes?.find((bItem)=> bItem.name === attrItem.name)?.id ?? 0,
        //                 name: varItem.name,
        //                 price: varItem.price,
        //                 name_variants: varItem.name_variants

        //             }
        //         }) as SaveVariant
        //     }) as SaveVariant[] ?? [] : [
        //         ...prevState,
        //         ...attributes?.map((attrItem)=>{
        //             return attrItem.variants?.map((varItem) : SaveVariant=>{
        //                 return {
        //                     id: varItem.id,
        //                     attr_id: baseAttributes?.find((bItem)=> bItem.name === attrItem.name)?.id ?? 0,
        //                     name: varItem.name,
        //                     price: varItem.price,
        //                     name_variants: varItem.name_variants
    
        //                 }
        //             }) as SaveVariant
        //         }) as SaveVariant[] ?? []
        //     ]
        // }) 
        
        if(saveAttributes) {saveAttributes(attributes ? attributes : []);}
    },attributes)

    useEffect(()=>{
        console.log(attributes);
        
    })

    

    return (
        <div className="flex flex-col mt-6">
            <div>
                <button
                    type={"button"}
                    onClick={handleAddAttribute}
                    className="p-3 hover:bg-slate-100 mb-4  ease-in text-gray-700 duration-150 rounded-xl transition">
                    <AudioLinesIcon className=" text-gray-400"/>
                </button>
            </div>
            {attributes && attributes.map((item, attrIndex) => (
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
                                    {baseAttributes?.map((attr: ProductAttributeInfo, index: number) => (
                                        <option key={index} value={attr.name}>{attr.name}</option>
                                    ))}
                                </select>
                                <button
                                    type={"button"}
                                    onClick={() => handleRemoveAttribute(attrIndex)}
                                    className="p-3 hover:bg-slate-100 ease-in text-gray-700 duration-150 rounded-xl transition">
                                    <XIcon className=" text-gray-400"/>
                                </button>
                            </div>
                            <div className={"flex justify-items-center flex-row px-4"} >
                                <div className={"text-gray-800 flex flex-col justify-items-center items-center justify-center"} >
                                    Add Variant
                                </div>
                                <button
                                    type={"button"}
                                    onClick={() => handleAddVariation(attrIndex)}
                                    className="p-3 ms-4 duration-150 rounded-xl transition text-gray-700 hover:bg-slate-100 ease-in">
                                    <PlusIcon className=" text-gray-400"/>
                                </button>
                            </div>
                        </div>
                        <div className="rounded-b-xl bg-slate-50 ps-10 pe-4 flex flex-row">
                            <div className="rounded-full bg-slate-200 w-[5px]"></div>
                            <div className={"flex flex-col"} >
                                {item.variants.map((variant, varIndex) => (
                                    <div key={varIndex} className="ps-5 flex-1 py-5 flex flex-col">
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                autoComplete={"off"}
                                                name={`variant_name`}
                                                placeholder="Name"
                                                value={variant.name}
                                                onChange={({target: {value}}) => handleVariantNameChange(attrIndex, varIndex, value)}
                                                className="appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                                            />
                                            <input
                                                type="text"
                                                autoComplete={"off"}
                                                name={`price`}
                                                placeholder="Price"
                                                value={variant.price}
                                                onChange={(e) => handleVariantPriceChange(attrIndex, varIndex, e.target.value)}
                                                className="appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVariation(attrIndex, varIndex)}
                                                className="p-3 hover:bg-slate-100 ease-in duration-150 rounded-xl transition">
                                                <MinusIcon className=" text-gray-400"/>
                                            </button>
                                        </div>
                                        <div className={"flex ps-8"}>
                                            <h2 className="mt-4 mb-4 me-24 text-gray-600">Translations</h2>
                                            <button
                                                type="button"
                                                onClick={() => handleAddTranslation(attrIndex, varIndex)}
                                                className="p-3 ms-24 hover:bg-slate-100 ease-in duration-150 rounded-xl transition">
                                                <PlusIcon className=" text-gray-400"/>
                                            </button>
                                        </div>
                                        {variant.name_variants && variant.name_variants.map((translation, transIndex) => (
                                            <div key={transIndex} className="flex py-2 ps-8 gap-4">
                                                <input
                                                    type="text"
                                                    name={``}
                                                    placeholder="Language"
                                                    value={translation.lang}
                                                    onChange={(e) => handleVariantTranslationLangChange(attrIndex, varIndex, transIndex, e.target.value)}
                                                    className="appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                                                />
                                                <input
                                                    type="text"
                                                    name={``}
                                                    placeholder="Translation"
                                                    value={translation.name}
                                                    onChange={(e) => handleVariantTranslationTranslationChange(attrIndex, varIndex, transIndex, e.target.value)}
                                                    className="appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTranslation(attrIndex, varIndex, transIndex)}
                                                    className="p-3 hover:bg-slate-100 ease-in duration-150 rounded-xl transition">
                                                    <MinusIcon className=" text-gray-400"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttributesView;
