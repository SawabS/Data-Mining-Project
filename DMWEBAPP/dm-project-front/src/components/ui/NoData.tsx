import { NoDataProps } from "@/types/global";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Icon } from "iconsax-reactjs";
export default function NoData({ children, className, ...props }: NoDataProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle className="text-text">No Data</EmptyTitle>
        <EmptyDescription className="text-text">No Data Found</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
