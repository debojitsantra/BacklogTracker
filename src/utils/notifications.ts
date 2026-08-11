import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

// Dynamically import Tauri Notification plugin only when running inside Tauri
const getTauriNotification = async () => {
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    try {
      return await import('@tauri-apps/plugin-notification');
    } catch (e) {
      console.error('Failed to import Tauri notification plugin:', e);
    }
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
const REMINDER_ID = 42;
const LEGACY_REMINDER_IDS = Array.from({ length: 100 }, (_, index) => ({ id: REMINDER_ID + index }));

export async function syncScheduledNotifications(enabled: boolean, time: string, backlogCount: number): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      // Remove the current reminder and any reminders created by earlier
      // multi-reminder builds before scheduling the single daily reminder.
      await LocalNotifications.cancel({ notifications: LEGACY_REMINDER_IDS });

      if (enabled && time) {
        // Request permissions/create channel
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          console.warn('Notifications enabled but permission not granted.');
          return;
        }

        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return;

        const bodyText = backlogCount > 0 
          ? `You have ${backlogCount} pending backlog${backlogCount === 1 ? '' : 's'} to clear today! 🎯`
          : "Your tracker is clear! Keep up the great work! 🌟";

        await LocalNotifications.schedule({
          notifications: [{
              id: REMINDER_ID,
              title: "Backlog Tracker",
              body: bodyText,
              channelId: 'daily-reminder',
              schedule: {
                on: {
                  hour: hours,
                  minute: minutes
                },
                allowWhileIdle: true
              },
              sound: undefined,
              attachments: [],
              actionTypeId: "",
              extra: null
            }]
        });
      }
    } catch (e) {
      console.error('Failed to sync Capacitor local notifications:', e);
    }
  } else {
    // On web/desktop, permissions are requested, but actual triggering is handled
    // via background check interval in App.tsx while the app is running.
    if (enabled && time) {
      await requestNotificationPermission();
    }
  }
}

/**
 * Trigger an immediate notification on desktop/web (if permissions granted).
 */
export async function triggerDesktopNotification(title: string, body: string): Promise<void> {
  const tauriNotif = await getTauriNotification();
  if (tauriNotif) {
    try {
      await tauriNotif.sendNotification({ title, body });
      return;
    } catch (e) {
      console.error('Failed to send Tauri notification:', e);
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/assets/icon.svg' // Fallback to root assets icon if available
    });
  }
}
