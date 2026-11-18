
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Bell,
  AlertTriangle,
  LogOut,
  History,
  RefreshCw,
  Search,
  CheckCircle2,
  Boxes,
  ArrowUpRight,
  Clock3,
  ArrowLeft,
} from "lucide-react";

import API from "../api/axios";

export default function RestockHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("User");

  // ================= USER INFORMATION =================
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        setUserId(payload.user_id || payload.sub || "User");
      }
    } catch {
      console.log("Could not decode user token");
    }
  }, []);

  // ================= FETCH HISTORY =================
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/restocks/history");

      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Restock history error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load restock history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return history;

    return history.filter(
      (item) =>
        item.productName?.toLowerCase().includes(query) ||
        item.eventId?.toLowerCase().includes(query)
    );
  }, [history, search]);

  // ================= TOTAL UNITS =================
  const totalUnits = history.reduce(
    (total, item) => total + (Number(item.quantityAdded) || 0),
    0
  );

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= FORMAT EVENT ID =================
  const formatEventId = (id) => {
    if (!id) return "N/A";
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================= MOBILE NAVIGATION =================
  const mobileNav = [
    { label: "Home", path: "/", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: Package },
    { label: "Cart", path: "/cart", icon: ShoppingCart },
    { label: "Orders", path: "/orders", icon: Receipt },
    { label: "Trends", path: "/productanalytics", icon: TrendingUp },
  ];

  return (
    <div className="min-h-dvh bg-[#1f1f1f] text-white flex overflow-x-hidden">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-[250px] bg-[#262626] border-r border-[#3a3a3a] flex-col shrink-0 min-h-dvh">

        <div className="p-6 border-b border-[#3a3a3a]">
          <h1 className="text-2xl font-bold text-[#8b7cf6]">
            Inventra
          </h1>

          <p className="text-sm text-[#b0b0b0] mt-1">
            Inventory Manager
          </p>
        </div>

        <div className="flex-1 px-4 py-6">

          <p className="text-xs text-[#8a8a8a] mb-3 uppercase tracking-wider">
            Main
          </p>

          <div className="space-y-2">

            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1]"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#333333] text-[#d1d1d1]"
            >
              <Package size={20} />
              Products
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

          <p className="text-xs text-[#8a8a8a] mt-10 mb-3 uppercase tracking-wider">
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ece9ff] text-[#5b4ce6] font-medium"
            >
              <History size={20} />
              Restock History
            </button>

          </div>
        </div>

        {/* SIDEBAR USER */}
        <div className="p-4 border-t border-[#3a3a3a] flex items-center justify-between gap-2">

          <div className="min-w-0">
            <p className="font-semibold text-white truncate">
              User #{userId}
            </p>

            <p className="text-sm text-[#a0a0a0]">
              Store Manager
            </p>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="text-red-400 hover:text-red-500 shrink-0"
          >
            <LogOut size={20} />
          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-w-0 min-h-dvh">

        {/* ================= TOPBAR ================= */}
        <header className="sticky top-0 z-30 bg-[#2a2a2a]/95 backdrop-blur border-b border-[#3a3a3a] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">

          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold truncate">
              Restock History
            </h1>

            <p className="text-xs sm:text-sm text-[#b0b0b0] mt-0.5 truncate">
              Track automatic inventory replenishments
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">

            {/* BACK TO HOME */}
            <button
              onClick={() => navigate("/")}
              aria-label="Back to Home"
              className="flex items-center gap-2 border border-[#4a4a4a] hover:bg-[#333333] p-2 sm:px-4 sm:py-2 rounded-xl transition"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* REFRESH */}
            <button
              onClick={fetchHistory}
              disabled={loading}
              aria-label="Refresh history"
              className="flex items-center gap-2 bg-[#5b4ce6] hover:bg-[#6b5bf0] disabled:opacity-50 transition p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium text-sm"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="border border-[#4a4a4a] p-2.5 rounded-xl text-red-400 hover:bg-[#333333] transition md:hidden"
            >
              <LogOut size={18} />
            </button>

          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 md:pb-8">

          {/* PAGE INTRO */}
          <div className="mb-5 sm:mb-7">
            <h2 className="text-lg sm:text-2xl font-bold">
              Inventory Replenishment
            </h2>

            <p className="text-xs sm:text-sm text-[#8a8a8a] mt-1">
              Monitor your successful automatic restock activities
            </p>
          </div>

          {/* ================= SUMMARY CARDS ================= */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">

            {/* TOTAL EVENTS */}
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-3.5 sm:p-6 min-w-0">

              <div className="flex items-center justify-between gap-2">
                <p className="text-[#b0b0b0] text-xs sm:text-sm">
                  Total Restock Events
                </p>

                <div className="bg-[#5b4ce6]/20 p-2 sm:p-3 rounded-xl shrink-0">
                  <History className="text-[#a99cff]" size={19} />
                </div>
              </div>

              <h3 className="text-2xl sm:text-4xl font-bold mt-3 sm:mt-4">
                {history.length}
              </h3>

              <p className="text-[#8a8a8a] text-xs sm:text-sm mt-2">
                Successful restocks
              </p>

            </div>

            {/* TOTAL UNITS */}
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-3.5 sm:p-6 min-w-0">

              <div className="flex items-center justify-between gap-2">
                <p className="text-[#b0b0b0] text-xs sm:text-sm">
                  Total Units Added
                </p>

                <div className="bg-green-500/10 p-2 sm:p-3 rounded-xl shrink-0">
                  <Boxes className="text-green-400" size={19} />
                </div>
              </div>

              <h3 className="text-2xl sm:text-4xl font-bold mt-3 sm:mt-4 text-green-400">
                {totalUnits}
              </h3>

              <p className="text-[#8a8a8a] text-xs sm:text-sm mt-2">
                Units replenished
              </p>

            </div>

            {/* LATEST RESTOCK */}
            <div className="col-span-2 xl:col-span-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-4 sm:p-6 min-w-0">

              <div className="flex items-center justify-between gap-2">
                <p className="text-[#b0b0b0] text-xs sm:text-sm">
                  Latest Restock
                </p>

                <div className="bg-blue-500/10 p-2 sm:p-3 rounded-xl shrink-0">
                  <Clock3 className="text-blue-400" size={19} />
                </div>
              </div>

              <h3 className="text-base sm:text-xl font-bold mt-4 break-words">
                {history.length > 0
                  ? formatDate(history[0].createdAt)
                  : "No activity yet"}
              </h3>

              <p className="text-[#8a8a8a] text-xs sm:text-sm mt-2">
                Most recent successful restock
              </p>

            </div>

          </div>

          {/* ================= HISTORY SECTION ================= */}
          <div className="mt-6 sm:mt-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl overflow-hidden">

            {/* SECTION HEADER */}
            <div className="p-4 sm:p-6 border-b border-[#3a3a3a] flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Restock Records
                </h3>

                <p className="text-xs sm:text-sm text-[#8a8a8a] mt-1">
                  Complete record of successful stock replenishments
                </p>
              </div>

              {/* SEARCH */}
              <div className="relative w-full lg:w-[320px] shrink-0">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
                />

                <input
                  type="text"
                  placeholder="Search product or event ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-[#454545] rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#8b7cf6]"
                />

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="m-4 sm:m-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={18}
                    className="text-red-400 shrink-0 mt-0.5"
                  />

                  <p className="text-red-400 text-sm">
                    {error}
                  </p>
                </div>

                <button
                  onClick={fetchHistory}
                  className="text-sm text-[#a99cff] font-medium self-start sm:self-auto"
                >
                  Try again
                </button>

              </div>
            )}

            {/* LOADING */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <RefreshCw
                  className="text-[#8b7cf6] animate-spin"
                  size={30}
                />

                <p className="text-[#a0a0a0] mt-4 text-sm">
                  Loading restock history...
                </p>
              </div>

            ) : !error && filteredHistory.length === 0 ? (

              /* EMPTY STATE */
              <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center px-5">

                <div className="bg-[#3a3a3a] p-5 rounded-2xl">
                  <History size={35} className="text-[#8b7cf6]" />
                </div>

                <h3 className="text-lg font-semibold mt-5">
                  {search
                    ? "No matching records"
                    : "No restock history yet"}
                </h3>

                <p className="text-[#8a8a8a] text-sm mt-2 max-w-md">
                  {search
                    ? "Try searching with another product name or event ID."
                    : "When an automatic restock is completed, its details will appear here."}
                </p>

              </div>

            ) : !error ? (

              <>
                {/* ================= MOBILE RESTOCK CARDS ================= */}
                <div className="md:hidden p-3 space-y-3">

                  {filteredHistory.map((item) => (
                    <div
                      key={item.eventId}
                      className="bg-[#242424] border border-[#3a3a3a] rounded-2xl p-4"
                    >

                      {/* PRODUCT */}
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-start gap-3 min-w-0">

                          <div className="bg-[#5b4ce6]/15 p-2.5 rounded-xl shrink-0">
                            <Package
                              size={20}
                              className="text-[#a99cff]"
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm break-words">
                              {item.productName ||
                                item.product?.name ||
                                "Unknown product"}
                            </h4>

                            <p className="text-xs text-[#777] mt-1 break-all">
                              ID: {formatEventId(item.eventId)}
                            </p>
                          </div>

                        </div>

                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-full text-[10px] shrink-0">
                          <CheckCircle2 size={12} />
                          Completed
                        </span>

                      </div>

                      {/* STOCK DETAILS */}
                      <div className="grid grid-cols-3 gap-2 mt-5">

                        <div className="bg-[#2e2e2e] rounded-xl p-2.5 min-w-0">
                          <p className="text-[10px] sm:text-xs text-[#8a8a8a]">
                            Previous
                          </p>

                          <p className="text-base sm:text-lg font-semibold mt-1">
                            {item.previousStock}
                          </p>
                        </div>

                        <div className="bg-[#2e2e2e] rounded-xl p-2.5 min-w-0">
                          <p className="text-[10px] sm:text-xs text-[#8a8a8a]">
                            Added
                          </p>

                          <p className="text-base sm:text-lg font-semibold text-green-400 mt-1 flex items-center gap-0.5">
                            <ArrowUpRight size={15} />
                            +{item.quantityAdded}
                          </p>
                        </div>

                        <div className="bg-[#2e2e2e] rounded-xl p-2.5 min-w-0">
                          <p className="text-[10px] sm:text-xs text-[#8a8a8a]">
                            Updated
                          </p>

                          <p className="text-base sm:text-lg font-semibold mt-1">
                            {item.updatedStock}
                          </p>
                        </div>

                      </div>

                      {/* DATE */}
                      <div className="border-t border-[#3a3a3a] mt-4 pt-3 flex items-center gap-2 text-[#a0a0a0]">

                        <Clock3 size={14} className="shrink-0" />

                        <p className="text-xs break-words">
                          {formatDate(item.createdAt)}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto">

                  <table className="w-full min-w-[850px] text-left">

                    <thead className="bg-[#252525] text-[#9c9c9c] text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-medium">Product</th>
                        <th className="px-6 py-4 font-medium">Previous Stock</th>
                        <th className="px-6 py-4 font-medium">Added</th>
                        <th className="px-6 py-4 font-medium">Updated Stock</th>
                        <th className="px-6 py-4 font-medium">Date & Time</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#3a3a3a]">

                      {filteredHistory.map((item) => (
                        <tr
                          key={item.eventId}
                          className="hover:bg-[#333333]/60 transition"
                        >

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">

                              <div className="bg-[#5b4ce6]/15 p-3 rounded-xl">
                                <Package
                                  size={19}
                                  className="text-[#a99cff]"
                                />
                              </div>

                              <div>
                                <p className="font-semibold text-white">
                                  {item.productName ||
                                    item.product?.name ||
                                    "Unknown product"}
                                </p>

                                <p className="text-xs text-[#777] mt-1">
                                  ID: {item.product?._id || item.product || "N/A"}
                                </p>
                              </div>

                            </div>
                          </td>

                          <td className="px-6 py-5 text-[#d1d1d1]">
                            {item.previousStock}
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                              <ArrowUpRight size={16} />
                              +{item.quantityAdded}
                            </span>
                          </td>

                          <td className="px-6 py-5 font-semibold text-white">
                            {item.updatedStock}
                          </td>

                          <td className="px-6 py-5 text-sm text-[#b0b0b0]">
                            {formatDate(item.createdAt)}
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-xs font-medium">
                              <CheckCircle2 size={14} />
                              Completed
                            </span>
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

                {/* FOOTER */}
                <div className="px-4 sm:px-6 py-4 border-t border-[#3a3a3a] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">

                  <p className="text-[#8a8a8a]">
                    Showing {filteredHistory.length} of {history.length} records
                  </p>

                  <span className="text-[#8b7cf6] flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    Live database records
                  </span>

                </div>

              </>

            ) : null}

          </div>

        </div>

      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#262626] border-t border-[#3a3a3a] pb-[env(safe-area-inset-bottom)]">

        <div className="grid grid-cols-5">

          {mobileNav.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-[#b0b0b0] transition"
            >
              <span className="px-3 py-1 rounded-full">
                <Icon size={18} />
              </span>

              {label}
            </button>
          ))}

        </div>

      </nav>

    </div>
  );
}
