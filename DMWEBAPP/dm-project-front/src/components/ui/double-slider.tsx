import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface DoubleSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
}

const DoubleSlider: React.FC<DoubleSliderProps> = ({
  className,
  value,
  defaultValue = [0, 100],
  min = 0,
  max = 100,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState<[number, number]>(
    value ?? defaultValue
  );
  // Update internalValue if controlled
  React.useEffect(() => {
    if (value) setInternalValue(value);
  }, [value]);

  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className
      )}
      onValueChange={(val) => setInternalValue(val as [number, number])}
      {...props}>
      <SliderPrimitive.Track className="bg-muted relative grow overflow-hidden rounded-full h-1.5 w-full">
        <SliderPrimitive.Range className="absolute bg-primary h-full" />
      </SliderPrimitive.Track>

      {internalValue.map((val, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="border-primary bg-background ring-ring/50 block w-4 h-4 rounded-full border shadow-sm hover:ring-4 focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative">
          {/* Label above thumb */}
          <div className="absolute -top-6 w-max text-sm font-medium text-gray-700 -translate-x-1/2 start-1/2">
            {val}
          </div>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
};

export { DoubleSlider };
