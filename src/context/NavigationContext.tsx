import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
} from 'react';
import { AppTab } from '../types';
import { useAuth } from './AuthContext';

export interface BackHandlerItem {
  id: string;
  priority: number;
  handleBack: () => boolean | void;
}

export interface NavigationContextType {
  activeTab: AppTab;
  tabHistory: AppTab[];
  legalScreen: 'terms' | 'privacy' | null;
  authScreen: 'login' | 'signup' | 'verification';
  pendingAuthData: { email: string; password?: string };
  navigateToTab: (tab: AppTab) => void;
  navigateBack: () => void;
  openLegalScreen: (screen: 'terms' | 'privacy') => void;
  closeLegalScreen: () => void;
  setAuthScreen: (screen: 'login' | 'signup' | 'verification') => void;
  setPendingAuthData: React.Dispatch<React.SetStateAction<{ email: string; password?: string }>>;
  registerBackHandler: (id: string, handler: () => boolean | void, priority?: number) => () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, showToast } = useAuth();

  const [activeTab, setActiveTabState] = useState<AppTab>('home');
  const [tabHistory, setTabHistory] = useState<AppTab[]>(['home']);
  const [legalScreen, setLegalScreen] = useState<'terms' | 'privacy' | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'verification'>('login');
  const [pendingAuthData, setPendingAuthData] = useState<{ email: string; password?: string }>({
    email: '',
    password: '',
  });

  const backHandlersRef = useRef<BackHandlerItem[]>([]);
  const tabHistoryRef = useRef<AppTab[]>(['home']);
  const lastExitPressRef = useRef<number>(0);
  const isNavigatingRef = useRef<boolean>(false);

  // Keep ref synchronized with state for event listeners
  const stateRef = useRef({
    activeTab,
    tabHistory,
    legalScreen,
    authScreen,
    user,
  });

  useEffect(() => {
    stateRef.current = {
      activeTab,
      tabHistory,
      legalScreen,
      authScreen,
      user,
    };
    tabHistoryRef.current = tabHistory;
  }, [activeTab, tabHistory, legalScreen, authScreen, user]);

  // Register a back-press handler (e.g. for modals or sub-views)
  const registerBackHandler = useCallback(
    (id: string, handler: () => boolean | void, priority: number = 100) => {
      backHandlersRef.current = [
        ...backHandlersRef.current.filter((item) => item.id !== id),
        { id, priority, handleBack: handler },
      ].sort((a, b) => b.priority - a.priority);

      return () => {
        backHandlersRef.current = backHandlersRef.current.filter((item) => item.id !== id);
      };
    },
    []
  );

  // Navigate to a new tab and update virtual tab history stack
  const navigateToTab = useCallback((tab: AppTab) => {
    setActiveTabState((currentTab) => {
      if (currentTab === tab) return currentTab;

      setTabHistory((prev) => {
        if (tab === 'home') {
          // Returning to home resets tab history stack to start destination
          return ['home'];
        }
        // Keep unique ordered history stack
        const filtered = prev.filter((t) => t !== tab);
        return [...filtered, tab];
      });

      return tab;
    });
  }, []);

  const openLegalScreen = useCallback((screen: 'terms' | 'privacy') => {
    setLegalScreen(screen);
  }, []);

  const closeLegalScreen = useCallback(() => {
    setLegalScreen(null);
  }, []);

  // Pop the previous tab from history stack
  const popPreviousTab = useCallback((): AppTab => {
    const history = tabHistoryRef.current;
    if (history.length <= 1) {
      setTabHistory(['home']);
      setActiveTabState('home');
      return 'home';
    }

    const next = [...history];
    next.pop(); // Remove current tab
    const prevTab = next[next.length - 1] || 'home';
    setTabHistory(next);
    setActiveTabState(prevTab);
    return prevTab;
  }, []);

  // Universal back resolution logic
  const resolveBackAction = useCallback((): boolean => {
    // 1. Check registered modal / overlay handlers (highest priority first)
    const handlers = [...backHandlersRef.current];
    for (const item of handlers) {
      try {
        const handled = item.handleBack();
        // If handler didn't explicitly return false, consider it successfully handled
        if (handled !== false) {
          return true;
        }
      } catch (err) {
        console.error(`Error in back handler ${item.id}:`, err);
      }
    }

    const currentState = stateRef.current;

    // 2. Legal screen open
    if (currentState.legalScreen !== null) {
      setLegalScreen(null);
      return true;
    }

    // 3. Unauthenticated auth flow navigation
    if (!currentState.user) {
      if (currentState.authScreen === 'signup' || currentState.authScreen === 'verification') {
        setAuthScreen('login');
        return true;
      }
      // On login screen without sub-screens
      return false;
    }

    // 4. Authenticated Sub-Pages and Tabs
    if (currentState.activeTab === 'analytics') {
      popPreviousTab();
      return true;
    }

    if (currentState.activeTab === 'profile') {
      popPreviousTab();
      return true;
    }

    if (currentState.activeTab !== 'home') {
      popPreviousTab();
      return true;
    }

    // 5. Root reached (User is on Home tab with no open modals or subpages)
    return false;
  }, [popPreviousTab]);

  // Programmatic back trigger (can be called by any in-app Back button)
  const navigateBack = useCallback(() => {
    resolveBackAction();
  }, [resolveBackAction]);

  // Setup history buffer & popstate listener for Android hardware back & browser back
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize browser history entry so popstate fires when user presses back
    try {
      const state = window.history.state;
      if (!state || !state.__prepmate__) {
        window.history.replaceState({ __prepmate__: true, depth: 0, tag: 'root' }, '');
        window.history.pushState({ __prepmate__: true, depth: 1, tag: 'app' }, '');
      }
    } catch (e) {
      console.warn('Unable to initialize history buffer:', e);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      const handled = resolveBackAction();

      if (handled) {
        // We successfully handled the back action inside the app!
        // Immediately re-push the buffer state so the NEXT back press will also be caught
        try {
          window.history.pushState({ __prepmate__: true, depth: 1, tag: 'app' }, '');
        } catch (e) {
          console.warn('Unable to push history buffer:', e);
        }
      } else {
        // User is at root ('home' tab or 'login' screen, with no modals or subpages)
        const now = Date.now();
        const diff = now - lastExitPressRef.current;

        if (diff < 2000) {
          // Double-back detected within 2 seconds: Allow real exit from app!
          // We let the native back action execute
          lastExitPressRef.current = 0;
          try {
            window.history.back();
          } catch {
            // Native back
          }
        } else {
          // First press at root: Show friendly toast and re-push buffer
          lastExitPressRef.current = now;
          showToast('Press back again to exit Prepmate', 'info');

          try {
            window.history.pushState({ __prepmate__: true, depth: 1, tag: 'app' }, '');
          } catch (e) {
            console.warn('Unable to push history buffer:', e);
          }
        }
      }

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 50);
    };

    // Keyboard Escape key support for desktop back navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const handled = resolveBackAction();
        if (handled) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resolveBackAction, showToast]);

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
        tabHistory,
        legalScreen,
        authScreen,
        pendingAuthData,
        navigateToTab,
        navigateBack,
        openLegalScreen,
        closeLegalScreen,
        setAuthScreen,
        setPendingAuthData,
        registerBackHandler,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

/**
 * Custom hook to register a back-press handler whenever a modal/dialog/sheet is open.
 * When the user taps the device back button, this handler is called first.
 */
export function useBackHandler(
  isActive: boolean,
  handler: () => boolean | void,
  priority: number = 100,
  id?: string
) {
  const { registerBackHandler } = useNavigation();
  const autoId = useId();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!isActive) return;
    const finalId = id || autoId;
    const cleanup = registerBackHandler(finalId, () => handlerRef.current(), priority);
    return cleanup;
  }, [isActive, priority, id, autoId, registerBackHandler]);
}
