import { getWaveConfig } from '../config/waves';
import { EnemyType, WaveConfig } from '../types/game';
import { Enemy } from '../entities/Enemy';

export class WaveSystem {
  public currentWaveNumber: number = 1;
  public currentWaveConfig: WaveConfig;
  public enemiesSpawnedInWave: number = 0;
  public enemiesRemainingInWave: number = 0;
  public spawnTimer: number = 0;
  public waveTransitionTimer: number = 0;
  public isTransitioning: boolean = false;
  public bossActive: boolean = false;

  private onWaveStartCallback?: (wave: WaveConfig) => void;

  constructor() {
    this.currentWaveConfig = getWaveConfig(this.currentWaveNumber);
    this.enemiesRemainingInWave = this.currentWaveConfig.totalEnemies;
  }

  public reset() {
    this.currentWaveNumber = 1;
    this.currentWaveConfig = getWaveConfig(1);
    this.enemiesSpawnedInWave = 0;
    this.enemiesRemainingInWave = this.currentWaveConfig.totalEnemies;
    this.spawnTimer = 0;
    this.waveTransitionTimer = 0;
    this.isTransitioning = false;
    this.bossActive = false;
  }

  public setWaveStartCallback(cb: (wave: WaveConfig) => void) {
    this.onWaveStartCallback = cb;
  }

  public update(
    dt: number,
    activeEnemiesCount: number,
    isBossAlive: boolean
  ): { spawnEnemy: boolean; enemyType?: EnemyType; triggerBoss: boolean } {
    // If wave is active boss wave
    if (this.currentWaveConfig.isBossWave) {
      if (!this.bossActive && !this.isTransitioning) {
        this.bossActive = true;
        return { spawnEnemy: false, triggerBoss: true };
      }

      // If boss died, complete wave
      if (this.bossActive && !isBossAlive) {
        this.bossActive = false;
        this.startNextWave();
      }

      return { spawnEnemy: false, triggerBoss: false };
    }

    // In a regular enemy wave
    if (this.isTransitioning) {
      this.waveTransitionTimer -= dt;
      if (this.waveTransitionTimer <= 0) {
        this.isTransitioning = false;
        if (this.onWaveStartCallback) {
          this.onWaveStartCallback(this.currentWaveConfig);
        }
      }
      return { spawnEnemy: false, triggerBoss: false };
    }

    // Check if wave is cleared
    if (this.enemiesSpawnedInWave >= this.currentWaveConfig.totalEnemies && activeEnemiesCount === 0) {
      this.startNextWave();
      return { spawnEnemy: false, triggerBoss: false };
    }

    // Spawning enemies inside current wave
    if (this.enemiesSpawnedInWave < this.currentWaveConfig.totalEnemies) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= this.currentWaveConfig.spawnInterval) {
        this.spawnTimer = 0;
        this.enemiesSpawnedInWave++;

        // Pick random enemy type from current wave pool
        const pool = this.currentWaveConfig.enemyTypes;
        const pickedType = pool[Math.floor(Math.random() * pool.length)];

        return { spawnEnemy: true, enemyType: pickedType, triggerBoss: false };
      }
    }

    return { spawnEnemy: false, triggerBoss: false };
  }

  public startNextWave() {
    this.currentWaveNumber++;
    this.currentWaveConfig = getWaveConfig(this.currentWaveNumber);
    this.enemiesSpawnedInWave = 0;
    this.enemiesRemainingInWave = this.currentWaveConfig.totalEnemies;
    this.spawnTimer = 0;
    this.isTransitioning = true;
    this.waveTransitionTimer = 2.0; // 2 seconds announcement banner before enemies start
  }
}
