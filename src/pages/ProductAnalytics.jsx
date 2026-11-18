
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Bell,
  LogOut,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function ProductAnalytics() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Decode JWT to get user name
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User");
      } catch {
        console.log("Invalid token");
      }
    }
  }, []);

  // Fetch demand analytics
  const fetchDemandData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/products/demand");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getDemandStyle = (demand) => {
    if (demand === "High") {
      return "bg-green-900/50 text-green-300 border border-green-800";
    }

    if (demand === "Medium") {
      return "bg-yellow-900/50 text-yellow-300 border border-yellow-800";
    }

    return "bg-red-900/50 text-red-300 border border-red-800";
  };

  const getDemandLabel = (demand) => {
    if (demand === "High") return "🔥 High Demand";
    if (demand === "Medium") return "⚡ Medium Demand";
    if (demand === "Low") return "🥶 Low Demand";
    return demand || "Unknown Demand";
  };

  return (
    <div className="flex min-h-screen bg-[#1f1f1f] text-white">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-[250px] bg-[#262626] border-r border-[#3a3a3a] flex-col shrink-0">

        {/* Logo */}
        <div className="p-6 border-b border-[#3a3a3a]">
          <h1 className="text-2xl font-bold text-[#8b7cf6]">
            Inventra
          </h1>

          <p className="text-sm text-[#b0b0b0] mt-1">
            Inventory Manager
          </p>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-6">

          <p className="text-xs text-[#8a8a8a] mb-3 uppercase tracking-wider">
            Main
          </p>

          <div className="space-y-2">

            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1] transition"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1] transition"
            >
              <Package size={20} />
              Products
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1] transition"
            >
              <ShoppingCart size={20} />
              Cart
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1] transition"
            >
              <Receipt size={20} />
              Orders
            </button>

          </div>

          <p className="text-xs text-[#8a8a8a] mt-10 mb-3 uppercase tracking-wider">
            Insights
          </p>

          <div className="space-y-2">

            {/* Active Page */}
            <button
              onClick={() => navigate("/productanalytics")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ece9ff] text-[#5b4ce6] font-medium"
            >
              <TrendingUp size={20} />
              Usage Trends
            </button>

            <button
              onClick={() => navigate("/restock_history")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1] transition"
            >
              <Bell size={20} />
              Restock History
            </button>

          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t border-[#3a3a3a] flex items-center justify-between">

          <div className="min-w-0">
            <p className="font-semibold text-white truncate">
              {userName}
            </p>

            <p className="text-sm text-[#a0a0a0]">
              Store Manager
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 transition"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>

        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-w-0 overflow-y-auto">

       
{/* ================= MOBILE TOPBAR ================= */}
<div className="md:hidden sticky top-0 z-30 bg-[#2a2a2a] border-b border-[#3a3a3a] px-4 py-3">

  <div className="flex items-center justify-between gap-3">

    {/* LEFT SIDE - TITLE */}
    <div className="min-w-0">
      <h2 className="font-bold text-base truncate">
        Usage Trends
      </h2>

      <p className="text-xs text-[#a0a0a0] truncate">
        Product demand analytics
      </p>
    </div>

    {/* RIGHT SIDE - ACTION BUTTONS */}
    <div className="flex items-center gap-2 shrink-0">

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="p-2 rounded-lg border border-[#454545] hover:bg-[#383838] transition"
        aria-label="Back to Home"
      >
        <ArrowLeft size={19} />
      </button>

      {/* Refresh */}
      <button
        onClick={fetchDemandData}
        disabled={loading}
        className="p-2 rounded-lg hover:bg-[#383838] text-[#bdbdbd] disabled:opacity-50"
        aria-label="Refresh analytics"
      >
        <RefreshCw
          size={18}
          className={loading ? "animate-spin" : ""}
        />
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-[#383838] text-red-400"
        aria-label="Logout"
      >
        <LogOut size={19} />
      </button>

    </div>
  </div>
</div>


        {/* ================= DESKTOP TOPBAR ================= */}
        <div className="hidden md:block bg-[#2a2a2a] border-b border-[#3a3a3a] px-8 py-5">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold text-white">
                Product Demand Analytics
              </h2>

              <p className="text-[#b0b0b0] mt-1">
                Monitor product performance and demand trends
              </p>
            </div>

            <button
              onClick={fetchDemandData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#454545] hover:bg-[#383838] transition disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8">

          {/* Page heading for mobile */}
          <div className="md:hidden mb-5">
            <h1 className="text-xl font-bold">
              Product Demand Analytics
            </h1>

            <p className="text-sm text-[#a0a0a0] mt-1">
              Monitor product performance and demand trends
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-[#a0a0a0]">
              <RefreshCw size={28} className="animate-spin mb-3 text-[#8b7cf6]" />
              <p>Loading product analytics...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-[#2a2a2a] border border-red-900 rounded-2xl p-6 text-center">
              <p className="text-red-400 mb-4">
                {error}
              </p>

              <button
                onClick={fetchDemandData}
                className="px-5 py-2 rounded-xl bg-[#5b4ce6] hover:bg-[#6b5cf0] text-white transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Product Analytics Cards */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

              {products.map((product) => (

                <div
                  key={product.product_id}
                  className="bg-[#2a2a2a] p-5 sm:p-6 rounded-2xl border border-[#3a3a3a] hover:border-[#5b4ce6]/60 transition min-w-0"
                >

                  <h2 className="text-lg sm:text-xl font-bold mb-5 break-words">
                    {product.product_name}
                  </h2>

                  <div className="space-y-4">

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm sm:text-base text-[#b0b0b0]">
                        📦 Available Stock
                      </p>

                      <strong className="text-white text-base sm:text-lg tabular-nums">
                        {product.current_stock}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm sm:text-base text-[#b0b0b0]">
                        🛒 Sold Stock
                      </p>

                      <strong className="text-white text-base sm:text-lg tabular-nums">
                        {product.total_sold}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm sm:text-base text-[#b0b0b0]">
                        📈 Demand Ratio
                      </p>

                      <strong className="text-white text-base sm:text-lg tabular-nums">
                        {product.demand_ratio}
                      </strong>
                    </div>

                  </div>

                  {/* Demand Status */}
                  <div
                    className={`mt-5 p-3 rounded-xl text-center font-semibold text-sm sm:text-base ${getDemandStyle(product.demand)}`}
                  >
                    {getDemandLabel(product.demand)}
                  </div>

                </div>

              ))}

            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl text-center py-16 px-5">
              <TrendingUp
                size={36}
                className="mx-auto mb-4 text-[#8b7cf6]"
              />

              <h3 className="text-lg font-semibold text-white">
                No Analytics Available
              </h3>

              <p className="text-sm text-[#8a8a8a] mt-2">
                Product demand data will appear here when available.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#262626] border-t border-[#3a3a3a] px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">

        <div className="grid grid-cols-5 gap-1">

          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[#a0a0a0] hover:bg-[#333333]"
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => navigate("/products")}
            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[#a0a0a0] hover:bg-[#333333]"
          >
            <Package size={20} />
            <span className="text-[10px]">Products</span>
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[#a0a0a0] hover:bg-[#333333]"
          >
            <ShoppingCart size={20} />
            <span className="text-[10px]">Cart</span>
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[#a0a0a0] hover:bg-[#333333]"
          >
            <Receipt size={20} />
            <span className="text-[10px]">Orders</span>
          </button>

          {/* Active Trends */}
          <button
            onClick={() => navigate("/productanalytics")}
            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-[#ece9ff] text-[#5b4ce6] font-semibold"
          >
            <TrendingUp size={20} />
            <span className="text-[10px]">Trends</span>
          </button>

        </div>
      </nav>

    </div>
  );
}

export default ProductAnalytics;
