export class GameLoop {
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private updateFn: (dt: number, now: number) => void;

  constructor(updateFn: (dt: number, now: number) => void) {
    this.updateFn = updateFn;
    this.loop = this.loop.bind(this);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop(now: number) {
    if (!this.isRunning) return;

    // Delta time in seconds, clamped to max 0.1s to avoid jumps when switching tabs
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.updateFn(dt, now);

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}
