import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Check, Clock3, X } from 'lucide-react';
import { Subject } from '../types';
import TimePickerModal from './TimePickerModal';

interface ReminderSettingsPopoverProps {
  isOpen: boolean;
  subjects: Record<string, Subject>;
  reminders: Record<string, string[]>;
  onChange: (reminders: Record<string, string[]>) => void;
  onClose: () => void;
}

const MAX_REMINDERS = 500;

export default function ReminderSettingsPopover({
  isOpen,
  subjects,
  reminders,
  onChange,
  onClose,
}: ReminderSettingsPopoverProps) {
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const subjectNames = useMemo(() => Object.keys(subjects).sort((a, b) => a.localeCompare(b)), [subjects]);
  const reminderCount = Object.entries(reminders).reduce(
    (total, [name, times]) => total + (subjects[name] ? times.length : 0),
    0,
  );

  const updateSubjectTimes = (name: string, times: string[]) => {
    const updated = { ...reminders };
    if (times.length) updated[name] = times;
    else delete updated[name];
    onChange(updated);
  };

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
            aria-label="Customize backlog reminders"
            className="w-full max-w-[440px] max-h-[78vh] overflow-hidden rounded-[28px] border border-[#cac4d0]/35 dark:border-[#454854] bg-white dark:bg-[#1a1c22] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#cac4d0]/25 dark:border-[#30333d]">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-2xl bg-brand-container text-brand flex items-center justify-center"><Bell className="w-4 h-4" /></span>
                <div>
                  <h3 className="text-sm font-bold text-[#1d1b20] dark:text-white">Customize reminders</h3>
                  <p className="text-[10px] text-[#625d67] dark:text-[#cac4d0]">Choose a time to add and save a daily reminder.</p>
                </div>
              </div>
              <button type="button" onClick={onClose} aria-label="Close reminders" className="p-2 rounded-full hover:bg-[#f3edf7] dark:hover:bg-[#2b2e38] text-[#625d67] dark:text-[#cac4d0]"><X className="w-4 h-4" /></button>
            </div>

            <div className="overflow-y-auto p-3 space-y-2">
              {subjectNames.length === 0 && <p className="text-xs text-center text-[#625d67] dark:text-[#cac4d0] py-8">Add a backlog first to customize its reminders.</p>}
              {subjectNames.map((name) => {
                const subject = subjects[name];
                const times = reminders[name] || [];
                return (
                  <section key={name} className="rounded-2xl border border-[#cac4d0]/25 dark:border-[#30333d] bg-[#f8f5fa] dark:bg-[#22252d] p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg" aria-hidden="true">{subject.emoji}</span>
                      <span className="text-xs font-bold text-[#1d1b20] dark:text-white truncate flex-1">{name}</span>
                      <span className="text-[10px] text-[#625d67] dark:text-[#aaa5b0]">{subject.backlog} pending</span>
                    </div>
                    {times.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {times.map((time) => (
                          <span key={time} className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand-container text-brand px-2 py-1 text-[10px] font-bold">
                            <Clock3 className="w-3 h-3" />{time}
                            <button type="button" aria-label={`Remove ${time} reminder for ${name}`} onClick={() => updateSubjectTimes(name, times.filter((value) => value !== time))} className="ml-0.5 rounded-full hover:bg-brand/10"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button type="button" onClick={() => setEditingSubject(name)} disabled={reminderCount >= MAX_REMINDERS} aria-label={`Add reminder time for ${name}`} className="min-h-9 flex-1 rounded-xl border border-[#cac4d0]/35 dark:border-[#454854] bg-white dark:bg-[#17191f] px-3 text-left text-xs text-[#1d1b20] dark:text-white flex items-center gap-2 hover:border-brand/50 disabled:opacity-40">
                        <Clock3 className="w-3.5 h-3.5 text-brand" />Choose a time to add
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#cac4d0]/25 dark:border-[#30333d] bg-[#f8f5fa] dark:bg-[#17191f]">
              <span className="text-[10px] text-[#625d67] dark:text-[#cac4d0]">{reminderCount}/{MAX_REMINDERS} reminders</span>
              <button type="button" onClick={onClose} className="min-h-9 px-4 rounded-full bg-brand text-white dark:text-[#111318] text-xs font-bold flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Done</button>
            </div>
          </motion.div>
        </div>
      )}
      <TimePickerModal
        isOpen={editingSubject !== null}
        onClose={() => setEditingSubject(null)}
        initialTime={editingSubject ? reminders[editingSubject]?.at(-1) || '20:00' : '20:00'}
        onSave={(time) => {
          if (editingSubject) {
            const times = reminders[editingSubject] || [];
            if (!times.includes(time) && reminderCount < MAX_REMINDERS) {
              updateSubjectTimes(editingSubject, [...times, time].sort());
            }
          }
          setEditingSubject(null);
        }}
      />
    </AnimatePresence>
  );
}
