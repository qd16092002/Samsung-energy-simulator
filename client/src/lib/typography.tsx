import { TextColor, FontSize, FontFamily } from "@/enum/setting";
import { memo } from "react";

type Props = {
  children?: React.ReactNode;
  textColor?: TextColor | String;
  fontSize?: FontSize | String;
  fontFamily?: FontFamily;
  letterSpacing?: String;
  className?: String;
};

const Typography = function Typography({
  children,
  textColor = TextColor.GREY_700,
  fontSize = FontSize.BASE,
  fontFamily = FontFamily.MEDIUM,
  letterSpacing = "tracking-normal",
  className = "",
}: Props) {
  return (
    <div
      className={`${textColor} ${fontSize} ${fontFamily} ${letterSpacing} ${className}`}
    >
      {children}
    </div>
  );
};

export default memo(Typography);
