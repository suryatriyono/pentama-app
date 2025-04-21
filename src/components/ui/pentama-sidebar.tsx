"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronRight, Lock, LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLoading } from "../contexts/UnifiedContext";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { PentamaLogoWithParticles } from "./pentama-logo";


const SIDEBAR_COOKIE_NAME = "pentama_sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  openChange: setOpenProp,
  children
}: {
  defaultOpen?: boolean;
  open?: boolean;
  openChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [open, setOpenProp]
  );

  // Halper to toggle the sidebar
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpenMobile, setOpen]);

  // Adds a keyboard shortcut to toggle the sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(() => (
    {
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );

}


export type PartialSiderbarMenuProps = Pick<SidebarMenuProps, "icon" | "label" | "disabled"> & { path: string };

type SidebarProps = {
  children: React.ReactNode;
  sidebarMenu: PartialSiderbarMenuProps[];
  sidebarInfo: Record<"role" | "name" | "avatarUrl", string>;
}
export function Sidebar({ children, sidebarMenu, sidebarInfo }: SidebarProps) {
  const { isMobile, openMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { startLoading } = useLoading();
  const handleLogout = async () => {
    try {
      startLoading();
      await signOut({
        callbackUrl: "/login"
      })
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  // Animasi untuk konten
  const pageVariants: Variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Animasi untuk skeleton loader
  const skeletonVariants: Variants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: 0.8,
      transition: { repeat: Infinity, repeatType: "reverse", duration: 0.8 }
    }
  };

  // Variasi untuk sidebar mobile
  const sidebarVariants: Variants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Variasi untuk overlay
  const overlayVariants: Variants = {
    open: {
      opacity: 1,
      display: "block"
    },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: "none"
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-b/oklch from-black to-purple-950">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-indigo-900/10">
        <div className="flex items-center gap-2.5">
          <Button className="hover:text-indigo-600 text-indigo-50 " variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="size-5" />
          </Button>
          <PentamaLogoWithParticles />
        </div>
        <Avatar className="h-8 w-8 bg-indigo-100/10">
          <AvatarImage src={sidebarInfo.avatarUrl ?? "/images/out.png"} alt={"avatar-sidebar"} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {sidebarInfo.name ?? "Unknown"}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Main Content Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Overlay for mobile when sidebar is open */}
        <AnimatePresence>
          {openMobile && (
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setOpenMobile(false)}
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
            />
          )}
        </AnimatePresence>

        <AnimatePresence >
          {openMobile && (
            <motion.div
              className="fixed top-0 left-0 w-[270px] h-full bg-linear-to-tl/oklch from-black to-purple-950 px-2.5 py-0.5 border-r border-border shadow-lg z-30 overflow-hidden  md:hidden"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Sidebar Header */}
              <div className="flex items-center sticky top-0 ">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center size-14 grow"
                >
                  <div className="font-bold text-2xl text-white">
                    <PentamaLogoWithParticles />
                  </div>
                </motion.div>
                <Button
                  className="text-white bg-primary/10 flex-none hover:text-purple-950"
                  variant="ghost" size="icon"
                  onClick={() => setOpenMobile(false)}
                >
                  <X />
                </Button>

              </div>
              {/* Sidebar Content */}
              <SidebarContent
                menuItems={sidebarMenu}
                info={sidebarInfo}
              />
              {/* Sidebar Footer */}
              <div className="sticky w-full p-6 bottom-0">
                <Button
                  variant="outline"
                  className="w-full bg-linear-to-tl/oklch text-white from-black to-purple-950 justify-start cursor-pointer hover:text-destructive hover:border-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </motion.div>
          )}
          {!isMobile && (
            <div className="flex-none w-2xs hidden md:block z-30 shadow-md shadow-purple-600">
              {/* Sidebar Header */}
              <div className="flex items-center sticky top-0">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center size-14 grow"
                >
                  <div className="font-bold text-2xl text-white px-2.5">
                    <PentamaLogoWithParticles />
                  </div>
                </motion.div>
              </div>
              {/* Sidebar Content */}
              <SidebarContent
                menuItems={sidebarMenu}
                info={sidebarInfo}
              />
              {/* Sidebar Footer */}
              <div className="sticky w-full p-6 bottom-0">
                <Button
                  variant="outline"
                  className="w-full bg-linear-to-tl/oklch text-white from-black to-purple-950 justify-start cursor-pointer hover:text-destructive hover:border-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>
        {/* Main Content */}
        <div className="scrollbar-hidden flex-1 overflow-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )

  // if (isMobile) {
  //   return (
  //     <div className="flex flex-col h-screen bg-linear-to-b/oklch from-black to-purple-950">
  //       {/* Mobile Header */}
  //       <div className="md:hidden flex items-center justify-between p-4 bg-indigo-900/10">
  //         <div className="flex items-center gap-2.5">
  //           <Button className="hover:text-indigo-600 text-indigo-50 " variant="ghost" size="icon" onClick={toggleSidebar}>
  //             <Menu className="size-5" />
  //           </Button>
  //           <PentamaLogoWithParticles />
  //         </div>
  //         <Avatar className="h-8 w-8 bg-indigo-100/10">
  //           <AvatarImage src={"/images/out.png"} alt={"avatar-sidebar"} />
  //           <AvatarFallback className="bg-primary text-primary-foreground">
  //             Supreme
  //           </AvatarFallback>
  //         </Avatar>
  //       </div>
  //       {/* Main Content Container */}
  //       <div className="flex flex-1 overflow-hidden">
  //         {/* Overlay for mobile when sidebar is open */}
  //         <AnimatePresence>
  //           {openMobile && (
  //             <motion.div
  //               variants={overlayVariants}
  //               initial="closed"
  //               animate="open"
  //               exit="closed"
  //               onClick={() => setOpenMobile(false)}
  //               className="fixed inset-0 bg-black/50 z-20 md:hidden"
  //             />
  //           )}
  //         </AnimatePresence>

  //         <AnimatePresence >
  //           {openMobile && (
  //             <motion.div
  //               className="fixed top-0 left-0 w-[270px] h-full bg-linear-to-tl/oklch from-black to-purple-950 px-2.5 py-0.5 border-r border-border shadow-lg z-30 overflow-hidden  md:hidden"
  //               variants={sidebarVariants}
  //               initial="closed"
  //               animate="open"
  //               exit="closed"
  //             >
  //               {/* Sidebar Header */}
  //               <div className="flex items-center sticky top-0 ">
  //                 <motion.div
  //                   initial={{ scale: 0.8, opacity: 0 }}
  //                   animate={{ scale: 1, opacity: 1 }}
  //                   transition={{ delay: 0.2 }}
  //                   className="flex items-center size-14 grow"
  //                 >
  //                   <div className="font-bold text-2xl text-white">
  //                     <PentamaLogoWithParticles />
  //                   </div>
  //                 </motion.div>
  //                 <Button
  //                   className="text-white bg-primary/10 flex-none hover:text-purple-950"
  //                   variant="ghost" size="icon"
  //                   onClick={() => setOpenMobile(false)}
  //                 >
  //                   <X />
  //                 </Button>

  //               </div>
  //               {/* Sidebar Content */}
  //               <SidebarContent
  //                 menuItems={sidebarMenu}
  //                 info={sidebarInfo}
  //               />
  //               {/* Sidebar Footer */}
  //               <div className="sticky w-full p-6 bottom-0">
  //                 <Button
  //                   variant="outline"
  //                   className="w-full bg-linear-to-tl/oklch text-white from-black to-purple-950 justify-start cursor-pointer hover:text-destructive hover:border-destructive"
  //                   onClick={handleLogout}
  //                 >
  //                   <LogOut className="mr-2 h-4 w-4" /> Logout
  //                 </Button>
  //               </div>
  //             </motion.div>
  //           )}
  //         </AnimatePresence>
  //         {/* Main Content */}
  //         <div className="scrollbar-hidden flex-1 overflow-auto">
  //           <div className="p-6">
  //             <AnimatePresence mode="wait">
  //               <motion.div
  //                 key={pathname}
  //                 variants={pageVariants}
  //                 initial="initial"
  //                 animate="animate"
  //                 exit="exit"
  //                 transition={{ type: "tween", duration: 0.3 }}
  //                 className="h-full"
  //               >
  //                 {children}
  //               </motion.div>
  //             </AnimatePresence>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // return (
  //   <div className="flex flex-col h-screen bg-linear-to-b/oklch from-black to-purple-950">
  //     <div className="flex flex-1 overflow-hidden ">
  //       <div className="flex-none w-2xs hidden md:block z-30 shadow-md shadow-purple-600">
  //         {/* Sidebar Header */}
  //         <div className="flex items-center sticky top-0">
  //           <motion.div
  //             initial={{ scale: 0.8, opacity: 0 }}
  //             animate={{ scale: 1, opacity: 1 }}
  //             transition={{ delay: 0.2 }}
  //             className="flex items-center size-14 grow"
  //           >
  //             <div className="font-bold text-2xl text-white px-2.5">
  //               <PentamaLogoWithParticles />
  //             </div>
  //           </motion.div>
  //         </div>
  //         {/* Sidebar Content */}
  //         <SidebarContent
  //           menuItems={sidebarMenu}
  //           info={sidebarInfo}
  //         />
  //         {/* Sidebar Footer */}
  //         <div className="sticky w-full p-6 bottom-0">
  //           <Button
  //             variant="outline"
  //             className="w-full bg-linear-to-tl/oklch text-white from-black to-purple-950 justify-start cursor-pointer hover:text-destructive hover:border-destructive"
  //             onClick={handleLogout}
  //           >
  //             <LogOut className="mr-2 h-4 w-4" /> Logout
  //           </Button>
  //         </div>
  //       </div>
  //       {/* Main Content */}
  //       <div className="flex-1 overflow-auto scrollbar-hidden">
  //         <div className="p-6">
  //           <AnimatePresence mode="wait">
  //             <motion.div
  //               key={pathname}
  //               variants={pageVariants}
  //               initial="initial"
  //               animate="animate"
  //               exit="exit"
  //               transition={{ type: "tween", duration: 0.3 }}
  //               className="h-full"
  //             >
  //               {children}
  //             </motion.div>
  //           </AnimatePresence>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}


function SidebarContent({ menuItems, info }: { menuItems: PartialSiderbarMenuProps[], info: SidebarProps["sidebarInfo"] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { startLoading } = useLoading();
  const { toggleSidebar } = useSidebar();
  const handleMenuClick = (path: string) => {
    startLoading();
    toggleSidebar();
    router.push(path);
  }

  return (
    <div className="p-6 h-screen">
      <motion.div
        animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="flex flex-col items-center mb-8"
      >
        <Avatar className="h-25 w-25 mb-2 drop-shadow-purple">
          <AvatarImage
            src={info.avatarUrl ?? "/assets/img/out.png"}
          />
          <AvatarFallback className="bg-indigo-50 text-primary-foreground">
            {info.name}
          </AvatarFallback>
        </Avatar>
        <h4 className="text-lg font-medium text-white">
          {info.name}
        </h4>
        <p className="text-sm text-white/80 capitalize">
          {info.role}
        </p>
      </motion.div>
      <motion.nav className="space-y-1">
        {menuItems.map((menu) => (
          <SidebarMenu
            key={`${menu.label}-${pathname === menu.path}`}
            icon={menu.icon}
            label={menu.label}
            active={pathname === menu.path}
            onClick={() => handleMenuClick(menu.path)}
            disabled={menu.disabled}
          />
        ))}
      </motion.nav>
    </div>
  )
}

type SidebarMenuProps = {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
};

function SidebarMenu({ icon, label, active, onClick, disabled = false }: SidebarMenuProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "flex items-center w-full p-3 rounded-lg transition-colors text-white font-medium",
        active && !disabled
          ? "shadow-sm shadow-purple-600 pointer-events-none"
          : "cursor-pointer hover:bg-linear-to-b/oklch hover:shadow-sm hover:shadow-purple-700/80",
        disabled && "cursor-not-allowed opacity-50"
      )}
      disabled={disabled}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
      {disabled && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-auto"
        >
          <Lock size={16} />
        </motion.span>
      )}
      {active && !disabled && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-auto"
        >
          <ChevronRight size={16} />
        </motion.span>
      )}
    </motion.button>
  );
}