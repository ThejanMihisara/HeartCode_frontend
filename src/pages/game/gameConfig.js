export const RUN_FRAMES = Array.from({ length: 10 }, (_, i) => `/game-assets/Run (${i + 1}).png`);
export const JUMP_FRAME = `/game-assets/Jump (4).png`;
export const DEAD_FRAME = `/game-assets/Dead (6).png`;
export const EASY_BG_IMAGE = `/game-assets/easy-bg-loop.jpg`;
export const MEDIUM_BG_IMAGE = `/game-assets/medium-bg-loop.jpg`;
export const HARD_BG_IMAGE = `/game-assets/hard-bg-loop.jpg`;
export const DRAGON_IMAGE = `/game-assets/dragon.gif`;
export const EGG_IMAGE = `/game-assets/dragon-egg.svg`;
export const HEART_IMAGE = `/game-assets/revive-heart.svg`;
export const EGG_VALUE = 50;
export const BASE_REVIVE_CHANCES = 2;
export const GROUND_Y = 0;

export const MODE_CONFIG = {
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
