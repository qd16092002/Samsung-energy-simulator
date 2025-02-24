import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import Typography from "@/lib/typography";

export default function Footer() {

  return (
    <div className="w-full flex flex-row grow">
      <div className="lg:w-[300px] w-[250px] sm:hidden xs:hidden md:block"></div>
      <div className="w-full h-[32px] bg-white items-center text-center">
        <Typography textColor={TextColor.GREY_900} fontSize={FontSize.BASE} fontFamily={FontFamily.LIGHT}>Copyright © Samsung</Typography>
      </div>
    </div>
  )
}