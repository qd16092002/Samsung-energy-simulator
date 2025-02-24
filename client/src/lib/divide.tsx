import { BorderColor } from "@/enum/setting";
import { memo } from "react";

const Divide = function Divide() {

  return (
    <div className={`hidden border-b border-solid lg:block  ${BorderColor.GREY_200}`}></div>
  )
}

export default memo(Divide);