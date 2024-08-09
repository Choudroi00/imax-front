import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { HashLoader } from "react-spinners";
import { Currency } from "@/views/Dashboard/Currencies";

interface NameVariant {
  lang: string;
  name: string;
}

const CurrencyView = () => {
  const { id } = useParams<{ id: string }>(); // get currency ID from the URL
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [nameVariants, setNameVariants] = useState<NameVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axiosClient
        .get(`/dashboard/currencies/${id}`)
        .then((response) => {
          setCurrency(response.data.currency);
          setNameVariants(response.data.currency.name_variants || []);
        })
        .catch(() => {
          toast("Error!", {
            description: "Failed to load currency details.",
            className: "bg-red-600 border-0",
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleUpdate = () => {
    if (currency) {
      setIsUpdating(true);
      const updatedCurrency = {
        ...currency,
        name_variants: nameVariants,
      };
      axiosClient
        .put(`/dashboard/currencies/${id}`, updatedCurrency)
        .then((response) => {
          toast("Success!", {
            description: response.data.message || "Currency updated successfully",
            className: "bg-green-600 border-0",
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
          navigate("/dashboard/currencies"); // Navigate back to the currency list
        })
        .catch((error) => {
          toast("Error!", {
            description: error.response?.data?.message || "An error occurred",
            className: "bg-red-600 border-0",
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrency((prevCurrency) => prevCurrency ? { ...prevCurrency, [name]: value } : null);
  };

  const handleVariantChange = (index: number, key: keyof NameVariant, value: string) => {
    const updatedVariants = [...nameVariants];
    updatedVariants[index][key] = value;
    setNameVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setNameVariants([...nameVariants, { lang: "", name: "" }]);
  };

  const handleRemVariant = (index: number) => {
    const updatedVariants = nameVariants.filter((_, i) => i !== index);
    setNameVariants(updatedVariants);
  };

  if (isLoading) {
    return (
      <div className="w-full h-80 flex justify-center items-center bg-white">
        <HashLoader color="#1577EB" />
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-6 bg-white rounded-xl">
      <h2 className="text-xl font-semibold text-stone-950">Currency Details</h2>
      <div className="mt-6">
        <div className="flex flex-col gap-4">
          <label>Name</label>
          <Input
            name="name"
            value={currency?.name || ""}
            onChange={handleInputChange}
            className="max-w-sm"
          />
          <label>Symbol</label>

          <Input
            name="symbol"
            value={currency?.symbol || ""}
            onChange={handleInputChange}
            className="max-w-sm"
          />
          <label>Type</label>

          <Input
            name="type"
            value={currency?.type || ""}
            onChange={handleInputChange}
            className="max-w-sm"
          />
          <label>Value</label>

          <Input
            name="value"
            value={currency?.value || ""}
            onChange={handleInputChange}
            className="max-w-sm"
          />
          <label>Name Variant</label>

          {nameVariants.map((variant, index) => (
            <div key={index} className="col-span-2 flex gap-4">
              <Input
                name={`variant.${index}.lang`}
                placeholder="Language"
                value={variant.lang}
                onChange={(e) => handleVariantChange(index, 'lang', e.target.value)}
                className="max-w-sm"
              />
              <Input
                name={`variant.${index}.name`}
                placeholder="Name Translation"
                value={variant.name}
                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                className="max-w-sm"
              />
              <Button
                type="button"
                onClick={() => handleRemVariant(index)}
                className="text-red-600"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddVariant}
            className="bg-blue-600 text-white font-bold py-3 px-5 rounded-xl"
          >
            Add Name Variant
          </Button>
        </div>
        <div className="mt-6">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-blue-600 text-white font-bold py-3 px-5 rounded-xl"
          >
            {isUpdating ? "Updating..." : "Update Currency"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyView;
