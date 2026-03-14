import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const MODES = {
  easy: {
    name: "Easy",
    subtitle: "Calm forest · softer pace",
    accent: "from-emerald-300 to-lime-400",
  },
  medium: {
    name: "Medium",
    subtitle: "Twilight forest · balanced challenge",
    accent: "from-amber-300 to-orange-400",
  },
  hard: {
    name: "Hard",
    subtitle: "Dark forest · fast and fierce",
    accent: "from-rose-400 to-red-500",
  },
};

const BG_IMAGE =
  "/game-assets/bg-menu.jpg";

export default function MenuPage() {
  const nav = useNavigate();
  const { user, refresh } = useAuth();
  const [mode, setMode] = useState("easy");
  const [checkpoint, setCheckpoint] = useState({ checkpointScore: 0, checkpointMode: "" });
  const [loadingCheckpoint, setLoadingCheckpoint] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/game/checkpoint");
        setCheckpoint(data);
        if (data?.checkpointMode) {
          setMode(data.checkpointMode);
        }
      } catch {
        setCheckpoint({ checkpointScore: 0, checkpointMode: "" });
      } finally {
        setLoadingCheckpoint(false);
      }
    })();
  }, []);

  async function logout() {
    await api.post("/users/logout");
    await refresh();
    toast.success("Logged out");
    nav("/");
  }

  async function startNewGame() {
    try {
      await api.delete("/game/checkpoint");
    } catch {
      // ignore if no checkpoint yet
    }
    nav(`/game?mode=${mode}`);
  }

  const hasCheckpoint = Number(checkpoint.checkpointScore || 0) > 0;
  const continueMode = checkpoint.checkpointMode || mode;

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,110,0.14),transparent_32%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_30%)]" />

      <div className="relative z-10 h-screen px-4 py-3 md:px-6 md:py-4">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col rounded-[3rem] border border-white/15 bg-white/10 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-4">
          <div className="flex shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
              <img
                src={user?.image}
                alt="avatar"
                className="h-14 w-14 rounded-3xl border border-white/10 object-cover shadow-lg md:h-16 md:w-16"
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-amber-200/80 md:text-xs">
                  Knight Profile
                </div>
                <div className="mt-0.5 text-lg font-black text-white md:text-2xl">
                  {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                </div>
                {user && (
                  <div className="mt-0.5 text-[11px] text-white/75 md:text-sm">
                    High score: <b>{user.highScore}</b> · Username: <b>{user.username || "player"}</b>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-2xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
            >
              Logout
            </button>
          </div>

          <div className="mt-3 grid flex-1 gap-3 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-black text-white md:text-2xl">
                    Choose your adventure mode
                  </div>
                 
                </div>
                <div className="hidden rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold text-amber-100 md:block">
                  Mode Select
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {Object.entries(MODES).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`group rounded-[1.3rem] border p-3 text-left transition ${
                      mode === key
                        ? "border-amber-300/50 bg-white/12 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                        : "border-white/10 bg-black/10 hover:border-white/25 hover:bg-white/5"
                    }`}
                  >
                    <div className={`h-2 rounded-full bg-linear-to-r ${item.accent}`} />
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="text-base font-black text-white md:text-lg">
                        {item.name}
                      </div>
                      {mode === key && (
                        <div className="rounded-full bg-amber-300 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-black">
                          Selected
                        </div>
                      )}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-white/70">
                      {item.subtitle}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={startNewGame}
                className="mt-3 w-full rounded-2xl bg-amber-300 px-5 py-3.5 font-black text-black shadow-lg transition hover:scale-[1.01]"
              >
                New Game · {MODES[mode].name}
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4 shadow-lg">
              <div className="text-lg font-black text-white md:text-2xl">
                Continue saved progress
              </div>
              <p className="mt-1 text-[11px] leading-5 text-white/70 md:text-sm">
                You can have one active saved run at a time. Use Save & Exit in the pause menu, or close the tab after the autosave kicks in.
              </p>

              <div className="mt-3 rounded-[1.3rem] border border-white/10 bg-black/15 p-4">
                {loadingCheckpoint ? (
                  <div className="text-sm text-white/65">Checking your saved game...</div>
                ) : hasCheckpoint ? (
                  <>
                    <div className="text-xs text-white/60 md:text-sm">Saved run</div>
                    <div className="mt-1 text-2xl font-black text-amber-300 md:text-3xl">
                      {checkpoint.checkpointScore} pts
                    </div>
                    <div className="mt-1.5 text-sm text-white/75">
                      Mode: <b>{MODES[continueMode].name}</b>
                    </div>
                    <Link
                      to="/game?continue=1"
                      className="mt-3 inline-block w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-center font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
                    >
                      Continue Game
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-white/70">
                      No active saved run for this account yet.
                    </div>
                    <div className="mt-1.5 text-xs leading-5 text-white/55 md:text-sm">
                      Start a game and use Save & Exit, or close the tab after the autosave kicks in.
                    </div>
                  </>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <Link
                  to="/leaderboard"
                  className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-center font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
                >
                  Leaderboard
                </Link>
                <Link
                  to="/progress-log"
                  className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-center font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
                >
                  Progress Log
                </Link>
                <Link
                  to="/profile"
                  className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-center font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-center font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
                >
                  Back to Landing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}