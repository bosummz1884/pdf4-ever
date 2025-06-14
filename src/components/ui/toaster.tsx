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
    <ToastProvider data-oid="zmwp5z5">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="mxhl:mz">
            <div className="grid gap-1" data-oid="hufxpmm">
              {title && <ToastTitle data-oid="1c5vpr5">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="y6qzps6">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="b3xnpcr" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="57q4sa0" />
    </ToastProvider>
  );
}
