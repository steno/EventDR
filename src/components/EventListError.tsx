import { AlertCircle, RefreshCw } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface EventListErrorProps {
  dict: Dictionary;
  onRetry: () => void;
}

export function EventListError({ dict, onRetry }: EventListErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 mb-4">
        <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {dict.events.errorTitle || "Unable to load events"}
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-md mb-6">
        {dict.events.errorHint || "There was a problem loading events. Please check your connection and try again."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        <RefreshCw className="h-4 w-4" />
        {dict.events.retry || "Try Again"}
      </button>
    </div>
  );
}
