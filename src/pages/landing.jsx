import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../lib/auth";

const BG_IMAGE = "/game-assets/easy-bg-loop.jpg";
const KNIGHT_IMAGE = "/game-assets/Run (1).png";
const DRAGON_IMAGE = "/game-assets/dragon.gif";
const EGG_IMAGE = "/game-assets/dragon-egg.svg";
const HEART_IMAGE = "/game-assets/revive-heart.svg";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const primaryLink = !loading && user ? "/menu" : "/register";
  const secondaryLink = !loading && user ? "/menu" : "/login";

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,120,0.14),transparent_35%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative z-10 h-screen flex items-center justify-center px-4 py-4 md:px-6">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="rounded-[3rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 md:p-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-amber-100">
              Knight Adventure
            </div>

            <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight text-white drop-shadow">
              HeartCode Runner
              <span className="block text-amber-300">Endless. Fast. Addictive.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm md:text-base text-white/80 leading-7">
              When you fail in this endless runner, the Heart Game challenge <br /> 
              gives you the chance to come back.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={primaryLink}
                className="px-6 py-3 rounded-2xl bg-amber-300 text-black font-bold shadow-lg hover:scale-[1.03] transition"
              >
                Create account
              </Link>

              <Link
                to={secondaryLink}
                className="px-6 py-3 rounded-2xl border border-white/25 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/40 transition"
              >
                Login
              </Link>
            </div>

            <div className="mt-5 text-sm text-white/70">
              {!loading && user ? (
                `Welcome back${user.firstName ? `, ${user.firstName}` : ""}. Your session is still active.`
              ) : (
                <>
                  Tip: Use <b>Space</b> to jump. Beat your high score and climb the leaderboard.
                </>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center">
                <div className="text-xl md:text-2xl font-black text-amber-300">3</div>
                <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wide text-white/60">
                  Game Modes
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center">
                <div className="text-xl md:text-2xl font-black text-amber-300">2+</div>
                <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wide text-white/60">
                  Revive Chances
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center">
                <div className="text-xl md:text-2xl font-black text-amber-300">50</div>
                <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wide text-white/60">
                  Per Egg
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center">
                <div className="text-xl md:text-2xl font-black text-amber-300">∞</div>
                <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wide text-white/60">
                  Endless Run
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[3rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-4 md:p-5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.15))]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg md:text-xl font-bold text-white">
                    Game Preview
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Enter the world of knights and dragons
                  </div>
                </div>

               
              </div>

              <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                <div className="relative h-47.5 md:h-52.5 overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${BG_IMAGE})` }}
                  />
                  <div className="absolute inset-0 bg-black/20" />

                  <motion.img
                    src={KNIGHT_IMAGE}
                    alt="Knight"
                    className="absolute left-6 bottom-5 h-20 md:h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />

                  <motion.img
                    src={DRAGON_IMAGE}
                    alt="Dragon"
                    className="absolute right-5 bottom-5 h-16 md:h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]"
                    animate={{ x: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <motion.img
                    src={EGG_IMAGE}
                    alt="Dragon egg"
                    className="absolute left-[43%] bottom-10 h-8 w-8 md:h-10 md:w-10 object-contain"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />

                  <motion.img
                    src={HEART_IMAGE}
                    alt="Revive heart"
                    className="absolute left-[58%] top-8 h-7 w-7 md:h-8 md:w-8 object-contain"
                    animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />

                  <div className="absolute left-3 top-3 rounded-2xl border border-white/10 bg-black/35 px-3 py-2 text-[11px] md:text-xs text-white/85 backdrop-blur-md">
                    Collect eggs • Avoid dragons • Revive with Heart API
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-base md:text-lg font-bold text-white">
                    Game Instructions
                  </div>

                  <div className="mt-3 space-y-2.5 text-white/80">
                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-2.5">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-300 shrink-0" />
                      <span className="text-sm">
                        Press <b>Enter</b> to start your game session.
                      </span>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-2.5">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-300 shrink-0" />
                      <span className="text-sm">
                        Press <b>Space</b> or <b>↑</b> to jump over dragons.
                      </span>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-2.5">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-300 shrink-0" />
                      <span className="text-sm">
                        Collect dragon eggs to increase your score. Each egg gives <b>50 points</b>.
                      </span>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-2.5">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-300 shrink-0" />
                      <span className="text-sm">
                        When defeated, solve the Heart puzzle correctly to revive and continue.
                      </span>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-2.5">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-300 shrink-0" />
                      <span className="text-sm">
                        Collect the hidden heart icon once per session to gain <b>+1 extra revive chance</b>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}