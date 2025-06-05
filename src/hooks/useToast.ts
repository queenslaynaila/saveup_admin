import { useCallback, useState } from "react";
import type { Message } from "../components/Cards/Toast";

const useToasts = () => {
  const [toasts, setToasts] = useState<Message[]>([]);

  const addToast = useCallback((msg: string, type: Message["type"]) => {
    setToasts(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        message: msg,
        type,
      },
    ]);
  }, []);

  const removeToast = useCallback((index: number) => {
    setToasts(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
};

export default useToasts;
