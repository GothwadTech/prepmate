/**
 * Global Hardware & Browser Back Button Handler for Prepmate
 * Traps popstate and manages a stack of dismiss/navigation actions so that
 * pressing the Android hardware back button or browser back does NOT exit the app unexpectedly.
 */

export type BackAction = () => boolean | void;

interface RegisteredAction {
  id: string;
  priority: number; // Higher number = executed first
  action: BackAction;
}

class BackHandlerManager {
  private actions: RegisteredAction[] = [];
  private lastBackPressTime = 0;
  private isInitialized = false;
  private showToastCallback: ((message: string) => void) | null = null;

  public init(showToast?: (message: string) => void) {
    if (this.isInitialized) {
      if (showToast) this.showToastCallback = showToast;
      return;
    }
    this.isInitialized = true;
    if (showToast) this.showToastCallback = showToast;

    // Seed the browser history so popstate always has a state to pop from
    try {
      if (!window.history.state || !window.history.state.prepmateTrap) {
        window.history.replaceState({ prepmateRoot: true }, '');
        window.history.pushState({ prepmateTrap: true }, '');
      }
    } catch {
      // Ignore if running in constrained context
    }

    window.addEventListener('popstate', this.handlePopState);
  }

  public setShowToast(fn: (message: string) => void) {
    this.showToastCallback = fn;
  }

  public register(id: string, action: BackAction, priority = 10): () => void {
    // Remove if already registered with same id
    this.actions = this.actions.filter((a) => a.id !== id);
    this.actions.push({ id, action, priority });
    // Sort descending: highest priority first
    this.actions.sort((a, b) => b.priority - a.priority);

    return () => {
      this.unregister(id);
    };
  }

  public unregister(id: string) {
    this.actions = this.actions.filter((a) => a.id !== id);
  }

  private handlePopState = () => {
    // Immediately replenish the trap so future back presses are caught
    try {
      window.history.pushState({ prepmateTrap: true }, '');
    } catch {
      // Ignore
    }

    // If any custom action (modal, subview, tab) is active, execute the top one
    if (this.actions.length > 0) {
      const top = this.actions[0];
      top.action();
      return;
    }

    // When at root (Home tab or Login screen with no modals open):
    const now = Date.now();
    if (now - this.lastBackPressTime < 2000) {
      // Double tap detected: allow graceful exit from app
      window.removeEventListener('popstate', this.handlePopState);
      window.history.go(-2);
    } else {
      this.lastBackPressTime = now;
      if (this.showToastCallback) {
        this.showToastCallback('Press back again to exit Prepmate');
      }
    }
  };
}

export const backHandler = new BackHandlerManager();
