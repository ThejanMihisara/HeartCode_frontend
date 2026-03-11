import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const BG_IMAGE = "/game-assets/hard-bg-loop.jpg";

export default function LeaderboardPage() {
  const [top, setTop] = useState([]);

  useEffect(() => {
    api
      .get("/game/leaderboard")
      .then((r) => setTop(r.data.top))
      .catch(() => setTop([]));
  }, []);

  function rankStyle(idx) {
    if (idx === 0) return "bg-gradient-to-r from-yellow-300/30 to-amber-400/20 border-yellow-300/30";
    if (idx === 1) return "bg-gradient-to-r from-slate-200/20 to-slate-400/10 border-slate-200/20";
    if (idx === 2) return "bg-gradient-to-r from-orange-300/20 to-amber-700/10 border-orange-300/20";
    return "bg-white/5 border-white/10";
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,120,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_25%)]" />

      <div className="relative z-10 min-h-screen px-4 py-6 md:px-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-5 md:p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-amber-100">
                  Hall of Heroes
                </div>
                <h2 className="mt-3 text-3xl md:text-4xl font-black text-white drop-shadow">
                  Leaderboard
                </h2>
                <p className="mt-2 text-sm md:text-base text-white/70">
                  See the best dragon egg hunters and highest scores in the kingdom.
                </p>
              </div>

              <Link
                className="px-5 py-3 rounded-2xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/35 transition"
                to="/menu"
              >
                Back
              </Link>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-white/10 overflow-hidden bg-black/20">
              <div className="grid grid-cols-12 gap-2 px-5 py-4 bg-black/30 text-sm text-white/60 font-semibold uppercase tracking-wide">
                <div className="col-span-2">Rank</div>
                <div className="col-span-7">Player</div>
                <div className="col-span-3 text-right">High score</div>
              </div>

              <div className="p-3 space-y-3">
                {top.map((u, idx) => (
                  <div
                    key={u._id}
                    className={`grid grid-cols-12 gap-2 px-4 py-4 rounded-2xl border ${rankStyle(idx)} backdrop-blur-sm`}
                  >
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-black/25 border border-white/10 text-white font-black">
                        #{idx + 1}
                      </div>
                    </div>

                    <div className="col-span-7 flex items-center">
                      <div>
                        <div className="font-bold text-white text-base md:text-lg">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-sm text-white/55">
                          Legendary runner
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center justify-end">
                      <div className="rounded-2xl bg-black/25 border border-white/10 px-4 py-2 text-right">
                        <div className="text-xs uppercase tracking-wide text-white/50">
                          Score
                        </div>
                        <div className="text-lg md:text-xl font-black text-amber-300">
                          {u.highScore}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {top.length === 0 && (
                  <div className="px-5 py-10 text-center text-white/65">
                    No scores yet. Be the first!
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-center">
                <div className="text-2xl font-black text-amber-300">
                  {top.length}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-white/60">
                  Ranked Players
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-center">
                <div className="text-2xl font-black text-amber-300">
                  {top[0]?.highScore || 0}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-white/60">
                  Top Score
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-center">
                <div className="text-2xl font-black text-amber-300">
                  Dragon
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-white/60">
                  Egg Masters
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}