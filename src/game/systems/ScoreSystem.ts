import { GAME_CONFIG } from '../config/gameConfig';

export class ScoreSystem {
  public score: number = 0;
  public combo: number = 1;
  public comboTimer: number = 0;
  public maxComboTimer: number = GAME_CONFIG.SCORE.COMBO_TIMEOUT;
  public enemiesDestroyed: number = 0;

  public reset() {
    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.enemiesDestroyed = 0;
  }

  public update(dt: number) {
    if (this.combo > 1) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        // Combo expired
        this.combo = 1;
        this.comboTimer = 0;
      }
    }
  }

  public registerKill(basePoints: number, hasScoreBoost: boolean = false): { pointsAdded: number; combo: number } {
    this.enemiesDestroyed++;
    this.combo = Math.min(GAME_CONFIG.SCORE.COMBO_MULTIPLIER_MAX, this.combo + 1);
    this.comboTimer = this.maxComboTimer;

    const multiplier = hasScoreBoost ? this.combo * 2 : this.combo;
    const pointsAdded = basePoints * multiplier;
    this.score += pointsAdded;

    return { pointsAdded, combo: this.combo };
  }

  public getComboProgress(): number {
    if (this.combo <= 1 || this.maxComboTimer === 0) return 0;
    return Math.max(0, this.comboTimer / this.maxComboTimer);
  }
}
