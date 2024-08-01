import axiosClient from "@/axios";
import { PageTitle } from "@/components/Dashboard/ui/PageTitle";
import {CreateCurrencies} from "@/components/Dashboard/Currencies/CreateCurrencies";
import { Toaster } from "@/components/ui/sonner";
import useSWR from "swr";
import { CurrenciesTable } from "@/components/Dashboard/Currencies/CurrenciesTable";

export enum CurrencyType {
  REF = "ref",
  SLAVE = "slave"
}
export interface Currency {
  name: string,
  name_variants: JSON
  symbol: string,
  type: CurrencyType
  value: number
}

const Currencies = () => {
  const link = "/dashboard/currencies";

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
          title="All Currencies"
          array={[
            {
              name: "Currencies",
            },
          ]}
        />
        <CreateCurrencies mutate={mutate}/>
      </div>
      <div className="col-span-4 mt-5">
       <CurrenciesTable />

      </div>
    </section>
  );
};

export default Currencies;
