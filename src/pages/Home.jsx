import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Bell,
  LogOut,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

const CATEGORIES = ["All", "Hardware", "Electrical", "Plumbing", "Consumables"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [demandData, setDemandData] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [userName, setUserName] = useState("User");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setAuthChecked(true);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        setAuthChecked(true);
        return;
      }

      setUserName(decoded.name || "User");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem("token");
      setIsLoggedIn(false);
    }

    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, demandRes, inventoryRes, productsRes] =
        await Promise.all([
          API.get("/dashboard/overview"),
          API.get("/products/demand"),
          API.get("/inventory"),
          API.get("/products"),
        ]);

      setOverview(overviewRes.data);
      setDemandData(demandRes.data);
      setInventory(inventoryRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Dashboard Error:", err);

      if (err.response?.status === 401) {
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const topDemand = demandData[0];

  const lowStockItems = inventory.filter((item) => item.status === "low_stock");

  /* ---------- AUTH STATES ---------- */

  if (!authChecked) {
    return (
      <div className="min-h-dvh bg-[#1f1f1f] flex items-center justify-center text-white px-4">
        <p className="text-[#b0b0b0] text-base sm:text-lg">
          Checking login status...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-dvh bg-[#1f1f1f] flex items-center justify-center text-white px-4 py-6">
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-5 sm:p-10 text-center max-w-md w-full shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#8b7cf6] mb-3 sm:mb-4">
            Inventra
          </h1>

          <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🔐</div>

          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
            Please Login to Continue
          </h2>

          <p className="text-sm sm:text-base text-[#b0b0b0] mb-6 leading-relaxed">
            You need to be logged in to access the dashboard and manage your
            inventory.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#5b4ce6] hover:bg-[#6b5bf0] px-6 py-3 rounded-xl font-medium transition"
          >
            Login to Inventra
          </button>

          <p className="text-sm text-[#888888] mt-4 sm:mt-5">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#8b7cf6] hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    );
  }

  /* ---------- NAV CONFIG ---------- */

  const mobileNav = [
    { label: "Home", path: "/", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: Package },
    { label: "Cart", path: "/cart", icon: ShoppingCart },
    { label: "Orders", path: "/orders", icon: Receipt },
    { label: "Trends", path: "/productanalytics", icon: TrendingUp },
  ];

  /* ---------- DASHBOARD ---------- */

  return (
    <div className="flex min-h-dvh bg-[#1f1f1f] text-white overflow-x-hidden">
      {/* DESKTOP SIDEBAR (md and up) */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[220px] lg:w-[250px] h-screen bg-[#262626] border-r border-[#3a3a3a] flex-col z-30">
        <div className="p-5 lg:p-6 border-b border-[#3a3a3a]">
           <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Inventra<span className="text-indigo-400">.</span>
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">Inventory Manager</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 lg:px-4 py-5 lg:py-6">
          <p className="text-xs text-[#8a8a8a] mb-3 uppercase tracking-wider">
            Main
          </p>

          <div className="space-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ece9ff] text-[#5b4ce6] font-medium"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1]"
            >
              <div className="flex items-center gap-3">
                <Package size={20} />
                Products
              </div>
              <span className="bg-[#8b7cf6] text-white text-xs px-2 py-1 rounded-full">
                {overview?.total_products ?? 0}
              </span>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1]"
            >
              <ShoppingCart size={20} />
              Cart
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1]"
            >
              <Receipt size={20} />
              Orders
            </button>
          </div>

          <p className="text-xs text-[#8a8a8a] mt-8 mb-3 uppercase tracking-wider">
            Insights
          </p>

          <div className="space-y-2">
            <button
              onClick={() => navigate("/productanalytics")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1]"
            >
              <TrendingUp size={20} />
              Usage Trends
            </button>

            <button
              onClick={() => navigate("/restock_history")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1]"
            >
              <div className="flex items-center gap-3">
                <Bell size={20} />
                Restock History
              </div>

              {lowStockItems.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {lowStockItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-[#3a3a3a] flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{userName}</p>
            <p className="text-sm text-[#a0a0a0]">Store Manager</p>
          </div>

          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 shrink-0"
            title="Logout"
          >
            <LogOut />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 md:ml-[220px] lg:ml-[250px] pb-20 md:pb-0">
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 bg-[#2a2a2a]/95 backdrop-blur border-b border-[#3a3a3a] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
              Dashboard
            </h2>
            <p className="text-xs sm:text-base text-[#b0b0b0] truncate">
              {getGreeting()}, {userName}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Filter: icon-only on small, text from sm */}
            <button
              aria-label="Filter"
              className="border border-[#4a4a4a] p-2 sm:px-5 sm:py-2 rounded-xl hover:bg-[#333333] transition flex items-center gap-2"
            >
              <SlidersHorizontal size={18} className="sm:hidden" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            {/* Add Product: icon-only on small, text from sm */}
            <button
              onClick={() => navigate("/products")}
              aria-label="Add Product"
              className="bg-[#5b4ce6] hover:bg-[#6b5bf0] transition p-2 sm:px-5 sm:py-2 rounded-xl font-medium flex items-center gap-1"
            >
              <Plus size={18} className="sm:hidden" />
              <span className="hidden sm:inline">+ Add Product</span>
            </button>

            {/* Mobile-only: restock bell + logout (sidebar is hidden) */}
            <button
              onClick={() => navigate("/restock_history")}
              aria-label="Restock History"
              className="md:hidden relative border border-[#4a4a4a] p-2 rounded-xl text-[#d1d1d1]"
            >
              <Bell size={18} />
              {lowStockItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] leading-none min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                  {lowStockItems.length}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="md:hidden border border-[#4a4a4a] p-2 rounded-xl text-red-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* KPI CARDS: 2 cols on phones, 4 on large screens */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-3.5 sm:p-6 min-w-0">
              <p className="text-[#b0b0b0] text-xs sm:text-sm">
                Total Products
              </p>
              <h3 className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">
                {overview?.total_products ?? 0}
              </h3>
              <p className="text-[#8a8a8a] text-[11px] sm:text-sm mt-1 sm:mt-2 truncate">
                Across inventory
              </p>
            </div>

            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-3.5 sm:p-6 min-w-0">
              <p className="text-[#d2a45c] text-xs sm:text-sm">Low Stock</p>
              <h3 className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3 text-[#d2a45c]">
                {lowStockItems.length}
              </h3>
              <p className="text-[#8a8a8a] text-[11px] sm:text-sm mt-1 sm:mt-2 truncate">
                Threshold triggered
              </p>
            </div>

            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-3.5 sm:p-6 min-w-0">
              <p className="text-[#b0b0b0] text-xs sm:text-sm">Carts Today</p>
              <h3 className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">
                {overview?.total_carts ?? 0}
              </h3>
              <p className="text-[#8a8a8a] text-[11px] sm:text-sm mt-1 sm:mt-2 truncate">
                ₹ {overview?.total_amount ?? 0} total
              </p>
            </div>

            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-3.5 sm:p-6 min-w-0">
              <p className="text-[#7ed957] text-xs sm:text-sm">Top Mover</p>
              <h3 className="text-base sm:text-3xl font-bold mt-2 sm:mt-3 truncate text-[#5fd43f]">
                {topDemand?.product_name || "N/A"}
              </h3>
              <p className="text-[#8a8a8a] text-[11px] sm:text-sm mt-1 sm:mt-2 truncate">
                High demand this week
              </p>
            </div>
          </div>

          {/* CATEGORY FILTERS: one scrollable row instead of wrapping */}
          <div className="-mx-4 sm:mx-0 mt-5 sm:mt-8 px-4 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max sm:w-auto sm:flex-wrap gap-2 sm:gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-xl transition ${
                    selectedCategory === cat
                      ? "bg-[#ece9ff] text-[#5b4ce6] font-medium"
                      : "border border-[#4a4a4a] hover:bg-[#333333]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS + ALERTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-8">
            {/* PRODUCTS */}
            <div className="min-w-0 xl:col-span-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-xl font-semibold">
                  All Products
                </h3>

                <button
                  onClick={() => navigate("/products")}
                  className="text-[#8b7cf6] text-sm sm:text-base whitespace-nowrap"
                >
                  View all →
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 5).map((item, index) => (
                    <div
                      key={item.id ?? index}
                      /* stays in one row even on phones; names truncate */
                      className={`flex items-center justify-between gap-3 border-b border-[#3a3a3a] pb-3 sm:pb-4 ${
                        index >= 4 ? "hidden sm:flex" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs sm:text-sm text-[#8b7cf6] mt-0.5 sm:mt-1 truncate">
                          {item.category}
                          <span className="text-[#9c9c9c]">
                            {" "}
                            · ₹ {item.price}
                          </span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-semibold text-xs sm:text-base text-white">
                          Stock: {item.stock}
                        </p>
                        <span
                          className={`inline-block text-[11px] sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mt-1 ${
                            item.stock <= 5
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {item.stock <= 5 ? "Low Stock" : "Healthy"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-10 text-sm text-[#8a8a8a]">
                    No products found in this category
                  </div>
                )}
              </div>
            </div>

            {/* ALERTS */}
            <div className="min-w-0 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-xl font-semibold">
                  Smart Alerts
                </h3>
                <AlertTriangle className="text-red-400 shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                {lowStockItems.length > 0 ? (
                  lowStockItems.slice(0, 5).map((item, index) => (
                    <div
                      key={item.id}
                      /* phones show 3 alerts, bigger screens show 5 */
                      className={`bg-[#3a2a2a] border border-red-400/20 rounded-xl p-3 sm:p-4 ${
                        index >= 3 ? "hidden sm:block" : ""
                      }`}
                    >
                      <p className="font-semibold text-sm sm:text-base text-red-400 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs sm:text-sm text-[#d1d1d1] mt-1">
                        Remaining Stock: {item.stock}
                      </p>
                      <p className="text-xs sm:text-sm text-[#9c9c9c] mt-0.5 sm:mt-1">
                        Suggested Restock: {item.restock_suggestion}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#203020] border border-green-400/20 rounded-xl p-3 sm:p-4">
                    <p className="text-sm sm:text-base text-green-400">
                      No stock alerts 🎉
                    </p>
                  </div>
                )}

                {lowStockItems.length > 3 && (
                  <button
                    onClick={() => navigate("/restock_history")}
                    className="sm:hidden w-full text-center text-sm text-[#8b7cf6] pt-1"
                  >
                    View all {lowStockItems.length} alerts →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TOP PRODUCT */}
          {topDemand && (
            <div className="mt-5 sm:mt-8 bg-gradient-to-r from-[#5b4ce6] to-[#7b61ff] rounded-2xl sm:rounded-3xl p-4 sm:p-8">
              <p className="text-[#d7d2ff] text-xs sm:text-base mb-1 sm:mb-2">
                Highest Demand Product
              </p>

              <h2 className="text-xl sm:text-4xl font-bold truncate">
                {topDemand.product_name}
              </h2>

              {/* 3 equal columns so all stats fit on one row on phones */}
              <div className="grid grid-cols-3 sm:flex sm:gap-10 gap-2 mt-4 sm:mt-6">
                <div className="min-w-0">
                  <p className="text-[#d7d2ff] text-[11px] sm:text-sm">
                    Total Sold
                  </p>
                  <h4 className="text-lg sm:text-2xl font-bold truncate">
                    {topDemand.total_sold}
                  </h4>
                </div>

                <div className="min-w-0">
                  <p className="text-[#d7d2ff] text-[11px] sm:text-sm">
                    Current Stock
                  </p>
                  <h4 className="text-lg sm:text-2xl font-bold truncate">
                    {topDemand.current_stock}
                  </h4>
                </div>

                <div className="min-w-0">
                  <p className="text-[#d7d2ff] text-[11px] sm:text-sm">
                    Demand
                  </p>
                  <h4 className="text-lg sm:text-2xl font-bold truncate">
                    {topDemand.demand}
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV (below md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#262626] border-t border-[#3a3a3a] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {mobileNav.map(({ label, path, icon: Icon }) => {
            const active = path === "/";
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition ${
                  active ? "text-[#8b7cf6] font-medium" : "text-[#b0b0b0]"
                }`}
              >
                <span
                  className={`px-3 py-1 rounded-full ${
                    active ? "bg-[#ece9ff] text-[#5b4ce6]" : ""
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