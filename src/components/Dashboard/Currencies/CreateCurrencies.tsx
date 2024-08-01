import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormGroup } from "@/components/Dashboard/ui/FormGroup";
import { toast } from "sonner";
import axiosClient from "@/axios";
import { KeyedMutator } from "swr";
import { Button } from "@/components/ui/button";

interface NameVariant {
  lang: string;
  name: string;
}

export const CreateCurrencies = ({ mutate }: { mutate: KeyedMutator<any> }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [nameVariants, setNameVariants] = useState<NameVariant[]>([{ lang: '', name: '' }]);

  const handleAddVariant = () => {
    setNameVariants([...nameVariants, { lang: '', name: '' }]);
  };

  const handleVariantChange = (index: number, field: keyof NameVariant, value: string) => {
    const newVariants = [...nameVariants];
    newVariants[index][field] = value;
    setNameVariants(newVariants);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      name_variants: nameVariants,
      symbol: formData.get("symbol"),
      type: formData.get("type"),
      value: formData.get("value"),
    };
    const target: any = event.target;

    setLoading(true);

    axiosClient
      .post("/dashboard/categories", data)
      .then((response) => {
        toast("Success!", {
          description: response.data.message || "Currency created successfully",
          className: "bg-green-600 border-0",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
        mutate();

        target.reset();
        setNameVariants([{ lang: '', name: '' }]); // Reset name variants
      })
      .catch((error) => {
        if (error.response.status == 422) {
          Object.keys(error.response.data.errors).forEach((key: string) => {
            error.response.data.errors[key].forEach((errorMessage: string) => {
              toast("Error validation failed " + key, {
                description: errorMessage,
                className: "bg-red-600 border-0",
                action: {
                  label: "Close",
                  onClick: () => {},
                },
              });
            });
          });
        } else {
          toast("Error!", {
            description: error.response?.data?.message || "An error occurred",
            className: "bg-red-600 border-0",
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button className="text-white bg-green-600 px-5 py-3 rounded-xl font-['Lato'] font-semibold">
          Add New Currency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[636px] bg-white">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Currency</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 grid-cols-2 py-4">
            <div className="col-span-1">
              <FormGroup
                title="name"
                placeholder="name"
                name="name"
                type="text"
              />
            </div>
            {nameVariants.map((variant, index) => (
              <div key={index} className="col-span-2 flex gap-4">
                <input
                  type="text"
                  placeholder="Language"
                  value={variant.lang}
                  onChange={(e) => handleVariantChange(index, 'lang', e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <input
                  type="text"
                  placeholder="Name Translation"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Name Variant
              </button>
            </div>
            <div className="col-span-1">
              <FormGroup
                title="symbol"
                placeholder="symbol"
                name="symbol"
                type="text"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                Type
              </label>
              <select
                id="type"
                name="type"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="ref">Reference</option>
                <option value="slave">Slave</option>
              </select>
            </div>
            <div className="col-span-1">
              <FormGroup
                title="value"
                placeholder="value"
                name="value"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="px-5 py-3 bg-blue-600 rounded-xl disabled:opacity-60"
              disabled={loading}
            >
              <span className="text-white text-base font-normal">
                {loading ? "Loading..." : "Save changes"}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
