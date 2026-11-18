
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/login", form);

      // Store JWT in sessionStorage
      sessionStorage.setItem("token", res.data.access_token);

      // Remove old localStorage token
      localStorage.removeItem("token");

      alert("Login successful");
      navigate("/", { replace: true });

    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#11111f] px-4 py-10">

      {/* BACKGROUND DECORATION */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Inventra<span className="text-indigo-400">.</span>
          </h1>

          <p className="text-gray-400 mt-2 text-sm tracking-wide">
            Smart Inventory Management
          </p>
        </div>

        <div className="bg-[#1e1e30]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">

          {/* HEADING */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Login to manage your inventory and track your business.
            </p>
          </div>

          <div className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full bg-[#141425] border border-[#393951] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#555574]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleLogin();
                  }
                }}
                className="w-full bg-[#141425] border border-[#393951] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#555574]"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login to Inventra"}
            </button>

          </div>

          {/* SIGNUP LINK */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 Inventra. All rights reserved.
        </p>

      </div>
    </div>
  );
}
