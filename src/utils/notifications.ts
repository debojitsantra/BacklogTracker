import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

type TauriNotificationApi = typeof import('@tauri-apps/plugin-notification');

function hasTauriRuntime(): boolean {
  if (typeof window === 'undefined') return false;

  return Boolean(
    (globalThis as { isTauri?: boolean }).isTauri ||
    '__TAURI_INTERNALS__' in window
  );
}

// Dynamically import Tauri Notification plugin only when running inside Tauri
const getTauriNotification = async (): Promise<TauriNotificationApi | null> => {
  if (!hasTauriRuntime()) return null;

  try {
    const { isTauri } = await import('@tauri-apps/api/core');
    if (!isTauri() && !hasTauriRuntime()) return null;

    return await import('@tauri-apps/plugin-notification');
  } catch (e) {
    console.error('Failed to load Tauri notification plugin:', e);
  }

  return null;
};

/**
 * Request notification permissions from the user.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      // Create channel first for Android 8.0+
      await LocalNotifications.createChannel({
        id: 'daily-reminder',
        name: 'Daily Reminders',
        description: 'Notifications to remind you to log backlogs',
        importance: 4,
        visibility: 1,
        vibration: true,
      });

      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') {
        return true;
      }
      const requestStatus = await LocalNotifications.requestPermissions();
      return requestStatus.display === 'granted';
    } catch (e) {
      console.error('Error requesting Capacitor notification permission:', e);
      return false;
    }
  }

  // Check if Tauri is available
  const tauriNotif = await getTauriNotification();
  if (tauriNotif) {
    try {
      let granted = await tauriNotif.isPermissionGranted();
      if (!granted) {
        const permission = await tauriNotif.requestPermission();
        granted = permission === 'granted';
      }
      return granted;
    } catch (e) {
      console.error('Error requesting Tauri notification permission:', e);
      return false;
    }
  }

  // Fallback to standard Web Notification API
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') {
        return true;
      }
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.error('Error requesting Web notification permission:', e);
      return false;
    }
  }
  return false;
}

/**
 * Open Android's "Alarms & reminders" setting when exact alarms have been
 * disabled. This is separate from notification display permission on Android
 * 12+, and without it a daily reminder may be delayed substantially.
 */
export async function requestExactAlarmPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return true;
  }

  try {
    const status = await LocalNotifications.checkExactNotificationSetting();
    if (status.exact_alarm === 'granted') return true;

    // This opens the system setting. Android may restart the app after the
    // setting changes, so the normal startup sync will schedule the reminder.
    const updatedStatus = await LocalNotifications.changeExactNotificationSetting();
    return updatedStatus.exact_alarm === 'granted';
  } catch (e) {
    console.error('Error requesting Android exact-alarm permission:', e);
    return false;
  }
}

/**
 * Configure and schedule daily reminders.
 * On mobile, this registers a system-level local notification that persists when the app is killed.
 */
const LEGACY_REMINDER_IDS = Array.from({ length: 100 }, (_, index) => ({ id: 42 + index }));
// Reuse a bounded pool of IDs. Re-syncing replaces these pending notifications
// instead of allocating ever-growing IDs as users edit reminder times.
const MAX_SCHEDULED_REMINDERS = 500;
const REMINDER_ID_BASE = 1000;
const SCHEDULED_REMINDER_IDS = Array.from({ length: MAX_SCHEDULED_REMINDERS }, (_, index) => ({ id: REMINDER_ID_BASE + index }));

export async function syncScheduledNotifications(
  enabled: boolean,
  reminders: Record<string, string[]> | undefined,
  subjects: Record<string, { name: string; emoji: string; backlog: number }>,
  legacyTime?: string,
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      const managedIds = new Set([...LEGACY_REMINDER_IDS, ...SCHEDULED_REMINDER_IDS].map(({ id }) => id));
      const pending = await LocalNotifications.getPending();
      const staleManagedNotifications = pending.notifications
        .filter(({ id }) => managedIds.has(id))
        .map(({ id }) => ({ id }));
      if (staleManagedNotifications.length) {
        await LocalNotifications.cancel({ notifications: staleManagedNotifications });
      }

      if (enabled) {
        // Request permissions/create channel
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          console.warn('Notifications enabled but permission not granted.');
          return;
        }

        const scheduled = [];
        if (reminders === undefined && legacyTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(legacyTime)) {
          const [hours, minutes] = legacyTime.split(':').map(Number);
          const backlogCount = Object.values(subjects).reduce((sum, subject) => sum + (subject.backlog || 0), 0);
          scheduled.push({
            id: 42,
            title: 'Backlog Tracker',
            body: backlogCount > 0 ? `You have ${backlogCount} pending backlog${backlogCount === 1 ? '' : 's'} to clear today! 🎯` : 'Your tracker is clear! Keep up the great work! 🌟',
            channelId: 'daily-reminder',
            schedule: { on: { hour: hours, minute: minutes }, allowWhileIdle: true },
          });
        } else {
          const reminderEntries = Object.keys(subjects).sort().flatMap((name) =>
            (reminders?.[name] || []).map((time) => ({ name, subject: subjects[name], time })),
          ).filter(({ time }) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time)).slice(0, MAX_SCHEDULED_REMINDERS);

          reminderEntries.forEach(({ name, subject, time }, index) => {
            const [hours, minutes] = time.split(':').map(Number);
            scheduled.push({
              id: REMINDER_ID_BASE + index,
              title: `${subject.emoji} ${name}`,
              body: `${subject.backlog} pending item${subject.backlog === 1 ? '' : 's'} in this backlog.`,
              channelId: 'daily-reminder',
              schedule: { on: { hour: hours, minute: minutes }, allowWhileIdle: true },
            });
          });
        }

        if (scheduled.length) await LocalNotifications.schedule({ notifications: scheduled });
      }
    } catch (e) {
      console.error('Failed to sync Capacitor local notifications:', e);
    }
  } else {
    // On web/desktop, permissions are requested, but actual triggering is handled
    // via background check interval in App.tsx while the app is running.
    if (enabled && (legacyTime || (reminders && Object.values(reminders).some((times) => times.length > 0)))) {
      await requestNotificationPermission();
    }
  }
}

/**
 * Trigger an immediate notification on desktop/web (if permissions granted).
 */
export async function triggerDesktopNotification(title: string, body: string): Promise<boolean> {
  const tauriNotif = await getTauriNotification();
  if (tauriNotif) {
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return false;

      tauriNotif.sendNotification({ title, body });
      return true;
    } catch (e) {
      console.error('Failed to send Tauri notification:', e);
      return false;
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission !== 'granted') {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return false;
    }

    new Notification(title, {
      body,
      icon: '/assets/icon.svg' // Fallback to root assets icon if available
    });
    return true;
  }

  return false;
}
