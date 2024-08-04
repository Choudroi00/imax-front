import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loading } from "./ui/loading";
import { useStateContext } from "@/contexts/ContextProvider";
import { Currencies } from "@/types/Dashboard";
import useSWR from "swr";
import axiosClient from "@/axios";
import { log } from "console";

export const Currencys = () => {
  const { currency, setCurrency } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrs ] = useState<Currencies[]>() ;

  
  const [link, setLink] = useState("/currencies");

  const fatcher = async () => {
    
  };

  useEffect(()=>{
    if(currencies){
      return
    
    }
    const fet = async () =>{
      const response = await axiosClient.get(link);
      const data = response.data
      const { currencies = [] } = data;
      
      
      setCurrs(currencies);

      //localStorage.setItem("currency", JSON.stringify( currencies[0]) );

      fet()

      
    }

    

    //console.log(currency);
    
    

    

    
    

    //setCurrs(currenci)
  })
  //const {  data, isLoading,mutate } = useSWR(link, fatcher);

  //console.log(data);
  

  //const {currencies } : {currencies : Currencies[]} = data



  const handleCurrencyChange = (value: string) => {
    if (value == currency) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setCurrency( currencies?.find((item)=> item.name === value))
    localStorage.setItem("currency", JSON.stringify( currencies?.find((item)=> item.name === value)) );
  };

  return (
    <>
      {loading && <Loading />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-[66px] p-3 gap-2 rounded border border-black/15 bg-white ms-1 uppercase text-sm font-medium">
            {currency?.name}
            <img
              src="/icons/arrow-down.svg"
              alt="arrow down"
              width={10}
              height={12}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[66px] bg-white p-0">
          <DropdownMenuRadioGroup
            value={''}
            onValueChange={handleCurrencyChange}
          >
            {currencies?.map((currenc) => (
              <DropdownMenuRadioItem
                value={currenc.name? currenc.name : ""}
                className="flex gap-2 justify-start hover:bg-gray-100"
                key={currenc.name}
              >
                <span className="text-neutral-800 text-xs font-bold font-['Cairo'] uppercase">
                  {currenc.name}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
