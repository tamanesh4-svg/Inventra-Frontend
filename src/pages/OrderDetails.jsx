
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

import {
  ArrowLeft,
  Receipt,
  Calendar,
  Package,
  IndianRupee,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Bell,
  LogOut,
} from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const mobileNav = [
    { label: "Home", path: "/", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: Package },
    { label: "Cart", path: "/cart", icon: ShoppingCart },
    { label: "Orders", path: "/orders", icon: Receipt },
    { label: "Trends", path: "/productanalytics", icon: TrendingUp },
  ];

  if (!order) {
    return (
      <div className="min-h-dvh bg-[#1f1f1f] flex items-center justify-center text-white px-4 text-center">
        <div>
          <div className="animate-pulse text-[#8b7cf6] mb-3">
            <Receipt size={35} className="mx-auto" />
          </div>
          <p className="text-[#b0b0b0]">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#1f1f1f] text-white overflow-x-hidden">

      {/* TOPBAR */}
      <header className="sticky top-0 z-20 bg-[#2a2a2a]/95 backdrop-blur border-b border-[#3a3a3a] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">

        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold truncate">
            Order #{order.id}
          </h1>

          <p className="text-xs sm:text-base text-[#b0b0b0] truncate">
            Complete Order Breakdown
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">

          {/* BACK TO ORDERS - MOBILE AND DESKTOP */}
          <button
            onClick={() => navigate("/orders")}
            aria-label="Back to Orders"
            className="flex border border-[#4a4a4a] hover:bg-[#333333] p-2 sm:px-4 sm:py-2 rounded-xl items-center gap-2 transition shrink-0"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Orders</span>
          </button>

          {/* RESTOCK HISTORY */}
          <button
            onClick={() => navigate("/restock_history")}
            aria-label="Restock History"
            className="relative border border-[#4a4a4a] p-2 rounded-xl text-[#d1d1d1] hover:bg-[#333333]"
          >
            <Bell size={18} />
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="border border-[#4a4a4a] p-2 rounded-xl text-red-400 hover:bg-[#333333]"
          >
            <LogOut size={18} />
          </button>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-5 sm:mb-8">

          {/* ORDER ID */}
          <div className="min-w-0 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-3.5 sm:p-6">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-[#8a8a8a] text-xs sm:text-sm">
                  Order ID
                </p>

                <h2 className="text-xl sm:text-3xl font-bold mt-2 break-all">
                  #{order.id}
                </h2>
              </div>

              <Receipt className="text-[#8b7cf6] shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* CART ID */}
          <div className="min-w-0 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-3.5 sm:p-6">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-[#8a8a8a] text-xs sm:text-sm">
                  Cart ID
                </p>

                <h2 className="text-xl sm:text-3xl font-bold mt-2 break-all">
                  {order.cart_id}
                </h2>
              </div>

              <Package className="text-[#8b7cf6] shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* TOTAL AMOUNT */}
          <div className="col-span-2 lg:col-span-1 min-w-0 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex justify-between items-center gap-3">
              <div className="min-w-0">
                <p className="text-[#8a8a8a] text-xs sm:text-sm">
                  Total Amount
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-green-400 break-words">
                  ₹ {order.total_amount}
                </h2>
              </div>

              <IndianRupee className="text-green-400 shrink-0" />
            </div>
          </div>

        </div>

        {/* ORDER DATE */}
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-5 sm:mb-8 flex items-start sm:items-center gap-3">
          <Calendar className="text-[#8b7cf6] shrink-0 mt-1 sm:mt-0" />

          <div className="min-w-0">
            <p className="text-[#8a8a8a] text-xs sm:text-sm mb-1">
              Order Date
            </p>

            <span className="text-sm sm:text-base break-words">
              {new Date(order.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* ORDERED PRODUCTS */}
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-4 sm:p-6">

          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold">
              Ordered Products
            </h2>

            <span className="text-xs sm:text-sm text-[#8a8a8a] shrink-0">
              {order.items.length} Items
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {order.items.map((item) => (
              <div
                key={item.product_id}
                className="border border-[#3a3a3a] rounded-2xl p-3 sm:p-5 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
              >

                {/* PRODUCT DETAILS */}
                <div className="col-span-2 lg:col-span-1 min-w-0">
                  <h3 className="text-sm sm:text-lg font-semibold break-words">
                    {item.product_name}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="bg-[#5b4ce6]/20 text-[#a99cff] px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm break-words">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* QUANTITY */}
                <div className="text-left lg:text-center min-w-0">
                  <p className="text-[#8a8a8a] text-xs sm:text-sm">
                    Quantity
                  </p>

                  <p className="text-lg sm:text-xl font-bold mt-1">
                    {item.quantity}
                  </p>
                </div>

                {/* UNIT PRICE */}
                <div className="text-left lg:text-center min-w-0">
                  <p className="text-[#8a8a8a] text-xs sm:text-sm">
                    Unit Price
                  </p>

                  <p className="font-bold text-sm sm:text-base mt-1">
                    ₹ {item.price}
                  </p>
                </div>

                {/* SUBTOTAL */}
                <div className="col-span-2 lg:col-span-1 text-left lg:text-right min-w-0">
                  <p className="text-[#8a8a8a] text-xs sm:text-sm">
                    Subtotal
                  </p>

                  <p className="text-green-400 font-bold text-lg sm:text-xl mt-1 break-words">
                    ₹ {item.subtotal}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* GRAND TOTAL */}
          <div className="border-t border-[#3a3a3a] mt-6 sm:mt-8 pt-5 sm:pt-6 flex justify-end">
            <div className="text-right">
              <p className="text-[#8a8a8a] text-sm">
                Grand Total
              </p>

              <h2 className="text-2xl sm:text-4xl font-bold text-green-400 mt-2 break-words">
                ₹ {order.total_amount}
              </h2>
            </div>
          </div>

        </div>

      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#262626] border-t border-[#3a3a3a] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {mobileNav.map(({ label, path, icon: Icon }) => {
            const active = path === "/orders";

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition ${
                  active
                    ? "text-[#8b7cf6] font-medium"
                    : "text-[#b0b0b0]"
                }`}
              >
                <span
                  className={`px-3 py-1 rounded-full ${
                    active
                      ? "bg-[#ece9ff] text-[#5b4ce6]"
                      : ""
                  }`}
                >
                  <Icon size={18} />
                </span>

                {label}
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
