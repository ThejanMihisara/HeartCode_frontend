import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { FiEye} from "react-icons/fi";

const BG_IMAGE =
  "/game-assets/bg-login.jpg";

export default function LoginPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);

    try {
      await api.post("/users/login", form);
      await refresh();
      toast.success("Welcome back!");
      nav("/menu");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />

      <div className="absolute inset-0 bg-slate-950/75" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,110,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_25%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 md:px-6">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-[3rem] border border-white/15 bg-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-amber-100">
            Return to the Kingdom
          </div>

          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
            Login
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/70">
            Sign in to continue your adventure, restore your saved progress,
            and chase the leaderboard.
          </p>

          {/* Email */}
          <div className="mt-6">
            <label className="block">
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

            {/* Password */}
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
          </div>

          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/75">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) =>
                setForm({ ...form, rememberMe: e.target.checked })
              }
              className="h-4 w-4 accent-amber-300"
            />
            Remember me
          </label>

          <button
            disabled={busy}
            className="mt-5 w-full rounded-2xl bg-amber-300 px-5 py-3.5 font-black text-black shadow-lg transition hover:scale-[1.01] disabled:opacity-60"
          >
            {busy ? "Logging in..." : "Login"}
          </button>

          <div className="mt-5 text-sm text-white/70">
            No account?{" "}
            <Link
              className="font-semibold text-amber-300 underline underline-offset-4"
              to="/register"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}