import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="e25brwj">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="1s9ls5e">
            <div className="grid gap-1" data-oid="w8q1216">
              {title && <ToastTitle data-oid="xew0c64">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="5_1ydjg">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="z8rdx1u" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="l4r_t9-" />
    </ToastProvider>
  );
}
