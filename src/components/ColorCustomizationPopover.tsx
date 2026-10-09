import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Palette, X } from 'lucide-react';

interface ColorCustomizationPopoverProps {
  isOpen: boolean;
  selectedColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Classic Purple', hex: '#6750a4' },
  { name: 'Teal Forest', hex: '#006a6a' },
  { name: 'Crimson Fire', hex: '#ba1a1a' },
  { name: 'Ocean Blue', hex: '#0277bd' },
  { name: 'Sunset Orange', hex: '#d84315' },
  { name: 'Emerald Green', hex: '#2e7d32' },
  { name: 'Royal Violet', hex: '#7b1fa2' },
  { name: 'Deep Indigo', hex: '#3f51b5' },
  { name: 'Rose Pink', hex: '#d81b60' },
  { name: 'Golden Amber', hex: '#ff8f00' },
  { name: 'Soot Black', hex: '#111111' },
  { name: 'Charred Cinder', hex: '#000000' },
  { name: 'Coral', hex: '#ff6b6b' },
  { name: 'Cherry', hex: '#c62828' },
  { name: 'Ruby', hex: '#ad1457' },
  { name: 'Blush', hex: '#ec407a' },
  { name: 'Watermelon', hex: '#f4516c' },
  { name: 'Dusty Rose', hex: '#c06080' },
  { name: 'Lilac', hex: '#ab47bc' },
  { name: 'Orchid', hex: '#8e24aa' },
  { name: 'Amethyst', hex: '#6a1b9a' },
  { name: 'Periwinkle', hex: '#7986cb' },
  { name: 'Midnight Blue', hex: '#1a237e' },
  { name: 'Cobalt', hex: '#1565c0' },
  { name: 'Sapphire', hex: '#1e88e5' },
  { name: 'Sky Blue', hex: '#039be5' },
  { name: 'Ice Blue', hex: '#4fc3f7' },
  { name: 'Aqua', hex: '#00acc1' },
  { name: 'Turquoise', hex: '#26a69a' },
  { name: 'Jade', hex: '#00897b' },
  { name: 'Seafoam', hex: '#4db6ac' },
  { name: 'Pine Green', hex: '#00796b' },
  { name: 'Forest Green', hex: '#388e3c' },
  { name: 'Mint', hex: '#66bb6a' },
  { name: 'Lime', hex: '#7cb342' },
  { name: 'Olive', hex: '#9e9d24' },
  { name: 'Lemon', hex: '#c0ca33' },
  { name: 'Sunshine', hex: '#fdd835' },
  { name: 'Mustard', hex: '#f9a825' },
  { name: 'Amber', hex: '#ffb300' },
  { name: 'Tangerine', hex: '#fb8c00' },
  { name: 'Apricot', hex: '#ffab73' },
  { name: 'Terracotta', hex: '#bf5b32' },
  { name: 'Copper', hex: '#a65e2e' },
  { name: 'Mocha', hex: '#795548' },
  { name: 'Sandstone', hex: '#a1887f' },
  { name: 'Slate', hex: '#546e7a' },
  { name: 'Steel', hex: '#607d8b' },
  { name: 'Graphite', hex: '#37474f' },
  { name: 'Silver', hex: '#90a4ae' },
];

export default function ColorCustomizationPopover({ isOpen, selectedColor, onSelect, onClose }: ColorCustomizationPopoverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" onMouseDown={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Choose app color"
            className="w-full max-w-[440px] max-h-[78vh] overflow-hidden rounded-[28px] border border-[#cac4d0]/35 dark:border-[#454854] bg-white dark:bg-[#1a1c22] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#cac4d0]/25 dark:border-[#30333d]">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-2xl bg-brand-container text-brand flex items-center justify-center"><Palette className="w-4 h-4" /></span>
                <div>
                  <h3 className="text-sm font-bold text-[#1d1b20] dark:text-white">Customization</h3>
                  <p className="text-[10px] text-[#625d67] dark:text-[#cac4d0]">Choose your favorite app color.</p>
                </div>
              </div>
              <button type="button" onClick={onClose} aria-label="Close color customization" className="p-2 rounded-full hover:bg-[#f3edf7] dark:hover:bg-[#2b2e38] text-[#625d67] dark:text-[#cac4d0]"><X className="w-4 h-4" /></button>
            </div>

            <div className="overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PRESETS.map((color) => {
                  const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      type="button"
                      aria-label={`${color.name}${isSelected ? ', selected' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => { onSelect(color.hex); onClose(); }}
                      className={`min-h-11 px-3 rounded-xl border flex items-center gap-2 transition-all text-left ${isSelected
                        ? 'bg-[#f3edf7] dark:bg-[#24262f] border-brand shadow-sm font-bold'
                        : 'bg-white dark:bg-[#1a1c22]/40 border-[#cac4d0]/30 dark:border-[#24262f]/60 hover:border-brand/40'
                        }`}
                    >
                      <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm" style={{ backgroundColor: color.hex }}>
                        {isSelected && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </span>
                      <span className="text-xs truncate text-[#1d1b20] dark:text-white">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
