import { toast } from "react-toastify";

// No-op for toast notifications, kept for compatibility
export function requestNotificationPermission() {
  // No operation needed
}

export function showNotification(title, body) {
  toast.info(
    <div>
      <strong>{title}</strong>
      <div>{body}</div>
    </div>
  );
}