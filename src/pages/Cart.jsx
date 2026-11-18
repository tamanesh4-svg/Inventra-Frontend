
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import {
  ArrowLeft,
  ShoppingCart,
  RefreshCw,
  Mail,
  LayoutDashboard,
  Package,
  Receipt,
  TrendingUp,
  Bell,
  LogOut,
} from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // ================= CREATE CART =================
  const createCart = async () => {
    try {
      const res = await API.post("/cart/create");

      setCartId(res.data.cart_id);
      setCartData({ items: [], total: 0 });
      setBuyerEmail("");
    } catch (err) {
      alert("Failed to create cart");
    }
  };

  // ================= ADD TO CART =================
  const addToCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        cart_id: cartId,
        product_id: productId,
        quantity: 1,
      });

      fetchCart();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Error adding product"
      );
    }
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        cart_id: cartId,
        product_id: productId,
        quantity: -1,
      });

      fetchCart();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Error removing product"
      );
    }
  };

  // ================= FETCH CART =================
  const fetchCart = async () => {
    if (!cartId) return;

    try {
      const res = await API.get(`/cart/${cartId}`);
      setCartData(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  // ================= CHECKOUT =================
  const checkout = async () => {
    const email = buyerEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      alert("Please enter a valid buyer email address.");
      return;
    }

    if (!cartData?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setCheckoutLoading(true);

      const res = await API.post(`/cart/checkout/${cartId}`, {
        buyerEmail: email,
      });

      alert(
        `Checkout completed successfully!\n\n` +
          `Order ID: ${res.data.order_id}\n` +
          `Total: ₹${res.data.total}\n` +
          `Buyer Email: ${res.data.buyer_email}\n` +
          `Email Automation: ${res.data.email_automation}`
      );

      setCartData(null);
      setCartId(null);
      setBuyerEmail("");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Checkout failed"
      );
    } finally {
      setCheckoutLoading(false);
    }
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
    <div className="min-h-dvh bg-[#1f1f1f] text-white overflow-x-hidden">

      {/* ================= TOPBAR ================= */}
      <header className="sticky top-0 z-20 bg-[#2a2a2a]/95 backdrop-blur border-b border-[#3a3a3a] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">

        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold truncate">
            Cart Management
          </h1>

          <p className="text-xs sm:text-base text-[#b0b0b0] truncate">
            Create carts and process orders
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">

          {/* BACK BUTTON - MOBILE AND DESKTOP */}
          <button
            onClick={() => navigate("/")}
            aria-label="Back to Home"
            className="flex border border-[#4a4a4a] hover:bg-[#333333] p-2 sm:px-4 sm:py-2 rounded-xl items-center gap-2 transition shrink-0"
          >
            <ArrowLeft size={17} />
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8">

        {/* CREATE CART */}
        {!cartId && (
          <div className="flex justify-center py-8 sm:py-12">
            <button
              onClick={createCart}
              className="w-full sm:w-auto bg-[#5b4ce6] hover:bg-[#6b5bf0] px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg transition"
            >
              + Create New Cart
            </button>
          </div>
        )}

        {/* CART CONTENT */}
        {cartId && (
          <>
            {/* ACTIVE CART HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 sm:mb-6">

              <div className="min-w-0">
                <h2 className="text-xl sm:text-3xl font-bold break-all">
                  Active Cart #{cartId}
                </h2>

                <p className="text-[#8a8a8a] mt-1 text-sm sm:text-base">
                  Add products and checkout
                </p>
              </div>

              <button
                onClick={fetchCart}
                className="w-full sm:w-auto justify-center border border-[#4a4a4a] hover:bg-[#333333] px-4 py-2 rounded-xl flex items-center gap-2 transition"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

            {/* PRODUCTS TABLE */}
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl overflow-hidden">

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">

                  <thead className="bg-[#333333]">
                    <tr>
                      <th className="text-left p-3 sm:p-4 text-sm sm:text-base">
                        Product
                      </th>

                      <th className="text-left p-3 sm:p-4 text-sm sm:text-base">
                        Price
                      </th>

                      <th className="text-center p-3 sm:p-4 text-sm sm:text-base">
                        Quantity
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => {
                      const cartItem = cartData?.items?.find(
                        (item) => item.name === product.name
                      );

                      return (
                        <tr
                          key={product.id}
                          className="border-t border-[#3a3a3a]"
                        >
                          <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">
                            {product.name}
                          </td>

                          <td className="p-3 sm:p-4 whitespace-nowrap text-sm sm:text-base">
                            ₹ {product.price}
                          </td>

                          <td className="p-3 sm:p-4">
                            <div className="flex justify-center items-center gap-3 sm:gap-4">

                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="bg-red-500 hover:bg-red-600 w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition"
                              >
                                -
                              </button>

                              <span className="font-semibold min-w-[20px] text-center">
                                {cartItem ? cartItem.qty : 0}
                              </span>

                              <button
                                onClick={() => addToCart(product.id)}
                                className="bg-[#5b4ce6] hover:bg-[#6b5bf0] w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition"
                              >
                                +
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>
            </div>

            {/* CART SUMMARY */}
            {cartData && (
              <div className="mt-5 sm:mt-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-4 sm:p-6">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <div className="flex items-center gap-3">
                    <ShoppingCart className="text-[#8b7cf6]" />

                    <span className="text-lg font-semibold">
                      Cart Total
                    </span>
                  </div>

                  <span className="text-2xl sm:text-3xl font-bold text-green-400">
                    ₹ {cartData.total}
                  </span>

                </div>

                {/* BUYER EMAIL */}
                <div className="mt-6 sm:mt-8">

                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Mail size={17} className="text-[#8b7cf6]" />
                    Buyer Email Address
                  </label>

                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="Enter buyer's email address"
                    className="w-full min-w-0 bg-[#1f1f1f] border border-[#444444] focus:border-[#8b7cf6] outline-none rounded-xl px-4 py-3 text-white placeholder-[#777777] transition"
                  />

                  <p className="text-[#8a8a8a] text-xs sm:text-sm mt-2 leading-relaxed">
                    The order confirmation and purchase details will be sent
                    to this email address.
                  </p>

                </div>

                {/* CHECKOUT BUTTON */}
                <button
                  onClick={checkout}
                  disabled={checkoutLoading || !cartData.items?.length}
                  className="bg-[#5b4ce6] hover:bg-[#6b5bf0] disabled:opacity-50 disabled:cursor-not-allowed mt-6 w-full py-3 rounded-xl font-medium transition"
                >
                  {checkoutLoading
                    ? "Processing Checkout..."
                    : "Checkout"}
                </button>

              </div>
            )}
          </>
        )}

      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#262626] border-t border-[#3a3a3a] pb-[env(safe-area-inset-bottom)]">

        <div className="grid grid-cols-5">
          {mobileNav.map(({ label, path, icon: Icon }) => {
            const active = path === "/cart";

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
