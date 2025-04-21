"use client";
import { calculateDetailedProgress, calculateProgress, DEFAULT_USER, getDetailedProgressFromSession, getProgressFromSession, ProgressKey, ProgressWithPercentage, User, whoYouAre } from "@/types/user";
import { Role } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Award, BookOpen, FileText, Home, User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PentamaLoading } from "../ui/pentama-loading";
import { PartialSiderbarMenuProps, Sidebar, SidebarProvider } from "../ui/pentama-sidebar";

// Loading context type for management loading state
type Loading = {
  isLoading: boolean,
  startLoading: () => void,
  stopLoading: () => void,
  handleNavigate: (path: string, options?: { skipLoading?: boolean }) => void,
};

// UI Renderering context type to manage layout transition
type UIRenderState = {
  isLayoutMounted: boolean;
  layoutType: "authenticated" | "guest";
  isTrasnsitioning: boolean;
}

type UnifiedContextValue = {
  loading: Loading,
  user: User
  ui: UIRenderState
};

// Create unified context
const UnifiedContext = createContext<UnifiedContextValue | undefined>(undefined);

export const useUnified = (): UnifiedContextValue => {
  const context = useContext(UnifiedContext);

  if (context === undefined) {
    throw new Error('useUnified must be used within UnifiedProvider');
  }

  return context;
};

export const UnifiedProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<User["data"]>(null);
  const [isLoading, setIsloading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // UI Render sate to manage layout transition
  const [uiRenderState, setUIRenderState] = useState<UIRenderState>({
    isLayoutMounted: false,
    layoutType: "guest",
    isTrasnsitioning: false
  });

  // Effect to handle layout transition based on authentication status
  useEffect(() => {
    if (status === "loading") {
      setIsloading(true);
      return;
    }
    // Initiate transition when state changes
    setUIRenderState(prev => ({
      ...prev,
      isTrasnsitioning: true
    }));

    // Delay to ensure the transition runs smoothly
    const timer = setTimeout(() => {
      setUIRenderState({
        isLayoutMounted: true,
        layoutType: status === "authenticated" ? "authenticated" : "guest",
        isTrasnsitioning: false
      });
      setIsloading(false);
    }, 500); // transition time

    return () => clearTimeout(timer);

  }, [status, pathname]);

  // Centralized navigation handler
  const handleNavigate = useCallback((path: string, options?: { skipLoading?: boolean }) => {
    if (path === pathname) return; // Don't navigate to current path

    // Start login unless explicity skipped
    if (!options?.skipLoading) {
      setIsloading(true);

      // Start layout transition
      setUIRenderState(prev => ({
        ...prev,
        isTrasnsitioning: true
      }));
    }

    // Use Next.js router for navigation
    router.push(path);

  }, [pathname, router]);

  const loading: Loading = {
    isLoading,
    startLoading: () => setIsloading(true),
    stopLoading: () => setIsloading(false),
    handleNavigate
  }

  const fecthUserData = useCallback(async () => {
    if (session && session.user && Object.values(Role).includes(session.user.role)) {
      try {
        setIsloading(true);

        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Add cache control for more efficient data fetching
          cache: "no-cache"
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const { data } = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data: ", error);
        setUserData(null);
      } finally {
        setIsloading(false);
      }
    }
    return;
  }, [session?.user.progress, session?.user.detailedProgress, session?.user.role]);

  // Load initial data
  useEffect(() => {
    if (status === "authenticated") {
      fecthUserData();
    }
  }, [status, fecthUserData]);

  // Create user object with progress from session
  const user = useMemo<User>(() => {
    if (!session?.user || !Object.values(Role).includes(session.user.role) || !userData) {
      return DEFAULT_USER;
    }

    const userProgress = session.user.progress || calculateProgress(userData, session.user.role);
    const userDetailedProgress = session.user.detailedProgress || calculateDetailedProgress(userData, session.user.role);

    if (whoYouAre(userData) === "unknown") return DEFAULT_USER;

    return {
      type: whoYouAre(userData),
      data: userData,
      progress: userProgress,
      detailedProgress: userDetailedProgress
    } as User
  }, [session?.user, userData]);

  
  // Memoize context value untuk performa
  const contextValue = useMemo<UnifiedContextValue>(() => ({
    user,
    loading,
    ui: uiRenderState
  }), [user, loading, uiRenderState]);
  
  // Determine if a feature should be enabled based on both progress systems
  const isFeatureEnabled = useCallback((booleanValue: boolean, percentageValue: number): boolean => {
    // Feature is enabled if the legacy boolean is true OR the percentage is 100%
    return booleanValue || percentageValue >= 100;
  }, []);

  // Sidebar menu deith role-based options
  const sidebarMenu = useMemo<PartialSiderbarMenuProps[]>(() => {
    if (status !== "authenticated" || !session?.user.progress) {
      return [];
    }

    // Get both progress systems
    const progress = getProgressFromSession(session);
    const detailedProgress = getDetailedProgressFromSession(session);

    return [
      {
        label: "Dashboard",
        icon: <Home />,
        path: "/",
        disabled: !isFeatureEnabled(progress.completeProfile, detailedProgress[ProgressKey.CompleteProfile].percentage)
      },
      {
        label: "Profile",
        icon: <UserIcon />,
        path: "/profile",
      },
      {
        label: "Proposal",
        icon: <FileText />,
        path: "/proposal",
        disabled: !isFeatureEnabled(progress.completeProfile, detailedProgress[ProgressKey.CompleteProfile].percentage)
      },
      {
        label: "Result",
        icon: <BookOpen />,
        path: "/result",
        disabled: !isFeatureEnabled(progress.canAccessResult, detailedProgress[ProgressKey.CanAccessResult].percentage)
      },
      {
        label: "Final",
        icon: <Award />,
        path: "/final",
        disabled: !isFeatureEnabled(progress.canAccessFinal, detailedProgress[ProgressKey.CanAccessFinal].percentage)
      }
    ];
  }, [session?.user.progress, session?.user.detailedProgress, isFeatureEnabled]);

  return (
    <UnifiedContext.Provider value={contextValue}>
      <PentamaLoading />
      <AnimatePresence mode="wait">
        {uiRenderState.layoutType === "authenticated" ? (
          <motion.div
            key="authenticated-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => {
              // Reset transition state
              if (uiRenderState.isTrasnsitioning) {
                setUIRenderState(prev => ({
                  ...prev,
                  isTrasnsitioning: false
                }));
              }
            }}
          >
            <SidebarProvider>
              <Sidebar
                sidebarMenu={sidebarMenu}
                sidebarInfo={{
                  name: contextValue.user.data?.name ?? "",
                  role: contextValue.user.data?.role ?? "",
                  avatarUrl: contextValue.user.data?.avatarUrl ?? ""
                }}
              >
                {!uiRenderState.isTrasnsitioning && children}
              </Sidebar>
            </SidebarProvider>
          </motion.div>
        ) : (
          <motion.div
            key="guest-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => {
              if (uiRenderState.isTrasnsitioning) {
                setUIRenderState(prev => ({
                  ...prev,
                  isTrasnsitioning: false
                }))
              }
            }}
          >
            {!uiRenderState.isTrasnsitioning && children}
          </motion.div>
        )}
      </AnimatePresence>
    </UnifiedContext.Provider>
  );
};

// Halper hook for access loading context only
export const useLoading = (): Loading => {
  return useUnified().loading;
};

// Halper hook for accessing navigation function dirctly
export const useNavigation = () => {
  const { loading } = useUnified();
  return loading.handleNavigate;
}

// Helper hook for accessing user information
export const useUser = (): User => {
  return useUnified().user;
}

// Helper hook for accessing detailed progress
export const useDetailedProgress = (): ProgressWithPercentage => {
  return useUnified().user.detailedProgress;
}





// "use client";
// import { usePathname } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";

// interface Loading {
//   isLoading: boolean,
//   startLoading: () => void,
//   stopLoading: () => void
// };

// interface UnifiedContextValue{
//   loading: Loading,
// };

// // Create unified context
// const UnifiedContext = createContext<UnifiedContextValue | undefined>(undefined);

// export const useUnified = (): UnifiedContextValue => {
//   const context = useContext(UnifiedContext);

//   if (context === undefined) {
//     throw new Error('useUnified must be used within UnifiedProvider');
//   }

//   return context;
// };

// export const UnifiedProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoading, setIsloading]  = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     setIsloading(false);
//   }, [pathname]);

//   const loading: Loading = {
//     isLoading,
//     startLoading: () => setIsloading(true),
//     stopLoading: () => setIsloading(false)
//   }

//   const contextValue: UnifiedContextValue = {
//     loading
//   }

//   return (
//     <UnifiedContext.Provider value={contextValue}>
//       {children}
//     </UnifiedContext.Provider>
//   );
// };

// // Halper hook for access loading context only
// export const useLoading = (): Loading => {
//   return useUnified().loading;
// };