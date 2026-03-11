import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80";

export default function RegisterPage() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);

    try {
      await api.post("/users", form);
      toast.success("Account created. Please login.");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />

      <div className="absolute inset-0 bg-slate-950/75" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,110,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_25%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 md:px-6">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-amber-100">
            Start Your Adventure
          </div>

          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
            Create account
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/70">
            Join the kingdom, create your knight profile, save your progress,
            and begin your endless runner journey.
          </p>

          {/* Names */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <label>
              <div className="mb-2 text-sm text-white/65">First name</div>
              <input
                className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-amber-300/45"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
            </label>

            <label>
              <div className="mb-2 text-sm text-white/65">Last name</div>
              <input
                className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-amber-300/45"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                required
              />
            </label>
          </div>

          {/* Email */}
          <label className="mt-4 block">
            <div className="mb-2 text-sm text-white/65">Email</div>
            <input
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-amber-300/45"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </label>

          {/* Password with eye toggle */}
          <label className="mt-4 block">
            <div className="mb-2 text-sm text-white/65">Password</div>

            <div className="relative">
              <input
                className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/30 focus:border-amber-300/45"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <FiEye size={20} />
              </button>
            </div>
          </label>

          {/* Submit */}
          <button
            disabled={busy}
            className="mt-5 w-full rounded-2xl bg-amber-300 px-5 py-3.5 font-black text-black shadow-lg transition hover:scale-[1.01] disabled:opacity-60"
          >
            {busy ? "Creating..." : "Register"}
          </button>

          <div className="mt-5 text-sm text-white/70">
            Already have an account?{" "}
            <Link
              className="font-semibold text-amber-300 underline underline-offset-4"
              to="/login"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}