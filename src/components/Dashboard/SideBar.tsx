import { CategoriesIcon } from "@/assets/svg/CategoriesIcon";
import { CodeIcon } from "@/assets/svg/CodeIcon";
import { DashboardIcon } from "@/assets/svg/DashboardIcon";
import { FeedbackIcon } from "@/assets/svg/FeedbackIcon";
import { ProductsIcon } from "@/assets/svg/ProductsIcon";
import { UserIcon } from "@/assets/svg/UserIcon";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const links = [
  {
    icon: DashboardIcon,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: ProductsIcon,
    name: "Products",
    path: "/dashboard/products",
  },
  {
    icon: CategoriesIcon,
    name: "categories",
    path: "/dashboard/categories",
  },
  {
    icon: CategoriesIcon,
    name: "currencies",
    path: "/dashboard/currencies",
  },
  {
    icon: FeedbackIcon,
    name: "Feedback",
    path: "/dashboard/feedback",
  },
  {
    icon: UserIcon,
    name: "Customers",
    path: "/dashboard/customers",
  },
  {
    icon: CodeIcon,
    name: "Codes",
    path: "/dashboard/codes",
  },
  {
    icon: CodeIcon,
    name: "Coupons",
    path: "/dashboard/coupons",
  },
];

export const SideBar = ({ isOpen }: { isOpen: boolean }) => {
  const { pathname } = useLocation();

  return (
    <div className="w-full h-full px-4 py-6">
      <div>
        <Link to="/dashboard" className="flex gap gap-2.5 items-center w-full">
          <img
            src="/images/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="w-12 h-12"
          />

          <span
            className={cn(
              "text-stone-800 text-3xl font-normal font-['Righteous'] transition-all",
              isOpen
                ? "inline-block opacity-100 visible"
                : "opacity-0 invisible"
            )}
          >
            IMAX
          </span>
        </Link>
      </div>
      <ul className="flex flex-col gap-2 mt-8">
        {links.map((link) => {
          const active = link.path == pathname || link.path + "/" == pathname;

          return (
            <li key={link.path} className="w-full">
              <Link
                to={link.path}
                className={cn(
                  "p-3 rounded-xl flex gap-3 items-center justify-start text-current transition-all hover:text-blue-600 hover:fill-blue-600 hover:bg-indigo-50 w-full flex-wrap h-12 overflow-hidden",
                  active
                    ? "text-blue-600 fill-blue-600 bg-indigo-50"
                    : "text-neutral-500 fill-neutral-500"
                )}
              >
                <link.icon className="fill-current block w-6 h-6" />
                <span
                  className={cn(
                    "text-current font-semibold font-['Lato'] text-base capitalize transition-all",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  )}
                >
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
