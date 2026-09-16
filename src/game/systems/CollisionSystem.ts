import { circleCollide, rectCollide } from '../../lib/utils';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { PowerUp } from '../entities/PowerUp';
import { Projectile } from '../types/game';

export interface CollisionResults {
  destroyedEnemyIds: string[];
  hitProjectiles: string[];
  collectedPowerUpIds: string[];
  playerDamaged: boolean;
  bossDamaged: boolean;
  screenShakeIntensity: number;
}

export class CollisionSystem {
  public checkCollisions(
    player: Player,
    enemies: Enemy[],
    boss: Boss | null,
    projectiles: Projectile[],
    powerUps: PowerUp[]
  ): CollisionResults {
    const results: CollisionResults = {
      destroyedEnemyIds: [],
      hitProjectiles: [],
      collectedPowerUpIds: [],
      playerDamaged: false,
      bossDamaged: false,
      screenShakeIntensity: 0,
    };

    const playerLaserIds = new Set<string>();
    const enemyLaserIds = new Set<string>();

    for (const proj of projectiles) {
      if (proj.isPlayer) {
        playerLaserIds.add(proj.id);
      } else {
        enemyLaserIds.add(proj.id);
      }
    }

    // 1. Player Lasers ↔ Enemies
    for (const proj of projectiles) {
      if (!proj.isPlayer || results.hitProjectiles.includes(proj.id)) continue;

      for (const enemy of enemies) {
        if (results.destroyedEnemyIds.includes(enemy.id)) continue;

        if (
          rectCollide(
            proj.x - proj.radius,
            proj.y - proj.radius,
            proj.radius * 2,
            proj.radius * 2,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
          )
        ) {
          results.hitProjectiles.push(proj.id);
          const isDead = enemy.takeDamage(proj.damage);
          if (isDead) {
            results.destroyedEnemyIds.push(enemy.id);
            results.screenShakeIntensity = Math.max(results.screenShakeIntensity, 3);
          }
          break;
        }
      }
    }

    // 2. Player Lasers ↔ Boss
    if (boss && boss.health > 0) {
      for (const proj of projectiles) {
        if (!proj.isPlayer || results.hitProjectiles.includes(proj.id)) continue;

        if (
          rectCollide(
            proj.x - proj.radius,
            proj.y - proj.radius,
            proj.radius * 2,
            proj.radius * 2,
            boss.x,
            boss.y,
            boss.width,
            boss.height
          )
        ) {
          results.hitProjectiles.push(proj.id);
          boss.takeDamage(proj.damage);
          results.bossDamaged = true;
          results.screenShakeIntensity = Math.max(results.screenShakeIntensity, 2);
        }
      }
    }

    // 3. Enemy / Boss Projectiles ↔ Player
    for (const proj of projectiles) {
      if (proj.isPlayer || results.hitProjectiles.includes(proj.id)) continue;

      if (
        rectCollide(
          proj.x - proj.radius,
          proj.y - proj.radius,
          proj.radius * 2,
          proj.radius * 2,
          player.x + 4,
          player.y + 4,
          player.width - 8,
          player.height - 8
        )
      ) {
        results.hitProjectiles.push(proj.id);
        const hitResult = player.takeDamage(proj.damage);
        if (hitResult.damaged) {
          results.playerDamaged = true;
          results.screenShakeIntensity = Math.max(results.screenShakeIntensity, 8);
        }
      }
    }

    // 4. Enemy Ship ↔ Player Ship (Ramming)
    for (const enemy of enemies) {
      if (results.destroyedEnemyIds.includes(enemy.id)) continue;

      if (
        rectCollide(
          player.x + 6,
          player.y + 6,
          player.width - 12,
          player.height - 12,
          enemy.x + 4,
          enemy.y + 4,
          enemy.width - 8,
          enemy.height - 8
        )
      ) {
        const hitResult = player.takeDamage(30);
        if (hitResult.damaged) {
          results.playerDamaged = true;
          results.screenShakeIntensity = Math.max(results.screenShakeIntensity, 12);
        }
        enemy.takeDamage(100);
        if (enemy.health <= 0) {
          results.destroyedEnemyIds.push(enemy.id);
        }
      }
    }

    // 5. Player Ship ↔ Power-Up Items
    for (const pu of powerUps) {
      if (results.collectedPowerUpIds.includes(pu.id)) continue;

      if (
        circleCollide(
          player.x + player.width / 2,
          player.y + player.height / 2,
          player.width / 2,
          pu.x,
          pu.y,
          pu.radius
        )
      ) {
        results.collectedPowerUpIds.push(pu.id);
      }
    }

    return results;
  }
}
