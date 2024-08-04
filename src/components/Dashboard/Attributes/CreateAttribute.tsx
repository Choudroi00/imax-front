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
import { XIcon } from "lucide-react";

interface NameVariant {
  lang: string;
  name: string;
}

export const CreateAttribute = ({ mutate }: { mutate: KeyedMutator<any> }) => {
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

  const handleRemVariant = (indexx: number)=>{
    setNameVariants((prevState)=>{ return [...prevState.filter((item,index)=> index !== indexx)] })
  }

  const postCurrency = (event:React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      name_variants: nameVariants,
      
    };

    const target: any = event.target;

    axiosClient
    .post('/dashboard/attributes', data)
    .then((resp)=>{
      toast("Success!", {
        description: resp.data.message || "Attribute created successfully",
        className: "bg-green-600 border-0",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
      mutate();

      target.reset();
      setNameVariants([{ lang: '', name: '' }]);
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




  }

  

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button className="text-white bg-green-600 px-5 py-3 rounded-xl font-['Lato'] font-semibold">
          Add New Attribute
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[636px] bg-white">
        <form className={"select-none"} onSubmit={postCurrency}>
          <DialogHeader>
            <DialogTitle>New Attribute</DialogTitle>
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
                  name={`variant.${index}.lang`}
                  placeholder="Language"
                  value={variant.lang}
                  onChange={(e) => handleVariantChange(index, 'lang', e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <input
                  type="text"
                  name={`variant.${index}.name`}
                  placeholder="Name Translation"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                <button type="button" onClick={(e)=> handleRemVariant(index)} className="p-3 hover:bg-slate-100 ease-in duration-150 rounded-xl transition" >
                  <XIcon />
                </button>

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
