
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Search,
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Bell,
  LogOut,
  X,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "Hardware",
  });

  const navigate = useNavigate();

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  // ================= FILTER =================
  useEffect(() => {
    let filtered = products;

    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [search, selectedCategory, products]);

  // ================= ADD PRODUCT =================
  const handleAddProduct = async () => {
    try {
      await API.post("/products", {
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        category: newProduct.category,
      });

      fetchProducts();
      setShowModal(false);

      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "Hardware",
      });

      alert("✅ Product added");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  // ================= UPDATE PRODUCT =================
  const handleUpdate = async (product) => {
    try {
      await API.put(`/products/${product.id}`, {
        price: Number(product.price),
        stock: Number(product.stock),
      });

      alert("✅ Product updated");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_active: false } : p
        )
      );

      alert("🗑 Product deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  // ================= RESTORE PRODUCT =================
  const handleRestore = async (id) => {
    try {
      await API.put(`/products/restore/${id}`);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_active: true } : p
        )
      );

      alert("✅ Product restored");
    } catch (err) {
      console.error(err);
      alert("❌ Restore failed");
    }
  };

  // ================= MOBILE NAVIGATION =================
  const mobileNav = [
    { label: "Home", path: "/", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: Package },
    { label: "Cart", path: "/cart", icon: ShoppingCart },
    { label: "Orders", path: "/orders", icon: Receipt },
    { label: "Trends", path: "/productanalytics", icon: TrendingUp },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-dvh bg-[#1f1f1f] text-white overflow-x-hidden">

      {/* ================= TOPBAR ================= */}
      <header className="sticky top-0 z-30 bg-[#2a2a2a]/95 backdrop-blur border-b border-[#3a3a3a] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-3">

        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold truncate">
            Products
          </h1>

          <p className="text-xs sm:text-sm text-[#a0a0a0] mt-0.5">
            Manage your inventory
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* BACK TO HOME */}
          <button
            onClick={() => navigate("/")}
            aria-label="Back to Home"
            className="border border-[#4a4a4a] hover:bg-[#333333] p-2.5 rounded-xl flex items-center gap-2 transition"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* ADD PRODUCT */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#5b4ce6] hover:bg-[#6b5bf0] px-3 sm:px-5 py-2.5 rounded-xl flex items-center gap-2 transition text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* RESTOCK HISTORY */}
          <button
            onClick={() => navigate("/restock_history")}
            aria-label="Restock History"
            className="border border-[#4a4a4a] hover:bg-[#333333] p-2.5 rounded-xl transition"
          >
            <Bell size={18} className="text-[#d1d1d1]" />
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="border border-[#4a4a4a] hover:bg-[#333333] p-2.5 rounded-xl transition"
          >
            <LogOut size={18} className="text-red-400" />
          </button>

        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24 md:pb-8">

        {/* PAGE INTRO */}
        <div className="mb-5 sm:mb-7 flex justify-between items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">
              Inventory Products
            </h2>

            <p className="text-xs sm:text-sm text-[#8a8a8a] mt-1">
              {filteredProducts.length} products found
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-5 sm:mb-6 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-[#5b4ce6] text-sm sm:text-base"
          />
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "All",
            "Hardware",
            "Electrical",
            "Plumbing",
            "Consumables",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap text-sm shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#5b4ce6] text-white"
                  : "bg-[#2a2a2a] border border-[#3a3a3a] hover:bg-[#333333]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition hover:border-[#5b4ce6] ${
                !product.is_active ? "opacity-50" : ""
              }`}
            >

              {/* PRODUCT HEADER */}
              <div className="flex justify-between items-start mb-5 gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold break-words">
                    {product.name}
                  </h2>

                  <p className="text-sm text-[#8b7cf6] mt-2">
                    {product.category}
                  </p>

                  <div className="mt-3">
                    {product.is_active ? (
                      <span className="bg-green-500/20 text-green-400 text-xs sm:text-sm px-3 py-1 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-400 text-xs sm:text-sm px-3 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-[#353535] p-3 rounded-2xl shrink-0">
                  <Package className="text-[#8b7cf6]" size={22} />
                </div>
              </div>

              {/* PRICE */}
              <div className="mb-4">
                <label className="text-sm text-[#9c9c9c] block mb-2">
                  Product Price
                </label>

                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? { ...p, price: e.target.value }
                          : p
                      )
                    )
                  }
                  className="w-full bg-[#1f1f1f] border border-[#444] rounded-xl px-4 py-3 outline-none focus:border-[#5b4ce6]"
                />
              </div>

              {/* STOCK */}
              <div className="mb-5">
                <label className="text-sm text-[#9c9c9c] block mb-2">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? { ...p, stock: e.target.value }
                          : p
                      )
                    )
                  }
                  className="w-full bg-[#1f1f1f] border border-[#444] rounded-xl px-4 py-3 outline-none focus:border-[#5b4ce6]"
                />
              </div>

              {/* STOCK STATUS */}
              <div className="mb-5">
                {product.stock <= 5 ? (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs sm:text-sm">
                    ⚠ Low Stock Warning
                  </div>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-xs sm:text-sm">
                    ✅ Stock Healthy
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 sm:gap-3 flex-wrap">

                <button
                  onClick={() => handleUpdate(product)}
                  className="flex-1 bg-[#5b4ce6] hover:bg-[#6b5bf0] px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-sm"
                >
                  <Save size={16} />
                  Save
                </button>

                {product.is_active ? (
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestore(product.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-sm"
                  >
                    <RotateCcw size={16} />
                    Restore
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <Package
              size={40}
              className="mx-auto text-[#5b4ce6] mb-4"
            />

            <h2 className="text-xl sm:text-3xl font-bold text-[#8a8a8a]">
              No Products Found
            </h2>

            <p className="text-[#666] mt-3 text-sm">
              Try changing your search or adding a new product.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-5 bg-[#5b4ce6] hover:bg-[#6b5bf0] px-5 py-3 rounded-xl inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        )}

      </main>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 w-full sm:max-w-[400px] max-h-[90dvh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6 gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Add Product
              </h2>

              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="p-2 rounded-xl hover:bg-[#3a3a3a]"
              >
                <X size={20} />
              </button>
            </div>

            {/* NAME */}
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
              className="w-full bg-[#1f1f1f] border border-[#444] rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#5b4ce6]"
            />

            {/* PRICE */}
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: e.target.value,
                })
              }
              className="w-full bg-[#1f1f1f] border border-[#444] rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#5b4ce6]"
            />

            {/* CATEGORY */}
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  category: e.target.value,
                })
              }
              className="w-full bg-[#1f1f1f] border border-[#444] rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#5b4ce6]"
            >
              <option value="Hardware">Hardware</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Consumables">Consumables</option>
            </select>

            {/* STOCK */}
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock: e.target.value,
                })
              }
              className="w-full bg-[#1f1f1f] border border-[#444] rounded-xl px-4 py-3 mb-6 outline-none focus:border-[#5b4ce6]"
            />

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={handleAddProduct}
                disabled={
                  !newProduct.name.trim() ||
                  newProduct.price === "" ||
                  newProduct.stock === ""
                }
                className="flex-1 bg-[#5b4ce6] hover:bg-[#6b5bf0] disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-medium transition"
              >
                Add Product
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#3a3a3a] hover:bg-[#444] py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#262626] border-t border-[#3a3a3a] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {mobileNav.map(({ label, path, icon: Icon }) => {
            const active = path === "/products";

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
