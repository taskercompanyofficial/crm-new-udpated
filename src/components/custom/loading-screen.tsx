"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
  text?: string;
  showLogo?: boolean;
}

export function LoadingScreen({
  text = "Loading your workspace...",
  showLogo = true,
}: LoadingScreenProps) {
  const [progress, setProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 20, 100);
        if (next === 100) {
          setIsComplete(true);
          clearInterval(timer);
        }
        return next;
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background"
      >
        {/* Enhanced animated background with multiple gradients */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "linear-gradient(45deg, var(--primary) 0%, transparent 100%), linear-gradient(135deg, var(--secondary, #6366f1) 0%, transparent 100%)",
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative flex flex-col items-center gap-8"
        >
          {showLogo && (
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Enhanced animated rings with glow effect */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-lg bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              <div className="relative flex h-20 w-20 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-lg backdrop-blur-sm">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/assets/images/icon.png"
                    alt="Tasker Company Logo"
                    width={60}
                    height={60}
                    className="drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold tracking-tighter"
          >
            <motion.span 
              className="bg-gradient-to-r from-primary via-purple-500 to-primary/60 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              Tasker Company
            </motion.span>
          </motion.div>

          {/* Enhanced progress bar with glow effect */}
          <motion.div className="h-1.5 w-64 overflow-hidden rounded-full bg-muted/50 backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/60 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </motion.div>

          {/* Enhanced loading dots */}
          <div className="flex items-center gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-6, 6, -6],
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  y: { duration: 1.2, repeat: Infinity, delay: i * 0.1 },
                  scale: { duration: 1.2, repeat: Infinity, delay: i * 0.1 },
                  opacity: { duration: 1.2, repeat: Infinity, delay: i * 0.1 },
                  ease: "easeInOut",
                }}
                className="h-3 w-3 rounded-full bg-gradient-to-r from-primary to-primary/60 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm font-medium text-muted-foreground"
          >
            {isComplete ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Ready to launch...
              </motion.span>
            ) : (
              `${text} ${Math.round(progress)}%`
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
