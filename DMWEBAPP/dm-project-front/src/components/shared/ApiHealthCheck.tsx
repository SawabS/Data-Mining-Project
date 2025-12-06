import { useEffect, useState } from "react";
import { api } from "@/lib/config/api.config";
import { ENUMs } from "@/lib/enums";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const ApiHealthCheck = () => {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const baseUrl = ENUMs.GLOBAL.API.replace("/api", "");
        const response = await api.get(baseUrl);
        if (response.status === 200) {
          setStatus("online");
          setMessage("Backend API is connected and responding");
        }
      } catch (error: any) {
        setStatus("offline");
        setMessage(
          `Backend API connection failed: ${error.message || "Unknown error"}`
        );
        console.error("API Health Check Failed:", error);
      }
    };

    checkApi();
  }, []);

  if (status === "checking") {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking API Connection...</AlertTitle>
        <AlertDescription>Verifying backend connectivity</AlertDescription>
      </Alert>
    );
  }

  if (status === "offline") {
    return (
      <Alert variant="destructive" className="mb-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Backend Offline</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-600">Backend Online</AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-400">
        {message}
      </AlertDescription>
    </Alert>
  );
};
