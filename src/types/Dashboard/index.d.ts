import { Category, ProductReviews } from "..";

export interface ProductInfo {
  id?: number | string;
  title_en?: string;
  title_ar?: string;
  title_fr?: string;
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  category_id?: string | number;
  type?: string;
  type_en?: string;
  type_ar?: string;
  type_fr?: string;
  slug?: string;
  short_description;
}

export interface ProductImage {
  id?: string;
  image: string;
}

export interface ProductQuestion {
  id?: string;
  question_en: string;
  question_ar: string;
  question_fr: string;
  answer_en: string;
  answer_ar: string;
  answer_fr: string;
}

export interface ProductCode {
  id?: string;
  code: string;
  expire_date: Date | string;
  expire?: boolean;
  useremail?: string;
}

export interface ProductInput {
  id?: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  type: "text" | "select" | string;
  data?: {
    options?: Option[];
  };
}

interface Option {
  uuid: string;
  option: string;
}




export interface ProductVariant {
  id: number
  name: string
  name_variants: LanguageVariant[] | undefined
  attr_id: number
  product_id: number | undefined
  price: string
}
export interface ProductAttribute extends ProductAttributeInfo{

  variants: ProductVariant[]

}

export interface ProductAttributeInfo {
  name: string
  name_variants: LanguageVariant[] | undefined

}

export interface Product extends ProductInfo {
  images?: ProductImage[];
  inputs?: ProductInput[];
  codes?: ProductCode[];
  seo?: ProductSeo;
  questions?: ProductQuestion[];
  base_ref_price: number
  attributes: ProductAttribute[]
}

export interface ProductSeo {
  id?: number | string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  keywords_en: string;
  keywords_ar: string;
  keywords_fr: string;
}

export interface ProductPrice {
  usd: string | number;
  sar: string | number;
  aed: string | number;
  kwd: string | number;
  eur: string | number;
  dzd: string | number;
  egp: string | number;
  imx: string | number;
  discount?: number | string;
}

export interface AllProduct {
  id: string | number;
  slug: string;
  image: string;
  title: string;
  category: string;
  price: string;
  rate: string | number;
}

export interface ProductCategory {
  id: number;
  category_en: string;
  category_fr: string;
  category_ar: string;
  image: string;
  product_length?: number;
}

export interface ProductView extends Product {
  reviews: ProductReviews[];
  rate: number;
  comments: number;
  category: Category;
  sales_count: number;
  seen: number;
  customers?: Customer[];
}

export interface Customer {
  id: number | string;
  email: string;
  name: string;
  date: string;
}

export interface Customer {
  id: number | string;
  name: string;
  status: boolean;
  email: string;
  role: string;
  date: string;
  balance: string | number;
}

export interface ProductOrder extends AllProduct {
  payment_method: string;
  payment_status: string;
  amount: number;
  currency: string;
}

export interface Code {
  id: number;
  code: string;
  amount: number;
  is_used: boolean;
  username: string | null;
  created_at: string;
  expired_at: string;
}

export interface Order {
  id: number;
  order_id: string;
  useremail: string;
  username: string;
  title: string;
  payment_method: string;
  payment_status: string;
  amount: number;
  currency: string;
  image: string;
  send: boolean;
  date: string;
  send_date: string;
  send_admin?: string;
  message?: string;
  code?: string;
  type: "automatic" | "manual";
  data: {
    key: string;
    value: string;
  }[];
}

export interface Coupon {
  id: string | number;
  coupon: string;
  discount_percent: string | number;
  expire_at: string;
  created_at: string;
}

// __________C U R R E N C I E S___________________

export interface LanguageVariant {
  lang: LanguageCode;
  name: string;
}
export type LanguageCode = 'en' | 'fr' | 'es' | 'de' | string ; // Add more as needed


export enum CurrencyType {
  REF = "ref",
  SLAVE = "slave"
}

export interface Currencies {
  name: string;
  name_variants: LanguageVariant[];
  symbol: string;
  type: CurrencyType;
  value: number;
}
