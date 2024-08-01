import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import { Button } from "@/components/ui/button";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { LanguageVariant } from "@/types/Dashboard";
  import axiosClient from "@/axios";
  import useSWR from "swr";
  import { HashLoader } from "react-spinners";
  import {  useState } from "react";
  
  export function Attribution() {
    const columns: ColumnDef<LanguageVariant>[] = [
     
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            className="px-2 py-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
              name
              
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
        header: ({ column }) => (
          <Button
            className="px-2 py-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
              name_variants
              
            </span>
          </Button>
        ),
        cell: ({ row }) => (
          <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
            {row.getValue("name_variants")}
          </span>
        ),
      },
     
      
    ];
    const [link] = useState("/dashboard/products?page=1");
  
    
  
    const fatcher = async () => {
      const response = await axiosClient.get(link);
  
      return response.data;
    };
  
    const { data, isLoading } = useSWR(link, fatcher);
    const { products }: { products: LanguageVariant[] } = data ?? [];
    
   
    const table = useReactTable({
      data: products,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
  
  
    
  
    return (
      <div className="w-full py-4 px-6 bg-white rounded-xl">
        
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
           
          </>
        )}
      </div>
    );
  }
  