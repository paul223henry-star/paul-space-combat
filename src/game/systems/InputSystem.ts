
export class InputSystem {
  private keys: Map<string, boolean> = new Map();
  private justPressedKeys: Set<string> = new Set();
  private onPauseCallback: (() => void) | null = null;
  private onRestartCallback: (() => void) | null = null;
  private attached = false;

  // Mobile touch controls
  private touchUp = false;
  private touchDown = false;
  private touchLeft = false;
  private touchRight = false;
  private touchShooting = false;
  private touchTargetX: number | null = null;
  private touchTargetY: number | null = null;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public attach(onPause?: () => void, onRestart?: () => void) {
    if (this.attached || typeof window === 'undefined') return;

    this.onPauseCallback = onPause || null;
    this.onRestartCallback = onRestart || null;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('visibilitychange', this.handleBlur);

    this.attached = true;
  }

  public detach() {
    if (!this.attached || typeof window === 'undefined') return;

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('visibilitychange', this.handleBlur);

    this.keys.clear();
    this.justPressedKeys.clear();
    this.clearTouchControls();
    this.attached = false;
  }

  private handleBlur() {
    this.keys.clear();
    this.justPressedKeys.clear();
    this.clearTouchControls();
  }

  public clearTouchControls() {
    this.touchUp = false;
    this.touchDown = false;
    this.touchLeft = false;
    this.touchRight = false;
    this.touchShooting = false;
    this.clearTouchTarget();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space'].includes(e.key) ||
      e.code === 'Space'
    ) {
      e.preventDefault();
    }

    const key = e.key.toLowerCase();

    if (!this.keys.get(key)) {
      this.justPressedKeys.add(key);
    }

    this.keys.set(key, true);

    if (e.code === 'Space') {
      this.keys.set('space', true);
    }

    if (key === 'p' || key === 'escape') {
      this.onPauseCallback?.();
    }

    if (key === 'r') {
      this.onRestartCallback?.();
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase();

    this.keys.set(key, false);

    if (e.code === 'Space') {
      this.keys.set('space', false);
    }

    this.justPressedKeys.delete(key);
  }

  // These methods will be called by the mobile controls UI.
  public setTouchMovement(
    direction: 'up' | 'down' | 'left' | 'right',
    pressed: boolean
  ) {
    switch (direction) {
      case 'up':
        this.touchUp = pressed;
        break;
      case 'down':
        this.touchDown = pressed;
        break;
      case 'left':
        this.touchLeft = pressed;
        break;
      case 'right':
        this.touchRight = pressed;
        break;
    }
  }

  public setTouchShooting(pressed: boolean) {
    this.touchShooting = pressed;
  }

  public triggerPause() {
    this.onPauseCallback?.();
  }

  public triggerRestart() {
    this.onRestartCallback?.();
  }

  public isMovingUp(): boolean {
    return this.touchUp || !!(this.keys.get('arrowup') || this.keys.get('w'));
  }

  public isMovingDown(): boolean {
    return this.touchDown || !!(this.keys.get('arrowdown') || this.keys.get('s'));
  }

  public isMovingLeft(): boolean {
    return this.touchLeft || !!(this.keys.get('arrowleft') || this.keys.get('a'));
  }

  public isMovingRight(): boolean {
    return this.touchRight || !!(this.keys.get('arrowright') || this.keys.get('d'));
  }

  public isShooting(): boolean {
    return this.touchShooting || !!(this.keys.get(' ') || this.keys.get('space'));
  }

  public isAnyKeyPressed(): boolean {
    for (const value of this.keys.values()) {
      if (value) return true;
    }

    return (
      this.touchUp ||
      this.touchDown ||
      this.touchLeft ||
      this.touchRight ||
      this.touchShooting ||
      this.touchTargetX !== null
    );
  }

  public resetFrame() {
    this.justPressedKeys.clear();
  }

  public setTouchTarget(x: number, y: number) {
    this.touchTargetX = x;
    this.touchTargetY = y;
  }

  public clearTouchTarget() {
    this.touchTargetX = null;
    this.touchTargetY = null;
  }

  public getTouchTarget(): { x: number; y: number } | null {
    if (this.touchTargetX === null || this.touchTargetY === null) {
      return null;
    }

    return {
      x: this.touchTargetX,
      y: this.touchTargetY,
    };
  }
}
