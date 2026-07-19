/** @license SPDX-License-Identifier: Apache-2.0 */

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MousePointer2, X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'setup' | 'dashboard';
}

type TourStep = { target: string; title: string; text: string; action: string };

const dashboardSteps: TourStep[] = [
  { target: 'configure', title: 'Set up your list', text: 'Use this whenever you want to add, rename, or remove tracked items.', action: 'Try clicking Configure' },
  { target: 'daily-target', title: 'Set a realistic daily target', text: 'This is how many backlog units you plan to complete each day. The finish estimate updates from it.', action: 'Use + or − to adjust it' },
  { target: 'item-actions', title: 'Update an item in one tap', text: 'Add Item records new work. Complete reduces the current count. These are the only buttons you need every day.', action: 'Try either action now' },
  { target: 'settings', title: 'Back up and personalize', text: 'Settings contains backups, theme controls, and this tour whenever you need a refresher.', action: 'Open Settings when you are ready' }
];

const setupSteps: TourStep[] = [
  { target: 'tracker-name', title: 'Name your tracker', text: 'Keep it short and recognizable, such as “Semester 4” or “Games to play”.', action: 'Type a name if you want' },
  { target: 'tracking-type', title: 'Choose a starting list', text: 'Pick Study, Gaming, or Work to get useful items instantly. Choose Custom only if you want to start from scratch.', action: 'Pick the closest match' },
  { target: 'configured-items', title: 'Add or change items', text: 'Use Edit items, then Add item to type a new name. You can also rename or remove any starter item. Tap Done when your list looks right.', action: 'Edit items is where you customize the list' }
];

export default function HelpModal({ isOpen, onClose, context = 'dashboard' }: HelpModalProps) {
  const steps = context === 'setup' ? setupSteps : dashboardSteps;
  const [page, setPage] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const step = steps[page];

  useEffect(() => {
    if (!isOpen) return;
    setPage(0);
  }, [isOpen, context]);

  useEffect(() => {
    const showEditingHelp = () => {
      if (isOpen && context === 'setup' && page === 1) setPage(2);
    };
    window.addEventListener('tracker-tracking-type-selected', showEditingHelp);
    return () => window.removeEventListener('tracker-tracking-type-selected', showEditingHelp);
  }, [context, isOpen, page]);

  useEffect(() => {
    if (!isOpen) return;
    let target: HTMLElement | null = null;
    let timeoutId: number | undefined;
    const update = () => {
      target = document.querySelector(`[data-tour="${step.target}"]`);
      if (!target) {
        setPosition(null);
        return;
      }
      target.classList.add('app-tour-active');
      const rect = target.getBoundingClientRect();
      const width = Math.min(340, window.innerWidth - 32);
      const calloutHeight = calloutRef.current?.offsetHeight || 180;
      const gap = 14;
      const hasSpaceBelow = window.innerHeight - rect.bottom >= calloutHeight + gap + 16;
      const top = hasSpaceBelow
        ? rect.bottom + gap
        : Math.max(16, rect.top - calloutHeight - gap);
      setPosition({ top, left: Math.min(window.innerWidth - width - 16, Math.max(16, rect.left)), width });
    };

    timeoutId = window.setTimeout(() => {
      const nextTarget = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      nextTarget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(update, 250);
    }, 0);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.clearTimeout(timeoutId);
      target?.classList.remove('app-tour-active');
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isOpen, step]);

  if (!isOpen) return null;

  const goForward = () => {
    if (page === steps.length - 1) {
      onClose();
      return;
    }
    if (context === 'setup' && page === 1) {
      document.querySelector<HTMLButtonElement>('[data-track-type="custom"]')?.click();
      return;
    }
    setPage(value => value + 1);
  };

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none" aria-live="polite">
      <div className="fixed top-4 right-4 pointer-events-auto">
        <button type="button" onClick={onClose} className="rounded-full bg-[#1d1b20] dark:bg-white text-white dark:text-[#111318] px-3 py-2 text-xs font-bold shadow-xl flex items-center gap-1"><X className="w-3.5 h-3.5" /> End tour</button>
      </div>
      <div className="fixed inset-0 bg-[#1d1b20]/10 dark:bg-black/20" />
      <div ref={calloutRef} className="fixed pointer-events-auto rounded-[22px] bg-white dark:bg-[#1a1c22] border border-[#cac4d0]/60 dark:border-[#454854] shadow-2xl p-4 text-[#1d1b20] dark:text-white" style={position ? { top: position.top, left: position.left, width: position.width } : { bottom: 16, left: 16, right: 16 }}>
        <div className="flex items-start gap-2"><span className="mt-0.5 w-7 h-7 rounded-lg bg-brand-container text-brand flex items-center justify-center"><MousePointer2 className="w-4 h-4" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-brand">Step {page + 1} of {steps.length}</p><h2 className="text-sm font-bold">{step.title}</h2></div></div>
        <p className="text-xs text-[#49454f] dark:text-[#cac4d0] leading-relaxed mt-3">{step.text}</p>
        <p className="text-[10px] font-bold text-brand mt-2">{step.action}</p>
        <div className="flex gap-2 mt-3"><button type="button" onClick={() => page === 0 ? onClose() : setPage(value => value - 1)} className="flex-1 py-2 rounded-full bg-brand-container text-brand text-xs font-bold flex items-center justify-center gap-1"><ChevronLeft className="w-3.5 h-3.5" /> {page === 0 ? 'Skip' : 'Back'}</button><button type="button" onClick={goForward} className="flex-1 py-2 rounded-full bg-brand text-white dark:text-[#111318] text-xs font-bold flex items-center justify-center gap-1">{page === steps.length - 1 ? 'Done' : 'Next'} {page < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}</button></div>
      </div>
    </div>
  );
}
