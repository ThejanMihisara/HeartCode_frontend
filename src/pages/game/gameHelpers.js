import { EGG_VALUE } from "./gameConfig";

// Clamp value between min and max
export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

// Calculate score from egg count
export function scoreFrom(eggsCollected) {
  return eggsCollected * EGG_VALUE;
}

// Create initial obstacles
export function createStarterObstacles(config) {
  return [
    { id: 1, x: 1040, width: config.enemyWidth, height: config.enemyHeight, speed: config.baseObstacleSpeed },
    { id: 2, x: 1040 + config.obstacleGapMin + 120, width: config.enemyWidth, height: config.enemyHeight, speed: config.baseObstacleSpeed + 12 },
    { id: 3, x: 1040 + (config.obstacleGapMin + 120) * 2, width: config.enemyWidth, height: config.enemyHeight, speed: config.baseObstacleSpeed + 24 },
  ];
}

// Create initial eggs
export function createStarterEggs(config) {
  return [
    { id: 1, x: 860, y: config.eggHeightMin + 30, size: 54 },
    { id: 2, x: 1300, y: config.eggHeightMin + 55, size: 56 },
    { id: 3, x: 1740, y: config.eggHeightMin + 22, size: 52 },
  ];
}

// Create heart collectible
export function createHeartCollectible() {
  return { id: 1, x: 2120, y: 176, size: 62, collected: false, active: true };
}
