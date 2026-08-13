/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronUp, ChevronDown, Check, X } from 'lucide-react';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTime: string; // "HH:MM"
  onSave: (time: string) => void;
}

export default function TimePickerModal({
  isOpen,
  onClose,
  initialTime,
  onSave
}: TimePickerModalProps) {
  const [hour12, setHour12] = useState(8);
  const [minute, setMinute] = useState(0);
  const [isPm, setIsPm] = useState(true);

  useEffect(() => {
    if (initialTime) {
      const [h, m] = initialTime.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        const pm = h >= 12;
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        setHour12(h12);
        setMinute(m);
        setIsPm(pm);
      }
    }
  }, [initialTime, isOpen]);

  const handleIncrementHour = () => {
    setHour12((prev) => (prev === 12 ? 1 : prev + 1));
  };

  const handleDecrementHour = () => {
    setHour12((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const handleIncrementMinute = () => {
    setMinute((prev) => (prev + 1) % 60);
  };

  const handleDecrementMinute = () => {
    setMinute((prev) => (prev + 59) % 60);
  };

  const handlePresetClick = (h24: number, m: number) => {
    const pm = h24 >= 12;
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    setHour12(h12);
    setMinute(m);
    setIsPm(pm);
  };

  const handleSave = () => {
    let h24 = hour12;
    if (isPm) {
      if (h24 !== 12) h24 += 12;
    } else {
      if (h24 === 12) h24 = 0;
    }
    const formattedHour = String(h24).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    onSave(`${formattedHour}:${formattedMinute}`);
    onClose();
  };

  const formatTimeDisplay = (val: number) => {
    return String(val).padStart(2, '0');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1d1b20]/60 dark:bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="w-full max-w-[320px] bg-white dark:bg-[#1a1c22] border border-[#cac4d0]/30 dark:border-[#24262f]/60 rounded-[28px] p-5 shadow-2xl flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#cac4d0]/20 dark:border-[#24262f]/60 pb-2">
              <h4 className="text-xs font-extrabold text-[#1d1b20] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand" />
                Set Reminder Time
              </h4>
              <button
                onClick={onClose}
                type="button"
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#49454f] dark:text-[#cac4d0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Time selection dials */}
            <div className="flex items-center justify-center gap-3 py-2">
              {/* Hour selector */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleIncrementHour}
                  className="p-1 text-brand hover:bg-brand-container/40 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                <div className="bg-brand-container text-brand font-mono text-4xl font-extrabold px-3 py-3 rounded-2xl w-[64px] text-center select-none shadow-inner border border-brand/10">
                  {formatTimeDisplay(hour12)}
                </div>
                <button
                  type="button"
                  onClick={handleDecrementHour}
                  className="p-1 text-brand hover:bg-brand-container/40 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>

              {/* Colon separator */}
              <span className="text-3xl font-extrabold text-[#1d1b20] dark:text-white animate-pulse select-none">:</span>

              {/* Minute selector */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleIncrementMinute}
                  className="p-1 text-brand hover:bg-brand-container/40 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                <div className="bg-brand-container text-brand font-mono text-4xl font-extrabold px-3 py-3 rounded-2xl w-[64px] text-center select-none shadow-inner border border-brand/10">
                  {formatTimeDisplay(minute)}
                </div>
                <button
                  type="button"
                  onClick={handleDecrementMinute}
                  className="p-1 text-brand hover:bg-brand-container/40 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>

              {/* AM/PM toggle selector */}
              <div className="flex flex-col gap-1.5 self-center pl-1">
                <button
                  type="button"
                  onClick={() => setIsPm(false)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    !isPm
                      ? 'bg-brand text-white dark:text-[#111318] shadow-sm'
                      : 'bg-[#f3edf7]/55 dark:bg-[#24262f]/30 text-[#49454f] dark:text-[#cac4d0] border border-[#cac4d0]/20 dark:border-[#24262f]/60 hover:bg-brand-container/20'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setIsPm(true)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isPm
                      ? 'bg-brand text-white dark:text-[#111318] shadow-sm'
                      : 'bg-[#f3edf7]/55 dark:bg-[#24262f]/30 text-[#49454f] dark:text-[#cac4d0] border border-[#cac4d0]/20 dark:border-[#24262f]/60 hover:bg-brand-container/20'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Quick presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#49454f] dark:text-[#cac4d0] font-bold uppercase tracking-wider block">
                Quick Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetClick(8, 0)}
                  className="py-1.5 px-2 bg-[#f3edf7]/40 dark:bg-[#24262f]/20 hover:bg-brand-container/50 dark:hover:bg-brand-container/20 border border-[#cac4d0]/20 dark:border-[#24262f]/60 text-xs font-semibold text-[#1d1b20] dark:text-[#cac4d0] rounded-xl transition-all cursor-pointer"
                >
                  🌅 Morning (08:00 AM)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick(14, 0)}
                  className="py-1.5 px-2 bg-[#f3edf7]/40 dark:bg-[#24262f]/20 hover:bg-brand-container/50 dark:hover:bg-brand-container/20 border border-[#cac4d0]/20 dark:border-[#24262f]/60 text-xs font-semibold text-[#1d1b20] dark:text-[#cac4d0] rounded-xl transition-all cursor-pointer"
                >
                  ☀️ Afternoon (02:00 PM)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick(18, 0)}
                  className="py-1.5 px-2 bg-[#f3edf7]/40 dark:bg-[#24262f]/20 hover:bg-brand-container/50 dark:hover:bg-brand-container/20 border border-[#cac4d0]/20 dark:border-[#24262f]/60 text-xs font-semibold text-[#1d1b20] dark:text-[#cac4d0] rounded-xl transition-all cursor-pointer"
                >
                  🌆 Evening (06:00 PM)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick(21, 0)}
                  className="py-1.5 px-2 bg-[#f3edf7]/40 dark:bg-[#24262f]/20 hover:bg-brand-container/50 dark:hover:bg-brand-container/20 border border-[#cac4d0]/20 dark:border-[#24262f]/60 text-xs font-semibold text-[#1d1b20] dark:text-[#cac4d0] rounded-xl transition-all cursor-pointer"
                >
                  🌌 Night (09:00 PM)
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2 border-t border-[#cac4d0]/20 dark:border-[#24262f]/60">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-full border border-[#cac4d0]/40 text-[#49454f] dark:text-[#cac4d0] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-all cursor-pointer"
                style={{ minHeight: '36px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2 bg-brand text-white dark:text-[#111318] hover:opacity-90 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                style={{ minHeight: '36px' }}
              >
                <Check className="w-3.5 h-3.5" />
                Set Time
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
