import {
    
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
  import { Currencies } from "@/types/Dashboard";
  import axiosClient from "@/axios";
  import useSWR from "swr";
  import { HashLoader } from "react-spinners";
  import { useEffect, useState } from "react";
  import { PaginationContainer } from "../ui/PaginationContainer";
  import { debounce } from "lodash";
  
  export function CurrenciesTable() {
    const columns = [
      {
        accessorKey: "name",
        header: () => (
          <Button className="px-2 py-4">
            <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
              Name
            </span>
          </Button>
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
        
      },
      {
        accessorKey: "symbol",
        header: () => (
          <Button className="px-2 py-4">
            <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
              symbol
            </span>
          </Button>
        ),
        
      },
      {
        accessorKey: "type",
        header: () => (
          <Button className="px-2 py-4">
            <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
              type
            </span>
          </Button>
        ),
        
      },
      {
        accessorKey: "value",
        header: () => (
          <Button className="px-2 py-4">
            <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
              value
            </span>
          </Button>
        ),
        
      },
      
    ];
  
    const [link, setLink] = useState("/dashboard/currencies");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
  
    const fatcher = async () => {
      const response = await axiosClient.get(link);
  
      return response.data;
    };
  
    const { data, isLoading, mutate } = useSWR(link, fatcher);
    const { products }: { products: Currencies[] } = data ?? [];
    const onSearchChange = debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
      },
      500
    );
    const table = useReactTable({
      data: products,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
    const onPageChange = (page: number) => {
      setCurrentPage(page);
    };
  
    useEffect(() => {
      const buildLink = () => {
        let query = "";
        if (searchQuery) {
          query += `&search=${searchQuery}`;
        }
  
        return `/dashboard/orders?page=${currentPage}${query}`;
      };
  
      setLink(buildLink());
      mutate();
    }, [currentPage, searchQuery]);
  
    return (
      <div className="w-full py-4 px-6 bg-white rounded-xl">
        <div className="flex">
          <Input
            placeholder="Filter title,email,name,order id..."
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
            {products && (
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
  