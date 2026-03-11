import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import toast from "react-hot-toast";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80";

export default function ProgressLogPage() {
  const [data, setData] = useState({ summary: null, runs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/game/progress-log");
        setData(res.data);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load progress log");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const user = data.summary?.user;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,110,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_25%)]" />

      <div className="relative z-10 min-h-screen px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-amber-100">
                  Player Performance
                </div>
                <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  Progress Log
                </h1>
                <p className="mt-2 text-sm text-white/70 md:text-base">
                  Track your performance, view detailed stats, and analyze your gameplay
                </p>
              </div>

              <Link
                to="/menu"
                className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10 hover:border-white/35 transition"
              >
                Back to Menu
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/20 p-6 text-white/75">
                Loading progress log...
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-white/60">Player</div>
                    <div className="mt-1 text-xl font-black text-white">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-white/65">@{user?.username}</div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-white/60">High score</div>
                    <div className="mt-1 text-3xl font-black text-amber-300">
                      {user?.highScore || 0}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-white/60">Average score</div>
                    <div className="mt-1 text-3xl font-black text-amber-300">
                      {data.summary?.averageScore || 0}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-white/60">Total runs</div>
                    <div className="mt-1 text-3xl font-black text-amber-300">
                      {user?.totalRuns || 0}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-white/60">Revives used</div>
                    <div className="mt-1 text-3xl font-black text-amber-300">
                      {data.summary?.totalRevives || 0}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-white/60">Eggs collected</div>
                    <div className="mt-1 text-3xl font-black text-amber-300">
                      {data.summary?.totalEggs || 0}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xl font-black text-white">Recent runs</div>
                      <div className="mt-1 text-sm text-white/60">
                        Your latest sessions, scores, eggs, revives, and play duration
                      </div>
                    </div>
                    <div className="hidden rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100 md:block">
                      Private Log
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto rounded-[1.4rem] border border-white/10 bg-black/15">
                    <table className="w-full min-w-[860px] text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-sm uppercase tracking-wide text-white/55">
                          <th className="px-5 py-4 pr-4">Played at</th>
                          <th className="px-5 py-4 pr-4">Mode</th>
                          <th className="px-5 py-4 pr-4">Score</th>
                          <th className="px-5 py-4 pr-4">Eggs</th>
                          <th className="px-5 py-4 pr-4">Revives</th>
                          <th className="px-5 py-4 pr-4">Duration</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.runs.length === 0 ? (
                          <tr>
                            <td className="px-5 py-8 text-white/65" colSpan="6">
                              No runs saved yet. Play a game to start your performance log.
                            </td>
                          </tr>
                        ) : (
                          data.runs.map((run, index) => (
                            <tr
                              key={run._id}
                              className={`border-b border-white/5 text-sm text-white/85 ${
                                index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                              }`}
                            >
                              <td className="px-5 py-4 pr-4">
                                {new Date(run.createdAt).toLocaleString()}
                              </td>

                              <td className="px-5 py-4 pr-4">
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide">
                                  {run.mode || "easy"}
                                </span>
                              </td>

                              <td className="px-5 py-4 pr-4 font-bold text-amber-300">
                                {run.score}
                              </td>

                              <td className="px-5 py-4 pr-4">{run.eggCount || 0}</td>

                              <td className="px-5 py-4 pr-4">{run.revived}</td>

                              <td className="px-5 py-4 pr-4">{run.durationSeconds}s</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}