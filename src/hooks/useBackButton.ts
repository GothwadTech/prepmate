import { useEffect, useRef } from 'react';
import { backHandler, BackAction } from '../services/backHandler';

/**
 * Hook to register a back action handler (for modals, sheets, subviews)
 * @param action Function to run when back is pressed.
 * @param isActive Whether the handler is currently active (e.g., when modal isOpen).
 * @param priority Priority score (higher runs first, default 10).
 * @param idPrefix Unique prefix for identifying the registered handler.
 */
export function useBackButton(
  action: BackAction,
  isActive = true,
  priority = 10,
  idPrefix = 'back-action'
) {
  const actionRef = useRef(action);
  actionRef.current = action;

  useEffect(() => {
    if (!isActive) return;

    const id = `${idPrefix}-${Math.random().toString(36).substring(2, 9)}`;
    const unregister = backHandler.register(
      id,
      () => {
        actionRef.current();
      },
      priority
    );

    return () => {
      unregister();
    };
  }, [isActive, priority, idPrefix]);
}
