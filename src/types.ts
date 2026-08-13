/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  name: string;
  emoji: string;
  color: string;
  backlog: number;
  daily_increase: number;
  perday_type?: string;
  repeat_days?: string[];
  growth_mode?: 'none' | 'perday' | 'repeat';
  schedule_conflict?: boolean;
  completion_mode?: 'todo' | 'backlog';
}

export interface CustomPreset {
  id: string;
  name: string;
  emoji: string;
  entries: Subject[];
}

export type FontType = 'Inter' | 'Outfit' | 'JetBrains Mono' | 'CormorantGaramond' | 'InstrumentSerif' | 'Quicksand' | 'custom';

export interface CustomFont {
  name: string;
  data: string; 
  fontFamily: string;
}

export interface FontSettings {
  fontFamily: FontType;
  fontSize: number; 
  customFonts: CustomFont[];
  selectedCustomFont?: string; 
}

export interface AppData {
  subjects: Record<string, Subject>;
  classes_per_day: number;
  skip_sunday: boolean;
  course_name: string;
  last_updated: string;
  setup_done: boolean;
  theme: 'dark' | 'light';
  palette_color?: string;
  auto_growth_enabled?: boolean;
  notification_enabled?: boolean;
  notification_time?: string; // "HH:MM"
  custom_presets?: CustomPreset[];
  /** User-edited versions of the built-in Study, Gaming, and Work presets. */
  preset_overrides?: Record<string, Subject[]>;
  fontSettings?: FontSettings;
}
