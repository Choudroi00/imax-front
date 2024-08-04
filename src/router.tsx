import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./views/Home";
import LayoutGuest from "./layouts/LayoutGuest";
import Login from "./views/Auth/Login";
import Signup from "./views/Auth/Singup";
import Verification from "./views/Auth/Verification";
import ForgotPassword from "./views/Auth/ForgotPassword";
import ResetPassword from "./views/Auth/ResetPassword";
import Profile from "./views/Profile";
import Products from "./views/Products";
import Product from "./views/Product";
import Error404 from "./views/Error404";
import Checkout from "./views/Checkout";
import LayoutDashboard from "./layouts/LayoutDashboard";
import Dashboard from "./views/Dashboard/Dashboard";
import ProductView from "./views/Dashboard/ProductView";
import ProductsDashboard from "./views/Dashboard/Products";
import ProductDasboard from "./views/Dashboard/Product";
import Categories from "./views/Dashboard/Categories";
import Cart from "./views/Cart";
import Feedback from "./views/Dashboard/Feedback";
import CategoryView from "./views/Dashboard/CategoryView";
import Customers from "./views/Dashboard/Customers";
import CustomerView from "./views/Dashboard/CustomerView";
import RequireAuth from "./layouts/RequireAuth";
import { Loading } from "./components/ui/loading";
import Codes from "./views/Dashboard/Code";
import CheckoutSuccess from "./views/CheckoutSuccess";
import OrderView from "./views/Dashboard/OrderView";
import Coupons from "./views/Dashboard/Coupons";
import Currencies from "./views/Dashboard/Currencies";
import Attributes from "./views/Dashboard/Attributes";

const router = createBrowserRouter([
  {
    loader: () => <Loading />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/404",
        element: <Error404 />,
      },
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/shop",
            element: <Products />,
          },
          {
            path: "/shop/product/:slug",
            element: <Product />,
          },
          {
            path: "/checkout/success",
            element: <CheckoutSuccess />,
          },
          {
            path: "/",
            element: <RequireAuth />,
            children: [
              {
                path: "/profile",
                element: <Profile />,
              },
              {
                path: "/cart",
                element: <Cart />,
              },
              {
                path: "/checkout",
                element: <Checkout />,
              },
            ],
          },
        ],
      },
      {
        path: "/",
        element: <LayoutGuest />,
        children: [
          {
            path: "auth/login",
            element: <Login />,
          },
          {
            path: "auth/signup",
            element: <Signup />,
          },
          {
            path: "auth/verification",
            element: <Verification />,
          },
          {
            path: "auth/forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "auth/reset-password",
            element: <ResetPassword />,
          },
        ],
      },
      {
        path: "/",
        element: <LayoutDashboard />,
        children: [
          {
            path: "dashboard/",
            element: <Dashboard />,
          },
          {
            path: "dashboard/products",
            element: <ProductsDashboard />,
          },
          {
            path: "dashboard/products/add",
            element: <ProductView />,
          },
          {
            path: "dashboard/products/update/:id",
            element: <ProductView />,
          },
          {
            path: "dashboard/categories",
            element: <Categories />,
          },
          {
            path: "dashboard/categories/:id",
            element: <CategoryView />,
          },
          {
            path: "dashboard/products/:slug",
            element: <ProductDasboard />,
          },
          {
            path:"dashboard/attributes",
            element: <Attributes />
          },
          {
            path: "dashboard/feedback",
            element: <Feedback />,
          },
          {
            path: "dashboard/customers",
            element: <Customers />,
          },
          {
            path: "dashboard/customers/:id",
            element: <CustomerView />,
          },
          {
            path: "dashboard/codes",
            element: <Codes />,
          },
          {
            path: "dashboard/coupons",
            element: <Coupons />,
          },
          {
            path: "dashboard/orders/:id",
            element: <OrderView />,
          },
          {
            path: "dashboard/currencies",
            element: <Currencies />,
          },
        ],
      },
    ],
  },
]);

export default router;
