import axiosClient from "@/axios";
import { ProductDescription } from "@/components/ProductView/ProductDescription";
import { ProductDetails } from "@/components/ProductView/ProductDetails";
import { OtherProducts } from "@/components/ProductView/OtherProducts";
import { Loading } from "@/components/ui/loading";
import { PageTitle } from "@/components/ui/page-title";
import { useParams } from "react-router-dom";
import "swiper/css";
import useSWR from "swr";
import {
  Product as TypeProduct,
  ProductDetails as TypeProductDetails,
} from "@/types";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { log } from "console";

const Product = () => {
  const { slug } = useParams();
  const link = "/products/" + slug;
  const { i18n } = useTranslation();
  const fetcher = async () => {
    const response = await axiosClient.get(link);

    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(link, fetcher);
  console.log(data);
  
  const { product }: { product: TypeProductDetails } = data ?? {};
  const { denominations }: { denominations: TypeProduct[] } = data ?? [];

  if (isLoading) {
    return <Loading />;
  }

  const title =
    i18n.language == "en"
      ? product.title_en
      : i18n.language == "fr"
      ? product.title_fr
      : product.title_ar;
  const category =
    i18n.language == "en"
      ? product.category.category_en
      : i18n.language == "fr"
      ? product.category.category_fr
      : product.category.category_ar;

  return (
    <>
      {product && (
        <>
          <Helmet>
            <title lang={i18n.language}>{title}</title>
            <meta name="keywords" content={product.seo.keywords_ar} lang="ar" />
            <meta name="keywords" content={product.seo.keywords_en} lang="en" />
            <meta name="keywords" content={product.seo.keywords_fr} lang="fr" />
            <meta
              name="description"
              content={product.seo.description_ar}
              lang="ar"
            />
            <meta
              name="description"
              content={product.seo.description_en}
              lang="en"
            />
            <meta
              name="description"
              content={product.seo.description_fr}
              lang="fr"
            />
          </Helmet>
          <PageTitle
            page={category}
            link={
              i18n.language == "en"
                ? "Shop"
                : i18n.language == "fr"
                ? "Boutique"
                : "متجر"
            }
            path="/shop"
          />
          <ProductDetails product={product} denominations={denominations} />
          <ProductDescription product={product} mutate={mutate} />
          <OtherProducts />
        </>
      )}
    </>
  );
};

export default Product;