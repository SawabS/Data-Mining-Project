import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { CircleX, Info, ThumbsUp } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        alertType = "info",
        description,
        action,
        ...props
      }) {
        return (
          <Toast
            onClick={() => dismiss(id)}
            className={`group p-4 !z-[5000] my-1 flex items-center mb-4 text-sm border space-x-2 rounded-lg
  ${
    alertType === "info"
      ? "border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 text-blue-800 dark:text-blue-400 shadow-[0_0_0_1px_theme(colors.blue.300),0_0_8px_0_theme(colors.blue.200)] dark:shadow-[0_0_0_1px_theme(colors.blue.800),0_0_12px_0_theme(colors.blue.900)]"
      : alertType === "error"
      ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-gray-800 text-red-800 dark:text-red-400 shadow-[0_0_0_1px_theme(colors.red.300),0_0_8px_0_theme(colors.red.200)] dark:shadow-[0_0_0_1px_theme(colors.red.800),0_0_12px_0_theme(colors.red.900)]"
      : "border-green-300 dark:border-green-800 bg-green-50 dark:bg-gray-800 text-green-800 dark:text-green-400 shadow-[0_0_0_1px_theme(colors.green.300),0_0_8px_0_theme(colors.green.200)] dark:shadow-[0_0_0_1px_theme(colors.green.800),0_0_12px_0_theme(colors.green.900)]"
  }
  transition-shadow duration-300 hover:shadow-[0_0_0_2px_currentColor,0_0_12px_0_currentColor]`}
            key={id}
            {...props}>
            <ToastDescription>
              <p>{description}</p>
            </ToastDescription>

            {alertType == "info" ? (
              <Info className="min-w-4 min-h-4" />
            ) : alertType == "error" ? (
              <CircleX className="min-w-4 min-h-4" />
            ) : (
              <ThumbsUp className="min-w-4 min-h-4" />
            )}
            {action}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
