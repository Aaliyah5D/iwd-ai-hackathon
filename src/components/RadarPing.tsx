import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, X, Check } from 'lucide-react';

interface RadarPingProps {
  type: string;
  additionalInfo?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function RadarPing({ type, additionalInfo, onAccept, onDecline }: RadarPingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-x-6 bottom-28 z-50"
    >
      <div className="bg-white rounded-[32px] p-6 border-[3px] border-primary shadow-2xl overflow-hidden relative">
        {/* Radar Animation Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary rounded-full"
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
            <Radio size={32} />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-black text-text tracking-tight">Help Requested Nearby!</h3>
            <p className="text-sm font-bold text-muted">
              Someone needs <span className="text-primary">{type}</span> within 100m.
            </p>
            {additionalInfo && (
              <div className="mt-2 p-3 bg-secondary/30 rounded-xl border border-border italic text-[10px] font-bold text-muted leading-tight">
                "{additionalInfo}"
              </div>
            )}
          </div>

          <div className="flex gap-4 w-full mt-2">
            <button
              onClick={onDecline}
              className="flex-1 bg-secondary text-muted font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <X size={20} /> I can't
            </button>
            <button
              onClick={onAccept}
              className="flex-1 bg-primary text-text font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_0_0_#E66A85] active:translate-y-1 active:shadow-none transition-all"
            >
              <Check size={20} /> I can help!
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
