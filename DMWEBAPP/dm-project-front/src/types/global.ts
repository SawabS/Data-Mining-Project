import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  PropsWithChildren,
} from "react";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Toast, ToasterToast } from "@/components/ui/use-toast";

export type GlobalFormProps = {
  state?: "update" | "insert";
  onFinalClose?: () => void;
};

export type NoDataProps = PropsWithChildren<{}> &
  ComponentPropsWithoutRef<"div">;
export type TypographyProps = PropsWithChildren<{}> &
  ComponentPropsWithoutRef<"div">;
export type FormatMoneyProps = PropsWithChildren<{}> &
  ComponentPropsWithRef<"div">;

export type PaginationObject<T extends DataTypes> = {
  data: T;
  meta: {
    nextPageUrl: string;
    total: number;
  };
};

export type Status = 400 | 401 | 402 | 403 | 404 | 500;

export type PaginationType<T extends DataTypes> = InfiniteData<
  PaginationObject<T>
>;

export type LastPagePaginationType<T extends DataTypes> = PaginationObject<T>;

export type QueryResult<T extends DataTypes> = {
  isFetchingNextPage: boolean;
  data: PaginationType<T> | undefined;
  next: boolean;
  isLoading: boolean;
  refetch: (options?: RefetchOptions) => void;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult>;
};
export type DataTypes = any;

export type PaginationChildrenProps<T extends DataTypes> = Partial<{
  isLoading: boolean;
  refetch: (options?: RefetchOptions) => void;
  isSearched: boolean;
}> & {
  data: T[];
};

export type PaginationProps = {
  queryFn?: any;
  name?: string;
  tableName?: string;
  attrIds?: number[];
  page?: string;
  id?: number;
};

export type ActionModalProps = {
  name: string;
  queries?: QueryParam | null;
};

export type CalculatorProps = {
  money: number;
};

export type LoadingProps = PropsWithChildren<{
  screen?: boolean;
}> &
  ComponentPropsWithoutRef<"div">;

export type QueryProviderType = PropsWithChildren<{}>;

export type SideLink = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  part: string;
  section: string;
};

export type NestErrorMessage = string;

export type NestError<T = unknown, N = any> = AxiosError<T, N>;
export type Token = string;
export type RouterProviderType = {
  Component: ElementType;
};

export type ImageInForm = {
  image?: File;
};

export type ScreenSizes = "sm" | "md" | "lg" | "xl" | "xs";
export type Cookie = {
  name: string;
  token?: Token | null;
};

export type FormFinalOperation = {
  onClose?: () => void;
};

export type ToastType = ({ ...props }: Toast) => {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
};

export type CatchError = NestError | AxiosError;

export type HasImage<T extends boolean = true> = T extends true
  ? {
      image: string;
    }
  : Partial<{
      image: string;
    }>;

export type PaginationParams = { page: number; limit: number };
export type QueryParam = {
  [key: string]: string | number | boolean | undefined | number[];
};

export type TimeFrameFilters = {
  year?: string;
  month?: string;
  dayOfWeek?: string;
  timeOfDay?: 'day' | 'night';
};

export type ChangeDataState = "soft_delete" | "restore";
