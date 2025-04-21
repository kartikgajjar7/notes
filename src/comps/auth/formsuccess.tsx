import { CheckCircle } from "lucide-react";
interface FormSuccessProps {
  message: string | undefined;
}

export default function FormSuccess({ message }: FormSuccessProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-2 rounded-md border border-green-200">
      <CheckCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}
