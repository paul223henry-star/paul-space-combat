export class InputSystem {
  private keys: Map<string, boolean> = new Map();
  private justPressedKeys: Set<string> = new Set();
  private onPauseCallback: (() => void) | null = null;
  private onRestartCallback: (() => void) | null = null;
  private attached: boolean = false;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public attach(onPause?: () => void, onRestart?: () => void) {
    if (this.attached || typeof window === 'undefined') return;
    this.onPauseCallback = onPause || null;
    this.onRestartCallback = onRestart || null;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.attached = true;
  }

  public detach() {
    if (!this.attached || typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.keys.clear();
    this.justPressedKeys.clear();
    this.attached = false;
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Prevent default scroll behavior for game navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space'].includes(e.key)) {
      e.preventDefault();
    }

    const key = e.key.toLowerCase();
    if (!this.keys.get(key)) {
      this.justPressedKeys.add(key);
    }
    this.keys.set(key, true);

    // Pause toggle
    if (key === 'p') {
      if (this.onPauseCallback) {
        this.onPauseCallback();
      }
    }

    // Restart trigger
    if (key === 'r') {
      if (this.onRestartCallback) {
        this.onRestartCallback();
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    this.keys.set(key, false);
    this.justPressedKeys.delete(key);
  }

  public isMovingUp(): boolean {
    return !!(this.keys.get('arrowup') || this.keys.get('w'));
  }

  public isMovingDown(): boolean {
    return !!(this.keys.get('arrowdown') || this.keys.get('s'));
  }

  public isMovingLeft(): boolean {
    return !!(this.keys.get('arrowleft') || this.keys.get('a'));
  }

  public isMovingRight(): boolean {
    return !!(this.keys.get('arrowright') || this.keys.get('d'));
  }

  public isShooting(): boolean {
    return !!(this.keys.get(' ') || this.keys.get('space'));
  }

  public isAnyKeyPressed(): boolean {
    for (const [_, val] of this.keys) {
      if (val) return true;
    }
    return false;
  }

  public resetFrame() {
    this.justPressedKeys.clear();
  }
}
