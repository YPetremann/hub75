import React from "react";

export function useRefState<T>(def: T) {
  const [state, _setState] = React.useState<T>(def);
  const ref = React.useRef<T>(state);
  const setState = React.useCallback((updater: T | ((prev: T) => T)) => {
    _setState((prev) => ref.current = typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater
    );
  }, []);
  return [ref, state, setState] as const;
}
