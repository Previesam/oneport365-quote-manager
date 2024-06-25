import { createContext, useContext, useState } from "react";
// import { v4 as uuid } from "uuid";
import Snackbar from "../components/snackbar";

const TIMEOUT = 5000;

export interface Notification {
  message: string;
  type?: "error" | "info" | "success";
  options?: NotificationOptions;
  id: string | null;
  show?: boolean;
}

export interface NotificationAction {
  type: "link" | "button";
  action: (() => void) | string;
  text: string;
  closeOnClick?: boolean;
}

export interface NotificationOptions {
  timeout?: number | "never";
  actions?: NotificationAction[];
}

export interface NotificationContext {
  notifications: Notification[];
  notify: (data: Notification) => void;
  showErrorMessage: (
    message: string | string[],
    options?: NotificationOptions
  ) => void;
  showSuccessMessage: (
    message: string | string[],
    options?: NotificationOptions
  ) => void;
  showInfoMessage: (
    message: string | string[],
    options?: NotificationOptions
  ) => void;
  close: (id: string | null) => void;
}

export const NotificationContext = createContext<NotificationContext>({
  notifications: [],
  notify: () => {},
  showErrorMessage: () => {},
  showSuccessMessage: () => {},
  showInfoMessage: () => {},
  close: () => {},
});

export default function NotificationProvider({ children }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function notify(data: Notification) {
    data.id = "message-element-" + new Date().toISOString() + Math.random();
    data.type = data.type || "info";
    data.options = {
      ...data?.options,
      timeout: data?.options?.timeout || TIMEOUT,
    };
    data.show = true;
    setNotifications([...notifications, data]);
  }

  function close(id: string | null) {
    if (!id) return;
    setNotifications((prev) =>
      [...prev].map((item) => {
        if (item.id === id) {
          item.show = false;
        }
        return item;
      })
    );
  }

  function showSuccessMessage(
    message: string | string[],
    options?: NotificationOptions
  ) {
    if (typeof message === "string") {
      const data: Notification = {
        message,
        type: "success",
        options: {
          ...options,
          timeout: options?.timeout || TIMEOUT,
        },
        id: null,
      };
      notify(data);
    } else {
      const messages = [...notifications];

      for (const item of message) {
        messages.push({
          message: item,
          type: "success",
          options: {
            ...options,
            timeout: options?.timeout || TIMEOUT,
          },
          id: "message-element-" + new Date().toISOString() + Math.random(),
          show: true,
        });
      }

      setNotifications(messages);
    }
  }

  function showErrorMessage(
    message: string | string[],
    options?: NotificationOptions
  ) {
    if (typeof message === "string") {
      const data: Notification = {
        message,
        type: "error",
        options: {
          ...options,
          timeout: options?.timeout || TIMEOUT,
        },
        id: null,
      };
      notify(data);
    } else {
      const messages = [...notifications];

      for (const item of message) {
        messages.push({
          message: item,
          type: "error",
          options: {
            ...options,
            timeout: options?.timeout || TIMEOUT,
          },
          id: "message-element-" + new Date().toISOString() + Math.random(),
          show: true,
        });
      }

      setNotifications(messages);
    }
  }

  function showInfoMessage(
    message: string | string[],
    options?: NotificationOptions
  ) {
    if (typeof message === "string") {
      const data: Notification = {
        message,
        type: "info",
        options: {
          ...options,
          timeout: options?.timeout || TIMEOUT,
        },
        id: null,
      };
      notify(data);
    } else {
      const messages = [...notifications];

      for (const item of message) {
        messages.push({
          message: item,
          type: "info",
          options: {
            ...options,
            timeout: options?.timeout || TIMEOUT,
          },
          id: "message-element-" + new Date().toISOString() + Math.random(),
          show: true,
        });
      }

      setNotifications(messages);
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notify,
        showSuccessMessage,
        showErrorMessage,
        showInfoMessage,
        close,
      }}
    >
      <Snackbar />
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
