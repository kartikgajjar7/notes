import { AlertCircle } from "lucide-react";
interface FormErrorProps {
  message: string | undefined;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }
  return (
    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-md border border-red-200">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}
