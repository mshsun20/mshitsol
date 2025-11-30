"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { closeSnackbar } from "@/redux/slices/snackbar";

export default function Snackbar() {
  const dispatch = useDispatch();
  const { open, message, severity, duration } = useSelector(
    (state: RootState) => state.snackbar
  );

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => dispatch(closeSnackbar()), duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, dispatch]);

  if (!open) return null;

  const styles = {
    success: {
      bg: "bg-green-600",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
    },
    error: {
      bg: "bg-red-600",
      icon: <XCircle className="w-6 h-6 text-white" />,
    },
    warning: {
      bg: "bg-yellow-600",
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
    },
    info: {
      bg: "bg-blue-600",
      icon: <Info className="w-6 h-6 text-white" />,
    },
  }[severity];

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        transform animate-slideDownFade
      `}
    >
      <div
        className={`
          ${styles.bg} text-white px-5 py-4 rounded-xl shadow-lg 
          flex items-center gap-4 min-w-[280px] max-w-[350px]
        `}
      >
        {styles.icon}

        <p className="flex-1 text-sm leading-snug">{message}</p>

        <button
          type="button"
          title="Close notification"
          aria-label="Close notification"
          onClick={() => dispatch(closeSnackbar())}
          className="opacity-80 hover:opacity-100 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
