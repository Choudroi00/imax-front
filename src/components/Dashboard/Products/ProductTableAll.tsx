import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
import { AllProduct } from "@/types/Dashboard";
import axiosClient from "@/axios";
import useSWR from "swr";
import { HashLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { PaginationContainer } from "../ui/PaginationContainer";
import { debounce } from "lodash";
import { toast } from "sonner";

export function ProductTableAll() {
  const columns: ColumnDef<AllProduct>[] = [
    {
      accessorKey: "image",
      header: () => (
        <Button className="px-2 py-4">
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize">
            Image
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <img
          src={/*row.getValue("image")*/ "https://th.bing.com/th/id/OIP.wyS54dWv02tzWeNTGgM8KgHaFW?rs=1&pid=ImgDetMain"}
          alt="image"
          className="w-14 h-14 rounded-2xl"
        />
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          className="px-2 py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
            Title
            <ArrowUpDown className="h-4 w-4" />
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
          {row.getValue("title")}
        </span>
      ),
    },
    {
      accessorKey: "short_description",
      header: ({ column }) => (
        <Button
          className="px-2 py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
            Short description
            <ArrowUpDown className="h-4 w-4" />
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
          {row.getValue("short_description")}
        </span>
      ),
    },
    {
      accessorKey: "totalPriceCalculation",
      header: ({ column }) => (
        <Button
          className="px-2 py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
            Total price calculation
            <ArrowUpDown className="h-4 w-4" />
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
          {row.getValue("totalPriceCalculation")}
        </span>
      ),
    },
    {
      accessorKey: "short_description",
      header: ({ column }) => (
        <Button
          className="px-2 py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
            Short description
            <ArrowUpDown className="h-4 w-4" />
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
          {row.getValue("short_description")}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          className="px-2 py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
            category
            <ArrowUpDown className="h-4 w-4" />
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
          {row.getValue("category")}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          className="px-2 py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
            price
            <ArrowUpDown className="h-4 w-4" />
          </span>
        </Button>
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);

        return (
          <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato']">
            {formatted}
          </span>
        );
      },
    },
    {
      accessorKey: "rate",
      header: ({ column }) => (
        <Button
          className="px-2 py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-slate-500 text-xs font-normal font-['Lato'] capitalize flex gap-2">
            rate
            <ArrowUpDown className="h-4 w-4" />
          </span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="py-4 px-2 text-stone-950 text-xs font-normal font-['Lato'] flex gap-2">
          {row.getValue("rate")}{" "}
          <img
            src="/icons/star.svg"
            alt="star"
            width={12}
            height={12}
            className="w-3 h-3"
          />
        </span>
      ),
    },
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
        const product = row.original;

        return (
          <div
            className="flex items-center disabled:cursor-not-allowed disabled:opacity-60"
            aria-disabled={loading}
          >
            <Button
              className="w-6 h-6"
              onClick={() => handleDelete(product.id)}
            >
              <img
                src="/icons/delete.svg"
                alt="delete"
                width={13}
                height={16}
              />
            </Button>
            <Button
              className="w-6 h-6"
              to={"/dashboard/products/update/" + product.id}
            >
              <img
                src="/icons/update.svg"
                alt="update"
                width={14}
                height={14}
              />
            </Button>
            <Button
              className="w-6 h-6"
              to={"/dashboard/products/" + product.slug}
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
  const [link, setLink] = useState("/dashboard/products?page=1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const fatcher = async () => {
    const response = await axiosClient.get(link);

    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(link, fatcher);
  const { products }: { products: AllProduct[] } = data ?? [];
  const [loading, setLoading] = useState(false);
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

      return `/dashboard/products?page=${currentPage}${query}`;
    };

    setLink(buildLink());
    mutate();
  }, [currentPage, searchQuery]);

  const handleDelete = (id: number | string) => {
    axiosClient
      .delete("/dashboard/products/" + id)
      .then((response) => {
        toast("Success!", {
          description: response.data.message || "Product deleted successfully",
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
        setLoading(false);
      });
  };

  return (
    <div className="w-full py-4 px-6 bg-white rounded-xl">
      <div className="flex">
        <Input
          placeholder="Filter titles..."
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
