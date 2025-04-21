"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";


type GlassmorphismButtonProps = {
  icon?: React.ReactNode;
} & Omit<HTMLMotionProps<"button">, "color">;

export function GlassmorphismButton({
  children,
  icon,
  className,
  ...props
}: GlassmorphismButtonProps) {
  return (
    <motion.button
      initial={{
        scale: 1,
        rotateX: 0,
        rotateY: 0
      }}
      whileHover={{
        scale: 1.05,
        rotateX: 5,
        rotateY: -5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 10
        }
      }}
      whileTap={{
        scale: 0.95,
        rotateX: 0,
        rotateY: 0
      }}
      className={cn(
        "px-6 py-3 rounded-xl",
        "bg-white/10 backdrop-blur-lg",
        "border border-white/20 text-white",
        "flex items-center justify-center gap-2",
        "transform transition-all duration-300",
        "shadow-2xl",
        className
      )}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
      {...props}
    >
      {icon && (
        <motion.span
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
      )}
      <motion.span
        className="font-semibold tracking-wider"
        initial={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

type LevitatingButtonProps = {
  icon?: React.ReactNode,
  color?: "blue" | "purple" | "green" | "dark_purple";
} & Omit<HTMLMotionProps<"button">, "color">;

export function LevitatingNeonButton({
  children,
  icon,
  color = "blue",
  className,
  ...props
}: LevitatingButtonProps) {
  const colorVariants = {
    dark_purple: {
      bg: "bg-transparent inset-shadow-2xs inset-shadow-purple-600/80 shadow-2xs shadow-purple-600/80",
      glow: "hover:inset-shadow-purple-600 hover:shadow-purple-600",
      neon: "text-purple-100"
    },
    blue: {
      bg: "bg-linear-to-r/oklch from-indigo-600 to-purple-600",
      glow: "hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.8),0_0_25px_rgba(0,255,255,0.6)]",
      neon: "text-white"
    },
    purple: {
      bg: "bg-purple-500",
      glow: "hover:shadow-[0_0_25px_rgba(124,58,237,0.7)]",
      neon: "text-white"
    },
    green: {
      bg: "bg-green-500",
      glow: "hover:shadow-[0_0_25px_rgba(34,197,94,0.7)]",
      neon: "text-white"
    }
  };

  const variant = colorVariants[color];

  return (
    <motion.button
      initial={{ y: 0, scale: 1 }}
      whileHover={{
        y: -8,
        scale: 1.05,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 10
        }
      }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-6 py-3 rounded-xl",
        variant.bg, variant.glow,
        "text-white font-bold",
        "transition-all duration-300",
        "transform shadow-lg",
        "hover:brightness-110",
        "flex items-center justify-center gap-2",
        "transform transition-all duration-300",
        className
      )}
      {...props}
    >  {icon && (
      <motion.span
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.span>
    )}
      <motion.span
        className={`  
          block relative  
          ${variant.neon}  
          tracking-wider  
        `}
        initial={{ textShadow: "0 0 0px" }}
        whileHover={{
          textShadow: `0 0 10px ${color === "blue" ? "rgba(59,130,246,0.7)" :
            color === "purple" ? "rgba(124,58,237,0.7)" :
              color === "green" ? "rgba(34,197,94,0.7)" : ""
            }`
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

type Button3DProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
};

const variantStyles = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  danger: "bg-red-500 text-white hover:bg-red-600"
};

export function Button3D({
  children,
  onClick,
  className = "",
  variant = "primary"
}: Button3DProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 10
      }}
      className={`  
        px-6 py-3 rounded-xl shadow-lg  
        transform transition-all duration-300  
        ${variantStyles[variant]}  
        ${className}  
      `}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
      onClick={onClick}
    >
      <motion.span
        initial={{ transform: "translateZ(0)" }}
        whileHover={{ transform: "translateZ(50px)" }}
        transition={{ type: "spring", stiffness: 200 }}
        className="block relative"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}  
