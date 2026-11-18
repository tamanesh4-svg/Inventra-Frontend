
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import {
  ArrowLeft,
  Receipt,
  Calendar,
  IndianRupee,
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Bell,
  LogOut,
} from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
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

  return (
    <div className="min-h-dvh bg-[#1f1f1f] text-white overflow-x-hidden">

      {/* TOPBAR */}
      <header className="sticky top-0 z-20 bg-[#2a2a2a]/95 backdrop-blur border-b border-[#3a3a3a] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">

        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold truncate">
            Order History
          </h1>

          <p className="text-xs sm:text-base text-[#b0b0b0] truncate">
            View all completed orders
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">

          {/* BACK BUTTON - MOBILE AND DESKTOP */}
<button
  onClick={() => navigate("/")}
  aria-label="Back to Home"
  className="flex border border-[#4a4a4a] hover:bg-[#333333] p-2 sm:px-4 sm:py-2 rounded-xl items-center gap-2 transition shrink-0"
>
  <ArrowLeft size={18} />
  <span className="hidden sm:inline">Back</span>
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

        {orders.length === 0 ? (

          /* EMPTY STATE */
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center">

            <Receipt
              size={45}
              className="mx-auto text-[#5b4ce6] mb-4"
            />

            <h2 className="text-xl sm:text-2xl font-bold">
              No Orders Yet
            </h2>

            <p className="text-[#8a8a8a] mt-2 text-sm sm:text-base">
              Orders will appear here after checkout
            </p>

            <button
              onClick={() => navigate("/cart")}
              className="mt-6 bg-[#5b4ce6] hover:bg-[#6b5bf0] px-5 py-3 rounded-xl text-sm sm:text-base font-medium transition"
            >
              Go to Cart
            </button>

          </div>

        ) : (

          /* ORDER CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

            {orders.map((order) => (

              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/orders/${order.id}`);
                  }
                }}
                className="min-w-0 cursor-pointer bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-[#5b4ce6] transition duration-300 focus:outline-none focus:border-[#8b7cf6]"
              >

                {/* TOP */}
                <div className="flex justify-between items-start gap-3 mb-5 sm:mb-6">

                  <div className="min-w-0">

                    <p className="text-[#8a8a8a] text-xs sm:text-sm">
                      Order ID
                    </p>

                    <h2 className="text-xl sm:text-2xl font-bold break-all">
                      #{order.id}
                    </h2>

                  </div>

                  <div className="bg-[#353535] p-2.5 sm:p-3 rounded-2xl shrink-0">

                    <Receipt
                      size={20}
                      className="text-[#8b7cf6]"
                    />

                  </div>

                </div>

                {/* DATE */}
                <div className="flex items-start gap-3 mb-4 text-[#b0b0b0]">

                  <Calendar
                    size={16}
                    className="shrink-0 mt-1"
                  />

                  <span className="text-xs sm:text-sm break-words">
                    {new Date(order.created_at).toLocaleString()}
                  </span>

                </div>

                {/* CART */}
                <div className="mb-4 min-w-0">

                  <p className="text-[#8a8a8a] text-xs sm:text-sm">
                    Cart ID
                  </p>

                  <p className="font-semibold text-sm sm:text-base break-all">
                    {order.cart_id}
                  </p>

                </div>

                {/* TOTAL */}
                <div className="pt-4 border-t border-[#3a3a3a] flex flex-wrap justify-between items-center gap-2">

                  <span className="text-[#8a8a8a] text-xs sm:text-sm">
                    Total Amount
                  </span>

                  <div className="flex items-center gap-1 text-green-400 font-bold text-lg sm:text-xl">

                    <IndianRupee size={17} />

                    {order.total_amount}

                  </div>

                </div>

                {/* FOOTER */}
                <div className="mt-4 text-right">

                  <span className="text-[#8b7cf6] text-xs sm:text-sm">
                    View Details →
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

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
