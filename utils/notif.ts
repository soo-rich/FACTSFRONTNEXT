import { addToast, ToastProps } from "@heroui/toast";

export default class Notif {
  static success(message: string) {
    return addToast({
      title: "Success",
      description: message,
      color: "success",
    });
  }

  static warning(message: string) {
    return addToast({
      title: "Attention",
      description: message,
      color: "warning",
    });
  }

  static danger(message: string) {
    return addToast({
      title: "Danger",
      description: message,
      color: "danger",
    });
  }

  static special(notif: ToastProps) {
    return addToast({ ...notif });
  }
}
