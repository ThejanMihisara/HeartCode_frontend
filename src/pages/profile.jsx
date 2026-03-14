import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const BG_IMAGE =
  "/game-assets/bg-profile.jpg";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.patch("/users/me", {
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update profile");
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

      <div className="relative z-10 min-h-screen px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-[3rem] border border-white/15 bg-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-amber-100">
              Knight Profile
            </div>

            <div className="mt-5 flex justify-center">
              <img
                src={user?.image}
                alt="Avatar"
                className="h-32 w-32 rounded-[1.8rem] border border-white/10 object-cover shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
              />
            </div>

            <div className="mt-5 text-center">
              <div className="text-2xl font-black text-white">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="mt-1 text-white/70">UserName: {user?.username}</div>
              <div className="mt-1 text-sm text-white/55 break-all">{user?.email}</div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-white/80">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                High score: <b className="text-amber-300">{user?.highScore || 0}</b>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                Total runs: <b className="text-amber-300">{user?.totalRuns || 0}</b>
              </div>
              
            </div>

            <Link
              to="/menu"
              className="mt-6 inline-block w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-center font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
            >
              Back to Menu
            </Link>
          </div>

          <form
            onSubmit={submit}
            className="rounded-[3rem] border border-white/15 bg-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-amber-100">
              Account Settings
            </div>

            <h1 className="mt-4 text-3xl font-black text-white">Profile</h1>
            <p className="mt-2 text-white/70">
              Update your account name details. Your avatar refreshes automatically
              from your initials.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <div className="mb-2 text-sm text-white/65">Username</div>
                <input
                  className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-amber-300/45"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm text-white/65">Email</div>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white/60 outline-none"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm text-white/65">First name</div>
                <input
                  className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-amber-300/45"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm text-white/65">Last name</div>
                <input
                  className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-amber-300/45"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </label>
            </div>

            <button
              disabled={busy}
              className="mt-6 rounded-2xl bg-amber-300 px-6 py-3 font-black text-black shadow-lg transition hover:scale-[1.01] disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}