import { create } from "zustand";

interface LoadingState {
  // Global loading states
  isGlobalLoading: boolean;
  globalLoadingMessage: string;

  // Route-specific loading states
  routeLoading: Map<string, boolean>;

  // Component-specific loading states
  componentLoading: Map<string, boolean>;

  // Navigation state
  isNavigating: boolean;
  navigationProgress: number;

  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setRouteLoading: (route: string, loading: boolean) => void;
  setComponentLoading: (component: string, loading: boolean) => void;
  setNavigating: (navigating: boolean, progress?: number) => void;
  clearAllLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  // Initial state
  isGlobalLoading: false,
  globalLoadingMessage: "",
  routeLoading: new Map(),
  componentLoading: new Map(),
  isNavigating: false,
  navigationProgress: 0,

  // Actions
  setGlobalLoading: (loading: boolean, message = "") =>
    set({ isGlobalLoading: loading, globalLoadingMessage: message }),

  setRouteLoading: (route: string, loading: boolean) =>
    set((state) => {
      const newRouteLoading = new Map(state.routeLoading);
      if (loading) {
        newRouteLoading.set(route, true);
      } else {
        newRouteLoading.delete(route);
      }
      return { routeLoading: newRouteLoading };
    }),

  setComponentLoading: (component: string, loading: boolean) =>
    set((state) => {
      const newComponentLoading = new Map(state.componentLoading);
      if (loading) {
        newComponentLoading.set(component, true);
      } else {
        newComponentLoading.delete(component);
      }
      return { componentLoading: newComponentLoading };
    }),

  setNavigating: (navigating: boolean, progress = 0) =>
    set({ isNavigating: navigating, navigationProgress: progress }),

  clearAllLoading: () =>
    set({
      isGlobalLoading: false,
      globalLoadingMessage: "",
      routeLoading: new Map(),
      componentLoading: new Map(),
      isNavigating: false,
      navigationProgress: 0,
    }),
}));

// Utility hooks for specific loading states
export const useGlobalLoading = () => {
  const { isGlobalLoading, globalLoadingMessage, setGlobalLoading } =
    useLoadingStore();
  return { isGlobalLoading, globalLoadingMessage, setGlobalLoading };
};

export const useRouteLoading = (route: string) => {
  const { routeLoading, setRouteLoading } = useLoadingStore();
  const isLoading = routeLoading.get(route) || false;

  return {
    isLoading,
    setLoading: (loading: boolean) => setRouteLoading(route, loading),
  };
};

export const useComponentLoading = (component: string) => {
  const { componentLoading, setComponentLoading } = useLoadingStore();
  const isLoading = componentLoading.get(component) || false;

  return {
    isLoading,
    setLoading: (loading: boolean) => setComponentLoading(component, loading),
  };
};

export const useNavigationLoading = () => {
  const { isNavigating, navigationProgress, setNavigating } = useLoadingStore();
  return { isNavigating, navigationProgress, setNavigating };
};
