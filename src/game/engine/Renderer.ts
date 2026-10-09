import { GAME_CONFIG } from '../config/gameConfig';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { Projectile, Star } from '../types/game';
import { PowerUp } from '../entities/PowerUp';
import { Particle } from '../entities/Particle';
import { randomRange } from '../../lib/utils';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private shakeTime: number = 0;
  private shakeIntensity: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initStarfield();
  }

  private initStarfield() {
    this.stars = [];
    for (let i = 0; i < GAME_CONFIG.PARTICLES.STAR_COUNT; i++) {
      const layer = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
      this.stars.push({
        x: Math.random() * GAME_CONFIG.WORLD_WIDTH,
        y: Math.random() * GAME_CONFIG.WORLD_HEIGHT,
        radius: layer === 1 ? 0.8 : layer === 2 ? 1.4 : 2.2,
        speed: layer === 1 ? 25 : layer === 2 ? 65 : 120,
        alpha: layer === 1 ? 0.35 : layer === 2 ? 0.65 : 0.95,
        layer,
      });
    }
  }

  public triggerScreenShake(intensity: number, duration: number = 0.25) {
    this.shakeIntensity = intensity;
    this.shakeTime = duration;
  }

  public update(dt: number) {
    // Update starfield positions (parallax downward scroll)
    for (const star of this.stars) {
      star.y += star.speed * dt;
      if (star.y > GAME_CONFIG.WORLD_HEIGHT) {
        star.y = 0;
        star.x = Math.random() * GAME_CONFIG.WORLD_WIDTH;
      }
    }

    // Update screen shake
    if (this.shakeTime > 0) {
      this.shakeTime = Math.max(0, this.shakeTime - dt);
      if (this.shakeTime === 0) {
        this.shakeIntensity = 0;
      }
    }
  }

  public render(
    scale: number,
    offsetX: number,
    offsetY: number,
    player: Player,
    enemies: Enemy[],
    boss: Boss | null,
    projectiles: Projectile[],
    powerUps: PowerUp[],
    particles: Particle[],
    announcement?: { title: string; subtitle?: string; alpha: number }
  ) {
    const ctx = this.ctx;
    const canvas = ctx.canvas;

    // Clear full physical canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#030712'; // Deep space black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.save();

    // Responsive coordinate transformation
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Apply Screen Shake
    if (this.shakeTime > 0 && this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity;
      const sy = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(sx, sy);
    }

    // Clip to virtual arena boundaries
    ctx.beginPath();
    ctx.rect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
    ctx.clip();

    // 1. Nebula Cosmic Glows
    const bgGrad = ctx.createRadialGradient(
      GAME_CONFIG.WORLD_WIDTH / 2,
      GAME_CONFIG.WORLD_HEIGHT / 3,
      50,
      GAME_CONFIG.WORLD_WIDTH / 2,
      GAME_CONFIG.WORLD_HEIGHT / 2,
      500
    );
    bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    bgGrad.addColorStop(0.5, 'rgba(11, 17, 32, 0.98)');
    bgGrad.addColorStop(1, '#030712');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);

    // Nebula cloud accent
    const nebGrad = ctx.createRadialGradient(
      GAME_CONFIG.WORLD_WIDTH * 0.75,
      GAME_CONFIG.WORLD_HEIGHT * 0.4,
      10,
      GAME_CONFIG.WORLD_WIDTH * 0.75,
      GAME_CONFIG.WORLD_HEIGHT * 0.4,
      280
    );
    nebGrad.addColorStop(0, 'rgba(30, 58, 138, 0.22)');
    nebGrad.addColorStop(0.6, 'rgba(88, 28, 135, 0.12)');
    nebGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);

    // 2. Parallax Starfield
    for (const star of this.stars) {
      ctx.fillStyle = star.layer === 3 ? '#93c5fd' : '#ffffff';
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Render Particles (Engine trails, debris)
    for (const particle of particles) {
      particle.draw(ctx);
    }

    // 4. Render Power-Up Items
    for (const powerUp of powerUps) {
      powerUp.draw(ctx);
    }

    // 5. Render Projectiles (Player lasers and Enemy plasma)
    for (const proj of projectiles) {
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = proj.glowColor;
      ctx.fillStyle = proj.color;

      if (proj.isPlayer) {
        // Sleek elongated energy bolt
        ctx.beginPath();
        ctx.roundRect(proj.x - proj.radius, proj.y - 10, proj.radius * 2, 20, proj.radius);
        ctx.fill();
      } else {
        // Glowing round plasma sphere
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 6. Render Enemies
    for (const enemy of enemies) {
      enemy.draw(ctx);
    }

    // 7. Render Boss
    if (boss) {
      boss.draw(ctx);
    }

    // 8. Render Player
    if (player.health > 0) {
      player.draw(ctx);
    }

    // 9. Announcement Banner (Wave / Boss Alert)
    if (announcement && announcement.alpha > 0) {
      ctx.save();
      ctx.globalAlpha = announcement.alpha;

      // Banner background
      ctx.fillStyle = 'rgba(3, 7, 18, 0.75)';
      ctx.fillRect(0, GAME_CONFIG.WORLD_HEIGHT / 2 - 60, GAME_CONFIG.WORLD_WIDTH, 120);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GAME_CONFIG.WORLD_HEIGHT / 2 - 60);
      ctx.lineTo(GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT / 2 - 60);
      ctx.moveTo(0, GAME_CONFIG.WORLD_HEIGHT / 2 + 60);
      ctx.lineTo(GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT / 2 + 60);
      ctx.stroke();

      // Title
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#67e8f9';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillText(announcement.title, GAME_CONFIG.WORLD_WIDTH / 2, GAME_CONFIG.WORLD_HEIGHT / 2 - 8);

      // Subtitle
      if (announcement.subtitle) {
        ctx.font = '16px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.shadowBlur = 0;
        ctx.fillText(announcement.subtitle, GAME_CONFIG.WORLD_WIDTH / 2, GAME_CONFIG.WORLD_HEIGHT / 2 + 25);
      }

      ctx.restore();
    }

    // Virtual Arena Border Frame (Cyberpunk glowing border)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, GAME_CONFIG.WORLD_WIDTH - 2, GAME_CONFIG.WORLD_HEIGHT - 2);

    ctx.restore();
  }
}
