import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const RUN_FRAMES = Array.from({ length: 10 }, (_, i) => `/game-assets/Run (${i + 1}).png`);
const JUMP_FRAME = `/game-assets/Jump (4).png`;
const DEAD_FRAME = `/game-assets/Dead (6).png`;
const EASY_BG_IMAGE = `/game-assets/easy-bg-loop.jpg`;
const MEDIUM_BG_IMAGE = `/game-assets/medium-bg-loop.jpg`;
const HARD_BG_IMAGE = `/game-assets/hard-bg-loop.jpg`;
const DRAGON_IMAGE = `/game-assets/dragon.gif`;
const EGG_IMAGE = `/game-assets/dragon-egg.svg`;
const HEART_IMAGE = `/game-assets/revive-heart.svg`;
const EGG_VALUE = 50;
const BASE_REVIVE_CHANCES = 2;

const MODE_CONFIG = {
  easy: {
    label: "Easy",
    enemyImage: DRAGON_IMAGE,
    backgroundImage: EASY_BG_IMAGE,
    worldFilter: "saturate(1.03) brightness(1.04)",
    jumpVelocity: 1040,
    gravity: -2260,
    baseObstacleSpeed: 300,
    speedScale: 0.7,
    obstacleGapMin: 630,
    obstacleGapRange: 240,
    enemyWidth: 112,
    enemyHeight: 82,
    hitbox: { left: 26, width: 48, bottom: 74, height: 40 },
    eggGapMin: 330,
    eggGapRange: 280,
    eggHeightMin: 120,
    eggHeightRange: 80,
  },
  medium: {
    label: "Medium",
    enemyImage: DRAGON_IMAGE,
    backgroundImage: MEDIUM_BG_IMAGE,
    worldFilter: "saturate(0.98) brightness(0.98)",
    jumpVelocity: 980,
    gravity: -2460,
    baseObstacleSpeed: 345,
    speedScale: 1,
    obstacleGapMin: 560,
    obstacleGapRange: 210,
    enemyWidth: 126,
    enemyHeight: 92,
    hitbox: { left: 32, width: 54, bottom: 75, height: 48 },
    eggGapMin: 310,
    eggGapRange: 240,
    eggHeightMin: 126,
    eggHeightRange: 94,
  },
  hard: {
    label: "Hard",
    enemyImage: DRAGON_IMAGE,
    backgroundImage: HARD_BG_IMAGE,
    worldFilter: "saturate(0.92) brightness(0.82)",
    jumpVelocity: 940,
    gravity: -2580,
    baseObstacleSpeed: 395,
    speedScale: 1.28,
    obstacleGapMin: 495,
    obstacleGapRange: 165,
    enemyWidth: 144,
    enemyHeight: 106,
    hitbox: { left: 36, width: 60, bottom: 76, height: 54 },
    eggGapMin: 280,
    eggGapRange: 220,
    eggHeightMin: 132,
    eggHeightRange: 105,
  },
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function scoreFrom(eggsCollected) {
  return eggsCollected * EGG_VALUE;
}

function createStarterObstacles(config) {
  return [
    { id: 1, x: 1040, width: config.enemyWidth, height: config.enemyHeight, speed: config.baseObstacleSpeed },
    { id: 2, x: 1040 + config.obstacleGapMin + 120, width: config.enemyWidth, height: config.enemyHeight, speed: config.baseObstacleSpeed + 12 },
    { id: 3, x: 1040 + (config.obstacleGapMin + 120) * 2, width: config.enemyWidth, height: config.enemyHeight, speed: config.baseObstacleSpeed + 24 },
  ];
}

function createStarterEggs(config) {
  return [
    { id: 1, x: 860, y: config.eggHeightMin + 30, size: 54 },
    { id: 2, x: 1300, y: config.eggHeightMin + 55, size: 56 },
    { id: 3, x: 1740, y: config.eggHeightMin + 22, size: 52 },
  ];
}

function createHeartCollectible() {
  return { id: 1, x: 2120, y: 176, size: 62, collected: false, active: true };
}

export default function GamePage() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const requestedMode = params.get("mode");
  const isContinue = params.get("continue") === "1";

  const [modeKey, setModeKey] = useState(MODE_CONFIG[requestedMode] ? requestedMode : "easy");
  const mode = useMemo(() => MODE_CONFIG[modeKey], [modeKey]);

  const rafRef = useRef(0);
  const runStartedAtRef = useRef(0);
  const reviveCountRef = useRef(0);
  const heartCountRef = useRef(0);
  const lastTsRef = useRef(0);
  const eggCountRef = useRef(0);
  const frameAccRef = useRef(0);
  const playerYRef = useRef(0);
  const obstaclesRef = useRef([]);
  const eggsRef = useRef([]);
  const heartItemRef = useRef(createHeartCollectible());
  const worldOffsetRef = useRef(0);
  const runLoggedRef = useRef(false);

  const [ready, setReady] = useState(!isContinue);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [eggCount, setEggCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [playerFrame, setPlayerFrame] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [eggs, setEggs] = useState([]);
  const [heartItem, setHeartItem] = useState(createHeartCollectible());
  const [worldOffset, setWorldOffset] = useState(0);
  const [statusText, setStatusText] = useState("Press Enter to start");
  const [reviveState, setReviveState] = useState({ open: false, puzzle: null, answer: "", loading: false });

  const vyRef = useRef(0);
  const groundY = 0;

  const totalReviveChances = BASE_REVIVE_CHANCES + heartCount;
  const reviveLeft = Math.max(0, totalReviveChances - reviveCountRef.current);

  function syncScore() {
    setScore(scoreFrom(eggCountRef.current));
  }

  function resetSession(config, nextModeKey) {
    const starter = createStarterObstacles(config);
    const starterEggs = createStarterEggs(config);
    const starterHeart = createHeartCollectible();
    lastTsRef.current = 0;
    runStartedAtRef.current = Date.now();
    reviveCountRef.current = 0;
    heartCountRef.current = 0;
    eggCountRef.current = 0;
    frameAccRef.current = 0;
    vyRef.current = 0;
    playerYRef.current = 0;
    obstaclesRef.current = starter;
    eggsRef.current = starterEggs;
    heartItemRef.current = starterHeart;
    runLoggedRef.current = false;
    setDead(false);
    setGameOver(false);
    setRunning(true);
    setScore(0);
    setEggCount(0);
    setHeartCount(0);
    setPlayerY(0);
    setPlayerFrame(0);
    setObstacles(starter);
    setEggs(starterEggs);
    setHeartItem(starterHeart);
    worldOffsetRef.current = 0;
    setWorldOffset(0);
    setReviveState({ open: false, puzzle: null, answer: "", loading: false });
    setStatusText(`Running · ${config.label} mode`);
    api.delete("/game/checkpoint").catch(() => {});
    setModeKey(nextModeKey);
  }

  useEffect(() => {
    const starter = createStarterObstacles(mode);
    const starterEggs = createStarterEggs(mode);
    const starterHeart = createHeartCollectible();
    obstaclesRef.current = starter;
    eggsRef.current = starterEggs;
    heartItemRef.current = starterHeart;
    setObstacles(starter);
    setEggs(starterEggs);
    setHeartItem(starterHeart);
    setPlayerY(0);
    playerYRef.current = 0;
    setPlayerFrame(0);
    frameAccRef.current = 0;
    setWorldOffset(0);
    worldOffsetRef.current = 0;
    lastTsRef.current = 0;
    if (!isContinue) {
      setDead(false);
      setGameOver(false);
      setRunning(false);
      setScore(0);
      setEggCount(0);
      setHeartCount(0);
      eggCountRef.current = 0;
      heartCountRef.current = 0;
      runLoggedRef.current = false;
      reviveCountRef.current = 0;
      setStatusText(`Selected mode: ${mode.label}`);
    }
  }, [modeKey]);

  useEffect(() => {
    playerYRef.current = playerY;
  }, [playerY]);

  useEffect(() => {
    obstaclesRef.current = obstacles;
  }, [obstacles]);

  useEffect(() => {
    eggsRef.current = eggs;
  }, [eggs]);

  useEffect(() => {
    heartItemRef.current = heartItem;
  }, [heartItem]);

  useEffect(() => {
    (async () => {
      if (!isContinue) {
        setReady(true);
        return;
      }

      try {
        const { data } = await api.get("/game/checkpoint");
        const savedMode = MODE_CONFIG[data.checkpointMode] ? data.checkpointMode : "easy";
        if ((data.checkpointScore || 0) <= 0 && (data.checkpointEggs || 0) <= 0) {
          toast("No saved run found. Starting a new game.");
          setModeKey(MODE_CONFIG[requestedMode] ? requestedMode : "easy");
          setReady(true);
          return;
        }

        setModeKey(savedMode);
        eggCountRef.current = Number(data.checkpointEggs) || 0;
        heartCountRef.current = Number(data.checkpointHeartCount) || 0;
        reviveCountRef.current = Number(data.checkpointRevivesUsed) || 0;
        setEggCount(eggCountRef.current);
        setHeartCount(heartCountRef.current);
        setScore(Number(data.checkpointScore) || scoreFrom(eggCountRef.current));

        const starter = createStarterObstacles(MODE_CONFIG[savedMode]);
        const starterEggs = createStarterEggs(MODE_CONFIG[savedMode]);
        const starterHeart = createHeartCollectible();
        if (heartCountRef.current > 0) {
          starterHeart.active = false;
          starterHeart.collected = true;
          starterHeart.x = -9999;
        }
        obstaclesRef.current = starter;
        eggsRef.current = starterEggs;
        heartItemRef.current = starterHeart;
        setObstacles(starter);
        setEggs(starterEggs);
        setHeartItem(starterHeart);
        setStatusText(`Continue ${MODE_CONFIG[savedMode].label} mode from ${scoreFrom(eggCountRef.current)} points`);
      } catch {
        toast.error("Could not load saved game");
      } finally {
        setReady(true);
      }
    })();
  }, [isContinue, requestedMode]);

  useEffect(() => {
    function onKey(e) {
      if (e.code === "Enter") {
        if (!ready || dead || gameOver) return;
        if (!runStartedAtRef.current) runStartedAtRef.current = Date.now();
        setRunning(true);
        setStatusText(`Running · ${mode.label} mode`);
      }
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!ready || dead || gameOver) return;
        if (!runStartedAtRef.current) runStartedAtRef.current = Date.now();
        if (playerYRef.current === groundY) {
          vyRef.current = mode.jumpVelocity;
        }
        setRunning(true);
        setStatusText(`Running · ${mode.label} mode`);
      }
      if (e.code === "KeyR") {
        resetSession(MODE_CONFIG[modeKey], modeKey);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dead, ready, modeKey, mode, gameOver]);

  useEffect(() => {
    async function persistRun() {
      if (runLoggedRef.current || !user) return;
      runLoggedRef.current = true;
      try {
        await api.post("/game/run", {
          score: scoreFrom(eggCountRef.current),
          revived: reviveCountRef.current,
          durationSeconds: Math.max(1, Math.round((Date.now() - (runStartedAtRef.current || Date.now())) / 1000)),
          eggCount: eggCountRef.current,
          mode: modeKey,
        });
        await refresh();
      } catch {
        // ignore in UI
      }
    }

    if (gameOver) persistRun();
  }, [gameOver, modeKey, refresh, user]);

  useEffect(() => {
    function tick(ts) {
      const last = lastTsRef.current || ts;
      const dt = clamp((ts - last) / 1000, 0, 0.05);
      lastTsRef.current = ts;

      if (ready && running && !dead && !gameOver) {
        vyRef.current += mode.gravity * dt;

        let nextY = playerYRef.current + vyRef.current * dt;
        if (nextY < groundY) {
          nextY = groundY;
          vyRef.current = 0;
        }
        playerYRef.current = nextY;
        setPlayerY(nextY);

        frameAccRef.current += dt * (playerYRef.current > 2 ? 10 : 14);
        setPlayerFrame(Math.floor(frameAccRef.current) % RUN_FRAMES.length);

        const speedBoost = Math.min(eggCountRef.current * 5, 80) * mode.speedScale;
        let rightmostX = -Infinity;
        const moved = obstaclesRef.current
          .map((o) => ({ ...o, x: o.x - (o.speed + speedBoost) * dt }))
          .map((o) => {
            rightmostX = Math.max(rightmostX, o.x);
            return o;
          })
          .map((o) => {
            if (o.x < -o.width - 80) {
              return {
                ...o,
                x: Math.max(1180, rightmostX + mode.obstacleGapMin + Math.random() * mode.obstacleGapRange),
                speed: mode.baseObstacleSpeed + Math.random() * 65,
              };
            }
            return o;
          });
        obstaclesRef.current = moved;
        setObstacles(moved);

        let rightmostEgg = -Infinity;
        const movedEggs = eggsRef.current
          .map((egg) => ({ ...egg, x: egg.x - (mode.baseObstacleSpeed * 0.84 + speedBoost) * dt }))
          .map((egg) => {
            rightmostEgg = Math.max(rightmostEgg, egg.x);
            return egg;
          })
          .map((egg) => {
            if (egg.collected || egg.x < -egg.size - 60) {
              return {
                ...egg,
                collected: false,
                x: Math.max(980, rightmostEgg + mode.eggGapMin + Math.random() * mode.eggGapRange),
                y: mode.eggHeightMin + Math.random() * mode.eggHeightRange,
              };
            }
            return egg;
          });

        const heart = { ...heartItemRef.current };
        if (heart.active && !heart.collected) {
          heart.x -= (mode.baseObstacleSpeed * 0.88 + speedBoost) * dt;
          if (heart.x < -heart.size - 80) {
            heart.active = false;
            heart.x = -9999;
          }
        }

        const playerLeft = 102;
        const playerRight = playerLeft + 48;
        const playerBottom = 74 + nextY;
        const playerTop = playerBottom + 72;

        const eggUpdated = movedEggs.map((egg) => {
          const eggLeft = egg.x + 10;
          const eggRight = eggLeft + egg.size - 20;
          const eggBottom = 58 + egg.y;
          const eggTop = eggBottom + egg.size - 12;
          const overlapsX = playerRight > eggLeft && playerLeft < eggRight;
          const overlapsY = playerBottom < eggTop && playerTop > eggBottom;
          if (!egg.collected && overlapsX && overlapsY) {
            eggCountRef.current += 1;
            setEggCount(eggCountRef.current);
            setScore(scoreFrom(eggCountRef.current));
            return { ...egg, collected: true, x: -9999 };
          }
          return egg;
        });
        eggsRef.current = eggUpdated;
        setEggs(eggUpdated);

        if (heart.active && !heart.collected) {
          const heartLeft = heart.x + 12;
          const heartRight = heartLeft + heart.size - 24;
          const heartBottom = 58 + heart.y;
          const heartTop = heartBottom + heart.size - 16;
          const overlapsX = playerRight > heartLeft && playerLeft < heartRight;
          const overlapsY = playerBottom < heartTop && playerTop > heartBottom;
          if (overlapsX && overlapsY) {
            heart.collected = true;
            heart.active = false;
            heart.x = -9999;
            heartCountRef.current += 1;
            setHeartCount(heartCountRef.current);
            toast.success("Heart found! +1 revive chance");
          }
        }
        heartItemRef.current = heart;
        setHeartItem(heart);

        worldOffsetRef.current += (145 + speedBoost * 0.32) * dt;
        setWorldOffset(worldOffsetRef.current);
        syncScore();

        const hit = moved.some((o) => {
          const dragonLeft = o.x + mode.hitbox.left;
          const dragonRight = dragonLeft + mode.hitbox.width;
          const dragonBottom = mode.hitbox.bottom;
          const dragonTop = dragonBottom + mode.hitbox.height;
          const overlapsX = playerRight > dragonLeft && playerLeft < dragonRight;
          const overlapsY = playerBottom < dragonTop && playerTop > dragonBottom;
          return overlapsX && overlapsY;
        });

        if (hit) {
          handleDefeat();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, dead, ready, mode, modeKey, gameOver]);

  useEffect(() => {
    if (!running || dead || !ready || gameOver) return;
    const id = setInterval(() => {
      saveCheckpoint(scoreFrom(eggCountRef.current), modeKey, eggCountRef.current, heartCountRef.current, reviveCountRef.current, false);
    }, 7000);
    return () => clearInterval(id);
  }, [running, dead, ready, modeKey, gameOver]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (running && !dead && !gameOver && (eggCountRef.current > 0 || heartCountRef.current > 0 || reviveCountRef.current > 0)) {
        saveCheckpoint(scoreFrom(eggCountRef.current), modeKey, eggCountRef.current, heartCountRef.current, reviveCountRef.current, false);
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [running, dead, modeKey, gameOver]);

  async function handleDefeat() {
    setDead(true);
    setRunning(false);
    setReviveState({ open: false, puzzle: null, answer: "", loading: false });

    const remaining = BASE_REVIVE_CHANCES + heartCountRef.current - reviveCountRef.current;
    if (remaining > 0) {
      setStatusText(`Defeated · ${remaining} revive ${remaining === 1 ? "chance" : "chances"} left`);
      setReviveState({ open: true, puzzle: null, answer: "", loading: false });
      await loadPuzzle();
      return;
    }

    setStatusText("Game over · No revive chances left");
    setGameOver(true);
    api.delete("/game/checkpoint").catch(() => {});
  }

  async function saveCheckpoint(scoreValue, modeValue, eggCountValue, heartCountValue, revivesUsedValue, showToast = true) {
    try {
      await api.post("/game/checkpoint", {
        score: scoreValue,
        mode: modeValue,
        eggCount: eggCountValue,
        heartCount: heartCountValue,
        revivesUsed: revivesUsedValue,
      });
      if (showToast) toast.success("Progress saved for this account");
    } catch {
      if (showToast) toast.error("Could not save progress");
    }
  }

  async function saveAndExit() {
    await saveCheckpoint(scoreFrom(eggCountRef.current), modeKey, eggCountRef.current, heartCountRef.current, reviveCountRef.current, true);
    await refresh();
    nav("/menu");
  }

  async function loadPuzzle() {
    setReviveState((r) => ({ ...r, loading: true }));
    try {
      const { data } = await api.get("/heart/puzzle");
      setReviveState((r) => ({ ...r, puzzle: data.puzzle, loading: false }));
    } catch {
      toast.error("Failed to load Heart puzzle");
      setReviveState((r) => ({ ...r, loading: false }));
    }
  }

async function tryRevive() {
  const solution = reviveState.puzzle?.solution;

  if (solution == null) {
    toast.error("No solution received");
    return;
  }

  reviveCountRef.current += 1;

  const remainingAfterThisTry =
    Math.max(0, BASE_REVIVE_CHANCES + heartCountRef.current - reviveCountRef.current);

  const isCorrect =
    String(reviveState.answer).trim() === String(solution).trim();

  if (isCorrect) {

    // move dragons forward so player doesn't instantly collide again
    const safeObstacles = obstaclesRef.current.map((o) => ({
      ...o,
      x: o.x + 350,
    }));

    obstaclesRef.current = safeObstacles;
    setObstacles(safeObstacles);

    // small jump boost to avoid ground collision
    vyRef.current = mode.jumpVelocity * 0.55;

    // close revive popup
    setReviveState({
      open: false,
      puzzle: null,
      answer: "",
      loading: false,
    });

    // revive player
    setDead(false);

    // reset animation timing
    lastTsRef.current = 0;

    // resume game loop
    setRunning(true);

    setStatusText(`Revived · ${mode.label} mode`);

    await saveCheckpoint(
      scoreFrom(eggCountRef.current),
      modeKey,
      eggCountRef.current,
      heartCountRef.current,
      reviveCountRef.current,
      false
    );

    return;
  }

  // wrong answer
  if (remainingAfterThisTry <= 0) {
    setReviveState({
      open: false,
      puzzle: null,
      answer: "",
      loading: false,
    });

    setStatusText("Game over · No revive chances left");
    setGameOver(true);

    api.delete("/game/checkpoint").catch(() => {});

    toast.error("Wrong answer. No revive chances left.");
  } else {
    setStatusText(
      `Wrong answer · ${remainingAfterThisTry} revive ${
        remainingAfterThisTry === 1 ? "chance" : "chances"
      } left`
    );

    toast.error(
      `Wrong answer. ${remainingAfterThisTry} revive ${
        remainingAfterThisTry === 1 ? "chance" : "chances"
      } left.`
    );

    setReviveState((r) => ({
      ...r,
      answer: "",
    }));
  }
}

  const playerImage = dead ? DEAD_FRAME : playerY > 1 ? JUMP_FRAME : RUN_FRAMES[playerFrame];

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="rounded-3xl border border-secondary/20 bg-black/20 p-6">Loading your adventure...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,110,0.12),transparent_25%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_20%)]" />

      <div className="relative z-10 h-screen px-3 py-3 md:px-5 md:py-4">
        <div className="mx-auto flex h-full max-w-7xl flex-col gap-3">
          <div className="grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Score</div>
              <div className="mt-1 text-2xl font-black text-amber-300 md:text-3xl">{score}</div>
              <div className="mt-1 text-xs text-white/70 line-clamp-2">{statusText}</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Dragon Eggs</div>
              <div className="mt-1 text-2xl font-black text-amber-300 md:text-3xl">{eggCount}</div>
              <div className="mt-1 text-xs text-white/70">Each egg adds {EGG_VALUE} score</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Revive Chances</div>
              <div className="mt-1 text-2xl font-black text-amber-300 md:text-3xl">{reviveLeft}</div>
              <div className="mt-1 inline-flex items-center gap-2 text-xs text-white/70">
                <img src={HEART_IMAGE} alt="Heart" className="h-5 w-5 object-contain" />
                Session hearts: {heartCount}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-xl">
              <div className="grid h-full grid-cols-3 gap-2">
                <button
                  onClick={() => resetSession(MODE_CONFIG[modeKey], modeKey)}
                  className="rounded-2xl bg-amber-300 px-3 py-2 text-xs font-black text-black md:text-sm"
                >
                  Restart
                </button>
                <button
                  onClick={saveAndExit}
                  className="rounded-2xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 md:text-sm"
                >
                  Save & Exit
                </button>
                <Link
                  to="/menu"
                  className="rounded-2xl border border-white/20 bg-white/5 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-white/10 md:text-sm"
                >
                  Menu
                </Link>
              </div>
            </div>
          </div>

          <div
            className="relative min-h-0 flex-1 overflow-hidden rounded-[3rem] border border-white/10 bg-black/20 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
            style={{ minHeight: 0 }}
          >
            <div
              className="runner-backdrop absolute inset-0"
              style={{
                backgroundImage: `url(${mode.backgroundImage})`,
                backgroundPositionX: `${-worldOffset}px`,
                filter: mode.worldFilter,
              }}
            />

            <div className="absolute inset-0 bg-black/10" />

            {!running && !dead && !gameOver && (
              <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                <div className="max-w-2xl rounded-[3rem] border border-white/10 bg-black/35 px-6 py-6 text-center backdrop-blur-xl md:px-8">
                  <div className="text-2xl font-black text-white md:text-4xl">Knight Runner · {mode.label}</div>
                  <p className="mt-3 text-sm text-white/80 md:text-base">
                    Press <b>Enter</b> to start. Press <b>Space</b> or <b>↑</b> to jump over the dragon and collect dragon eggs.
                  </p>
                  <p className="mt-2 text-xs text-white/70 md:text-sm">
                    You start each session with <b>2 revive chances</b>. Collect the hidden heart to unlock <b>1 extra revive</b>.
                  </p>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                <div className="max-w-2xl rounded-[3rem] border border-white/10 bg-black/45 px-6 py-6 text-center backdrop-blur-xl md:px-8">
                  <div className="inline-flex rounded-full border border-red-300/20 bg-red-500/15 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-red-200 md:text-xs">
                    Game Over
                  </div>
                  <div className="mt-4 text-3xl font-black tracking-wide text-white md:text-5xl">
                    The dragon won this round
                  </div>
                  <p className="mt-3 text-sm text-white/80 md:text-base">
                    You used all revive chances for this {mode.label.toLowerCase()} session. Start again and try to collect more eggs before the next battle.
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50">Eggs</span>
                      <strong className="mt-1 block text-xl font-black text-amber-300 md:text-2xl">{eggCount}</strong>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50">Score</span>
                      <strong className="mt-1 block text-xl font-black text-amber-300 md:text-2xl">{score}</strong>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50">Revives used</span>
                      <strong className="mt-1 block text-xl font-black text-amber-300 md:text-2xl">{reviveCountRef.current}</strong>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button onClick={() => resetSession(MODE_CONFIG[modeKey], modeKey)} className="rounded-2xl bg-amber-300 px-5 py-3 font-black text-black">
                      Play Again
                    </button>
                    <Link to="/menu" className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">
                      Back to Menu
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="runner-player z-10" style={{ transform: `translate3d(0, ${-playerY}px, 0)` }}>
              <img src={playerImage} alt="Knight" />
            </div>

            {heartItem.active && !heartItem.collected && (
              <div
                className="runner-heart z-10"
                style={{
                  left: `${heartItem.x}px`,
                  bottom: `${heartItem.y}px`,
                  width: `${heartItem.size}px`,
                  height: `${heartItem.size}px`,
                }}
              >
                <img src={HEART_IMAGE} alt="Revive heart" />
              </div>
            )}

            {eggs.map((egg) => !egg.collected && (
              <div
                key={egg.id}
                className="runner-egg z-10"
                style={{
                  left: `${egg.x}px`,
                  bottom: `${egg.y}px`,
                  width: `${egg.size}px`,
                  height: `${egg.size}px`,
                }}
              >
                <img src={EGG_IMAGE} alt="Dragon egg" />
              </div>
            ))}

            {obstacles.map((o) => (
              <div
                key={o.id}
                className="runner-dragon z-10"
                style={{
                  left: `${o.x}px`,
                  width: `${o.width}px`,
                  height: `${o.height}px`,
                }}
              >
                <img src={mode.enemyImage} alt="Dragon" />
              </div>
            ))}
          </div>

          {reviveState.open && !gameOver && (
            <div className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-black/55 px-4">
              <div className="w-full max-w-3xl rounded-[3rem] border border-white/10 bg-slate-950/90 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] text-amber-200/80 md:text-xs">Heart revive</div>
                <div className="mt-2 text-2xl font-black text-white md:text-3xl">Answer the puzzle to continue</div>
                <p className="mt-2 text-sm text-white/75 md:text-base">
                  Remaining revive chances: <b>{reviveLeft}</b>. Solve correctly and your knight gets one more chance.
                </p>

                <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
                  {reviveState.loading ? (
                    <div className="py-10 text-center text-white/70">Loading puzzle...</div>
                  ) : reviveState.puzzle ? (
                    <img
                      src={`data:${reviveState.puzzle.mime || "image/png"};base64,${reviveState.puzzle.image}`}
                      alt="Heart puzzle"
                      className="mx-auto max-h-55 rounded-2xl"
                    />
                  ) : (
                    <div className="py-10 text-center text-white/60">Puzzle could not be loaded.</div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={reviveState.answer}
                    onChange={(e) => setReviveState((r) => ({ ...r, answer: e.target.value }))}
                    placeholder="Type the answer"
                    className="input flex-1"
                  />
                  <button onClick={tryRevive} className="rounded-2xl bg-amber-300 px-5 py-3 font-black text-black">
                    Revive Now
                  </button>
                  <button onClick={loadPuzzle} className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">
                    Reload Puzzle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}