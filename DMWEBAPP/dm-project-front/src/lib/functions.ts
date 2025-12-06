import { NestError, ToastType, QueryParam } from "@/types/global";
import { QueryClient } from "@tanstack/react-query";
const { VITE_API_IMAGE_URL } = import.meta.env;

export const imageSrc = (image?: string) => {
  if (!image) {
    return "/images/placeholder.svg";
  }
  const isUnsplashUrl =
    image.startsWith("https://images.unsplash.com/") ||
    image.startsWith("https://unsplash.com/") ||
    image.startsWith("https://plus.unsplash.com/");
  if (isUnsplashUrl) {
    return image;
  } else {
    return `${VITE_API_IMAGE_URL}${image}`;
  }
};

type ValidationErrorItem = {
  field: string;
  messages: string[];
};

export type ErrorResponse =
  | { message: string[] }
  | Record<string, string>
  | { message: ValidationErrorItem[] };

export const generateNestErrors = (error: NestError, toast: ToastType) => {
  const errorData = error.response?.data as ErrorResponse;
  if (!errorData) return;

  const { message } = errorData;
  if (!message) return;

  // Case 1: message is a single string
  if (typeof message === "string") {
    toast({
      title: "Error",
      description: message,
      alertType: "error",
    });
    return;
  }

  // Case 2: message is string[]
  if (Array.isArray(message) && message.every((m) => typeof m === "string")) {
    message.forEach((msg) =>
      toast({
        title: "Error",
        description: msg,
        alertType: "error",
      })
    );
    return;
  }

  // Case 3: message is ValidationErrorItem[]
  if (
    Array.isArray(message) &&
    message.every(
      (m): m is ValidationErrorItem =>
        typeof m !== "string" && "field" in m && "messages" in m
    )
  ) {
    message.forEach((item) => {
      item.messages.forEach((msg) =>
        toast({
          title: item.field,
          description: msg,
          alertType: "error",
        })
      );
    });
    return;
  }

  // Case 4: message is object { [key: string]: string }
  if (typeof message === "object") {
    Object.entries(message).forEach(([key, value]) => {
      toast({
        title: key,
        description: String(value),
        alertType: "error",
      });
    });
  }
};

export const generateMutationSuccessToast = (
  lang: string,
  toast: ToastType,
  message?: string | number
) => {
  if (message == 1) return;
  if (message) {
    return toast({
      title: lang == "en" ? "Success" : lang == "ar" ? "نجاح" : "سەرکەوتوو",
      description: message,
      alertType: "success",
    });
  }
  return toast({
    title: lang == "en" ? "Success" : lang == "ar" ? "نجاح" : "سەرکەوتوو",
    description:
      lang == "en"
        ? "Operation Success"
        : lang == "ar"
        ? "العملیة تمت بنجاح"
        : "کرادەرەکە سەرکەوتووبوو",
    alertType: "success",
  });
};

export const invalidateQueries = async (
  queryClient: QueryClient,
  name: string
) => {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey: any = query.queryKey[0];
      const isMatch =
        typeof queryKey === "string"
          ? queryKey === name || queryKey.includes(name)
          : queryKey.some((key: string) => key.includes(name));

      return isMatch;
    },
  });
};

export const buildQueryString = (params: QueryParam): string => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== "")
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`
        );
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");
};
