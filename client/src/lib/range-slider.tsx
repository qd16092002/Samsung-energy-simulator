import {
  BgColor,
  BorderColor,
  FontFamily,
  FontSize,
  TextColor,
} from "@/enum/setting";
import React, { useMemo, useState } from "react";
import Typography from "./typography";

type Props = {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  subLabel?: string;
};

const RangeSlider = ({ value, onChange, label, subLabel }: Props) => {
  const [valueState, setValue] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
    onChange(parseInt(e.target.value));
  };
  const Width = useMemo(() => {
    return `w-[${value}%]`;
  }, [value]);

  return (
    <div className="flex flex-col sm:w-[100%] lg:w-[2/3] xl:w-2/3">
      <div className="flex flex-row justify-between">
        <div>
          <Typography
            textColor={TextColor.PRIMARY_500}
            fontSize={FontSize.LG}
            fontFamily={FontFamily.BOLD}
          >
            {label}
          </Typography>
          <Typography textColor={TextColor.GREY_500} fontSize={FontSize.BASE}>
            {subLabel}
          </Typography>
        </div>
        <div
          className={`flex flex-row rounded-lg border ${BorderColor.GREY_300} border-primary-300 px-3 justify-center items-center`}
        >
          <input
            type="number"
            min="0"
            step="1"
            value={value <= 0 ? "0" : value > 100 ? "100" : value.toString()}
            className={`${TextColor.PRIMARY_500} ${FontFamily.BOLD} w-14 border-none outline-none`}
            onChange={(e) => {
              onChange(
                parseInt(e.target.value) < 0
                  ? 0
                  : parseInt(e.target.value) > 100
                  ? 100
                  : e.target.value === ""
                  ? 0
                  : parseInt(e.target.value)
              );
            }}
          />
          <Typography textColor={TextColor.GREY_500}>%</Typography>
        </div>
      </div>
      <div className="mb-6">
        <input
          id="default-range"
          type="range"
          value={value}
          onChange={handleChange}
          className={`w-full h-1 mb-6 rounded-lg appearance-none cursor-pointer range-sm 
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:hover:w-4
          [&::-webkit-slider-thumb]:active:bg-primary-c700
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:hover:h-4
          [&::-webkit-slider-thumb]:-mt-0.5
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_#2D7D9F]
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:duration-150
          [&::-webkit-slider-thumb]:ease-in-out          
         `}
          style={{
            background: `linear-gradient(to right, #2D7D9F ${value}%, #C0D8E3 ${value}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
