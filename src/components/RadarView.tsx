import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, X, Check, MapPin, Navigation } from 'lucide-react';

interface RadarViewProps {
  type: string;
  additionalInfo?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function RadarView({ type, additionalInfo, onAccept, onDecline }: RadarViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
    >
      {/* Radar Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1,
                ease: "linear"
              }}
              className="absolute inset-0 border border-primary/30 rounded-full"
            />
          ))}
          {/* Rotating Sweep */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full origin-center"
            style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse border-4 border-primary/40">
            <Radio size={64} />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-white"
          >
            <AlertCircle size={16} />
          </motion.div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-text tracking-tighter uppercase italic">Help Required!</h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-text rounded-full font-black text-xs uppercase tracking-widest">
            <MapPin size={14} /> 100m Away
          </div>
          <p className="text-xl font-bold text-muted mt-4">
            Someone needs <span className="text-primary underline decoration-4 underline-offset-4">{type}</span>
          </p>
        </div>

        {additionalInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full p-6 bg-white border-[3px] border-border rounded-[32px] shadow-xl italic text-sm font-bold text-muted leading-relaxed relative"
          >
            <div className="absolute -top-3 left-6 px-3 bg-white border-2 border-border rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
              Message
            </div>
            "{additionalInfo}"
          </motion.div>
        )}

        <div className="flex gap-4 w-full mt-4">
          <button
            onClick={onDecline}
            className="flex-1 bg-secondary text-muted font-black py-5 rounded-[24px] flex items-center justify-center gap-2 active:scale-95 transition-all border-[3px] border-border"
          >
            <X size={24} /> Ignore
          </button>
          <button
            onClick={onAccept}
            className="flex-2 bg-primary text-text font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-[0_6px_0_0_#E66A85] active:translate-y-1 active:shadow-none transition-all text-lg"
          >
            <Navigation size={24} /> Accept Sync
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { AlertCircle } from 'lucide-react';
