import { cn } from "@/lib/utils";
import { LoadingProps } from "@/types/global";

const Loading = ({
  screen = false,
  className,
  children,
  ...props
}: LoadingProps) => {
  return (
    <div
      {...props}
      className={cn(
        `w-full flex flex-row justify-center items-center ${
          screen && "h-screen"
        }`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Loading;
