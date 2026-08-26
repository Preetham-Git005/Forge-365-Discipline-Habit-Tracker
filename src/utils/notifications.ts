import { sound } from './sound';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
};

export const sendHabitReminderNotification = (
  habitTitle: string,
  timeOfDay: string,
  playSound: boolean = true
) => {
  if (playSound) {
    sound.playComplete(true);
  }

  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      new Notification('⚔️ FORGE 365 Discipline Reminder', {
        body: `Time for your non-negotiable habit: "${habitTitle}" (${timeOfDay}). Do not negotiate with weakness.`,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E63946'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>",
        badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E63946'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>",
        tag: `habit-reminder-${habitTitle}`,
        requireInteraction: false
      });
    } catch {
      // Fallback
    }
  }
};

export const formatTime12h = (time24: string): string => {
  if (!time24) return '';
  const [hourStr, minuteStr] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (isNaN(hour) || isNaN(minute)) return time24;
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : `${minute}`;
  return `${displayHour}:${displayMinute} ${period}`;
};
