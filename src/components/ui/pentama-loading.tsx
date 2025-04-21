"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLoading } from "../contexts/UnifiedContext";

export const LoadingAnimation = () => {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <motion.div
              className="h-16 w-16 rounded-full border-4 border-white/20 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-white font-semibold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Sedang memuat...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const PentamaLoading = () => {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex fixed flex-col inset-0 items-center justify-center bg-linear-to-b/oklch  from-black/80 to-purple-950/80 backdrop-blur-lg z-50"
        >
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="size-52 md:size-56"
          >
            <Image
              src="/assets/img/student.png"
              alt="Loading"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0 0 10px rgba(128, 0, 128, 0.5))"
              }}
              className="drop-shadow-purple"
              priority
              fill
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="font-semibold text-white"
          >
            Loading...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};  