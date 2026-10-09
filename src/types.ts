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
  skip_sunday_growth?: boolean;
  schedule_conflict?: boolean;
  completion_mode?: 'todo' | 'backlog';
}

export interface CustomPreset {
  id: string;
  name: string;
  emoji: string;
  entries: Subject[];
}

export interface PresetPreferences {
  theme?: 'dark' | 'light';
  palette_color?: string;
  show_quotes?: boolean;
  notification_enabled?: boolean;
  notification_time?: string;
  custom_notifications_enabled?: boolean;
  notification_reminders?: Record<string, string[]>;
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
  show_quotes?: boolean;
  auto_growth_enabled?: boolean;
  notification_enabled?: boolean;
  notification_time?: string; // "HH:MM"
  custom_notifications_enabled?: boolean;
  notification_reminders?: Record<string, string[]>;
  custom_presets?: CustomPreset[];
  /** User-edited versions of the built-in Study, Gaming, and Work presets. */
  preset_overrides?: Record<string, Subject[]>;
  /** Reminder and appearance settings saved independently for each selected preset. */
  preset_preferences?: Record<string, PresetPreferences>;
  active_preset_key?: string;
}
