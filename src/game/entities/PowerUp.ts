import { POWER_UP_CONFIGS } from '../config/powerups';
import { GAME_CONFIG } from '../config/gameConfig';
import { PowerUpEntity, PowerUpType } from '../types/game';

export class PowerUp implements PowerUpEntity {
  public id: string;
  public type: PowerUpType;
  public x: number;
  public y: number;
  public radius: number = 16;
  public vx: number = 0;
  public vy: number = 75; // gentle float downward
  public duration: number;
  public color: string;
  public symbol: string;
  public age: number = 0;

  constructor(type: PowerUpType, x: number, y: number) {
    const config = POWER_UP_CONFIGS[type];
    this.id = `pu_${Date.now()}_${Math.random()}`;
    this.type = type;
    this.x = x;
    this.y = y;
    this.duration = config.duration;
    this.color = config.color;
    this.symbol = config.symbol;
    this.vx = (Math.random() - 0.5) * 30;
  }

  public update(dt: number) {
    this.age += dt;
    this.y += this.vy * dt;
    this.x += Math.sin(this.age * 3) * 25 * dt + this.vx * dt;
  }

  public isOutOfBounds(): boolean {
    return this.y > GAME_CONFIG.WORLD_HEIGHT + 30;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;

    // Glowing outer ring
    const pulse = Math.sin(this.age * 5) * 3;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Dark semi-transparent pill base
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Symbol text in center
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(this.symbol, this.x, this.y + 1);

    ctx.restore();
  }
}
