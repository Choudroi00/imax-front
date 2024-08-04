import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import { Currencies } from "@/types/Dashboard";
import axiosClient from "@/axios";
import useSWR from "swr";
import { HashLoader } from "react-spinners";
import { Attributes, useEffect, useState } from "react";
import { PaginationContainer } from "../ui/PaginationContainer";
import { debounce } from "lodash";
import { Currency } from "@/views/Dashboard/Currencies";
import { toast } from "sonner";
import {LanguageVariant} from "@/types/Dashboard";
import { ProductAttributeInfo } from "@/types";

export function AttributesTable() {
  const columns : ColumnDef<ProductAttributeInfo>[] = [
    {
      accessorKey: "name",
      header: () => (
        <Button className="px-2 py-4">
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
            Name
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
          {row.getValue("name")}
        </span>
      ),
      
    },
    {
      accessorKey: "name_variants",
      header: () => (
        <Button className="px-2 py-4">
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
            Name Variant
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
          {JSON.parse( row.getValue("name_variants") ).length   } translation found : { (JSON.parse( row.getValue("name_variants") ) as LanguageVariant[]).map((item:LanguageVariant)=>item.lang.toUpperCase()).join(', ') }
        </span>
      ),
      
    },
    // {
    //   accessorKey: "symbol",
    //   header: () => (
    //     <Button className="px-2 py-4">
    //       <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
    //         symbol
    //       </span>
    //     </Button>
    //   ),
    //   cell: ({ row }) => (
    //     <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
    //       {row.getValue("symbol")}
    //     </span>
    //   ),
      
    // },
    // {
    //   accessorKey: "type",
    //   header: () => (
    //     <Button className="px-2 py-4">
    //       <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
    //         type
    //       </span>
    //     </Button>
    //   ),
    //   cell: ({ row }) => (
    //     <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
    //       {row.getValue("type")}
    //     </span>
    //   ),
      
    // },
    // {
    //   accessorKey: "value",
    //   header: () => (
    //     <Button className="px-2 py-4">
    //       <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
    //         value
    //       </span>
    //     </Button>
    //   ),
    //   cell: ({ row }) => (
    //     <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
    //       {row.getValue("value")}
    //     </span>
    //   ),
      
    // },
    {
      id: "actions",
      header: () => (
        <Button className="px-2 py-4">
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
            Actions
          </span>
        </Button>
      ),
      cell: ({ row }) => {
        const attribute = row.original;

        return (
          <div
            className="flex items-center disabled:cursor-not-allowed disabled:opacity-60"
            aria-disabled={isLoading}
          >
            <Button
              className="w-6 h-6"
              onClick={() => handleDelete(attribute.id ? attribute.id : -1)}
            >
              <img
                src="/icons/delete.svg"
                alt="delete"
                width={13}
                height={16}
              />
            </Button>
            {/* <Button
              className="w-6 h-6"
              to={"/dashboard/currencies/update/" + currency.id}
            >
              <img
                src="/icons/update.svg"
                alt="update"
                width={14}
                height={14}
              />
            </Button> */}
            <Button
              className="w-6 h-6"
              to={`/dashboard/attribute/${attribute.id}`}
            >
              <img
                src="/icons/eye-view.svg"
                alt="eye-view"
                width={16}
                height={12}
              />
            </Button>
          </div>
        );
      },
    },
    
  ];


  //const link = "/dashboard/currencies";

  const handleDelete = (id: number)=>{

    const handleDelete = (id: number | string) => {
      axiosClient
        .delete("/dashboard/attribute/" + id)
        .then((response) => {
          toast("Success!", {
            description: response.data.message || "Attribute deleted successfully",
            className: "bg-green-600 border-0",
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
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
          
        });
    };

    handleDelete(id);
  }

  const fatcher = async () => {
    const response = await axiosClient.get(link);

    return response.data;
  };

  

  const [link, setLink] = useState("/dashboard/attributes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [attributePage, setAttributePage] = useState(1);

  const {  data, isLoading,mutate } = useSWR(link, fatcher);

  const { attributes } : {attributes : ProductAttributeInfo[] } = data ?? []

  // const fetcher = async () => {
  //   const response = await axiosClient.get(link);
  //   return response.data;
  // };

  //const { data, isLoading, mutate } = useSWR(link, fetcher);
  //const products: Currencies[] = data?.products ?? [];

  // Log the data to debug
  console.log("Data:", data);
  //console.log("Products:", products);

  const onSearchChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchQuery(value);
    },
    500
  );

  const table = useReactTable({
    data: attributes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onPageChange = (page: number) => {
    setAttributePage(page);
  };

  useEffect(() => {
    const buildLink = () => {
      let query = "";
      if (searchQuery) {
        query += `&search=${searchQuery}`;
      }
      return `/dashboard/attributes?page=${attributePage}${query}`;
    };

    setLink(buildLink());
    mutate();
  }, [attributePage, searchQuery]);

  return (
    <div className="w-full py-4 px-6 bg-white rounded-xl">
      <div className="flex">
        <Input
          placeholder="Filter currency , symbol..."
          onChange={onSearchChange}
          className="max-w-sm"
        />
      </div>
      {isLoading ? (
        <div className="w-full h-80 flex justify-center items-center bg-white">
          <HashLoader color="#1577EB" />
        </div>
      ) : (
        <>
          <div className="mt-6">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {data && (
            <PaginationContainer
              totalPages={data.last_page}
              currentPage={data.current_page}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
