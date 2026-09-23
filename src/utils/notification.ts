import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { ReminderItem } from '../types';

/**
 * Initializes notification permissions and channels for Android
 */
export async function initNotifications(): Promise<boolean> {
  try {
    if (Capacitor.isNativePlatform()) {
      const status = await LocalNotifications.checkPermissions();
      if (status.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        return req.display === 'granted';
      }
      return true;
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      }
      return Notification.permission === 'granted';
    }
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
  }
  return false;
}

/**
 * Converts a reminder item into an scheduled Android/Capacitor notification
 */
export async function scheduleReminderNotification(reminder: ReminderItem): Promise<void> {
  if (!reminder || reminder.isCompleted) return;

  const [yearStr, monthStr, dayStr] = reminder.dateString.split('-');
  const [hourStr, minuteStr] = (reminder.time || '08:00').split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr || '8', 10);
  const minute = parseInt(minuteStr || '0', 10);

  const scheduleDate = new Date(year, month, day, hour, minute, 0);

  // Generate a stable numeric 32-bit ID for Android notifications from reminder.id
  let numId = 1000;
  for (let i = 0; i < reminder.id.length; i++) {
    numId = ((numId << 5) - numId + reminder.id.charCodeAt(i)) & 0x7fffffff;
  }
  numId = Math.abs(numId % 2000000000);

  try {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.cancel({ notifications: [{ id: numId }] }).catch(() => {});

      // Only schedule if date is in the future or within current day
      const now = new Date();
      if (scheduleDate.getTime() > now.getTime()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: numId,
              title: `🔔 Pengingat: ${reminder.title}`,
              body: reminder.notes ? `${reminder.notes} (${reminder.dateString} ${reminder.time})` : `Jadwal hari ini pukul ${reminder.time}`,
              schedule: { at: scheduleDate },
              sound: 'beep.wav',
              actionTypeId: '',
              extra: { reminderId: reminder.id }
            }
          ]
        });
      }
    } else if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const now = new Date();
      const delayMs = scheduleDate.getTime() - now.getTime();
      // If it's within the next 24 hours in the browser session, set a timer
      if (delayMs > 0 && delayMs < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          try {
            new Notification(`🔔 Pengingat: ${reminder.title}`, {
              body: reminder.notes || `Jadwal: ${reminder.dateString} pukul ${reminder.time}`,
              icon: '/icons/icon-192.png'
            });
          } catch (e) {
            console.warn(e);
          }
        }, delayMs);
      }
    }
  } catch (err) {
    console.warn('Failed to schedule notification:', err);
  }
}

/**
 * Cancel a scheduled reminder notification
 */
export async function cancelReminderNotification(reminderId: string): Promise<void> {
  let numId = 1000;
  for (let i = 0; i < reminderId.length; i++) {
    numId = ((numId << 5) - numId + reminderId.charCodeAt(i)) & 0x7fffffff;
  }
  numId = Math.abs(numId % 2000000000);

  try {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.cancel({ notifications: [{ id: numId }] });
    }
  } catch (err) {
    console.warn('Failed to cancel notification:', err);
  }
}
