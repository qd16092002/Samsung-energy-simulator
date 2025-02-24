import { BgColor } from "@/enum/setting";
import React, { memo, useMemo } from "react";

type Props = {
  loading: boolean;
  animation?: boolean;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  className?: string;
};

const Skeleton = ({
  loading,
  children,
  className,
  width,
  height,
  animation = true,
  variant = "rounded",
}: Props) => {
  const Animation = useMemo(() => {
    if (!animation) return "";
    return "animate-pulse";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Variant = useMemo(() => {
    return {
      text: "w-full h-3 rounded-md",
      circular: "w-25 h-25 rounded-full",
      rectangular: "w-full h-[60vh]",
      rounded: "w-full h-[60vh] rounded-lg",
    };
  }, []);

  const Width = useMemo(() => {
    if (width) return `!w-${width}`;
  }, [width]);
  const Height = useMemo(() => {
    if (height) return `!h-${height}`;
  }, [height]);

  return (
    <div
      className={
        loading
          ? `px-2 ${BgColor.GREY_200} ${Animation} ${Variant[variant]} ${Width} ${Height} ${className}`
          : ``
      }
    >
      {!loading && children}
    </div>
  );
};

const SkeletonTable = ({
  loading,
  children,
}: {
  loading: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={
        loading ? `flex flex-col ${BgColor.GREY_50} rounded-lg p-2` : ``
      }
    >
      <div className={loading ? "flex justify-between my-2 gap-2" : ``}>
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            loading={loading}
            animation
            variant="rounded"
            className="!h-12"
          ></Skeleton>
        ))}
      </div>
      <div className={loading ? "flex flex-col gap-2" : ``}>
        {[...Array(15)].map((_, index) => (
          <Skeleton
            key={index}
            loading={loading}
            animation
            variant="rounded"
            className="!h-10"
          ></Skeleton>
        ))}
      </div>
      {!loading && children}
    </div>
  );
};

export default memo(Skeleton);
export { SkeletonTable };
