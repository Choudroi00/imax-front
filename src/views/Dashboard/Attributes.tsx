import axiosClient from "@/axios";
import { CreateCurrencies } from "@/components/Dashboard/Currencies/CreateCurrencies";
import { CurrenciesTable } from "@/components/Dashboard/Currencies/CurrenciesTable";
import { PageTitle } from "@/components/Dashboard/ui/PageTitle";
import { Toaster } from "sonner";
import useSWR from "swr";
import { Currency } from "./Currencies";
import { CreateAttribute } from "@/components/Dashboard/Attributes/CreateAttribute";
import { AttributesTable } from "@/components/Dashboard/Attributes/AttributesTable";




const  Attributes = ()=>{
    const link = "/dashboard/attributes";

  const fatcher = async () => {
    const response = await axiosClient.get(link);

    return response.data;
  };

  const {  data, isLoading,mutate } = useSWR(link, fatcher);

  const { currencies } : {currencies : Currency[] } = data ?? []
 
  return (
    <section className="w-full">
      <Toaster />
      <div className="flex justify-between items-end">
        <PageTitle
          title="All Attributes"
          array={[
            {
              name: "Attributes",
            },
          ]}
        />
        <CreateAttribute mutate={mutate}/>
      </div>
      <div className="col-span-4 mt-5">
       <AttributesTable />

      </div>
    </section>
  );
}

export default Attributes