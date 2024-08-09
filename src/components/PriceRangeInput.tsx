import "@/assets/css/range-style.css";
import { useStateContext } from "@/contexts/ContextProvider";
import { useState } from "react";

interface PriceRangeInputProps {
  minPrice: number;
  maxPrice: number;
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  priceGap: number;
  priceMax: number;
}

export const PriceRangeInput = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  priceGap,
  priceMax,
}: PriceRangeInputProps) => {
  const [changeTimeout, setChangeTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [max, setMax] = useState(maxPrice);
  const [min, setMin] = useState(minPrice);
  const { currency } = useStateContext();

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rangeType: "min" | "max"
  ) => {
    const value = parseInt(e.target.value);
    if (rangeType === "min") {
      if (value <= maxPrice - priceGap) {
        setMin(value);
      }
    } else {
      if (value >= minPrice + priceGap) {
        setMax(value);
      }
    }

    if (changeTimeout) {
      clearTimeout(changeTimeout);
    }

    setChangeTimeout(
      setTimeout(() => {
        if (rangeType === "min") {
          if (value <= maxPrice - priceGap) {
            setMinPrice(value);
          }
        } else {
          if (value >= minPrice + priceGap) {
            setMaxPrice(value);
          }
        }
      }, 500)
    );
  };

  const rangeStyle: React.CSSProperties = {
    left: `${(min / priceMax) * 100}%`,
    right: `${100 - (max / priceMax) * 100}%`,
  };

  return (
    <div className="block" dir="ltr">
      <div className="h-6 flex flex-col justify-center">
        <div className="h-1 relative rounded bg-gray-300">
          <div
            className="h-full left-1/4 right-1/4 absolute rounded bg-blue-600"
            style={rangeStyle}
          ></div>
        </div>
        <div className="range-inputs relative">
          <input
            type="range"
            min="0"
            max={priceMax}
            value={min}
            onChange={(e) => handleRangeChange(e, "min")}
            aria-label="Minimum price"
          />
          <input
            type="range"
            min="0"
            max={priceMax}
            value={max}
            onChange={(e) => handleRangeChange(e, "max")}
            aria-label="Maximum price"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <div className="flex grow h-10 py-1.5 px-4 justify-center items-center rounded-md border border-neutral-200">
          <span className="text-neutral-700 text-base font-normal">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency?.name,
            }).format(min)}
          </span>
        </div>
        <div className="flex grow h-10 py-1.5 px-4 justify-center items-center rounded-md border border-neutral-200">
          <span className="text-neutral-700 text-base font-normal">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency?.name,
            }).format(max)}
          </span>
        </div>
      </div>
    </div>
  );
};
