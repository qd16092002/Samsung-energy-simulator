import {
  capacityOptions,
  capacityOptions2,
  energyStarOptions,
  gradeOptions,
  modelCodeOptions,
  purchasedYearOptions,
} from "@/enum/constants";
import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import Button from "@/lib/button";
import Divide from "@/lib/divide";
import Select from "@/lib/select";
import TextField from "@/lib/text-field";
import Typography from "@/lib/typography";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export default function Main() {
  const router = useRouter();
  const Chart = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="flex space-x-8">
          {/* Cột Existing */}
          <div className="flex flex-col items-start">
            <div className="relative mb-5">
              <div className="p-2 bg-white shadow-md rounded text-sm font-medium text-primary-c500">
                4,800,000 Vnd
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-md"></div>
            </div>
            {/* Cột */}
            <div className="flex flex-row items-end">
              <div className="w-[100px] h-[358px] bg-support-c200 translate-x-[8px]"></div>
              <Image src={"/shadow.png"} alt="shadow" width={69} height={69} />
            </div>
            <div className="mt-2 w-[120px] text-center text-sm font-medium text-gray-600">
              Existing
            </div>
          </div>

          {/* Cột New */}
          <div className="flex flex-col items-start">
            <div className="relative mb-5">
              <div className="p-2 bg-white shadow-md rounded text-sm font-medium text-primary-c500">
                2,260,000 Vnd
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-md"></div>
            </div>
            {/* Cột */}
            <div className="flex flex-row items-end">
              <div className="relative w-[100px] h-[358px] bg-primary-c100 translate-x-[8px]">
                {/* Phần giảm */}
                <div
                  className="absolute top-0 w-full bg-primary-c200 flex items-center justify-center text-sm text-blue-600 font-semibold rounded-t"
                  style={{ height: "35.8%" }}
                >
                  35,8% <span className="text-red-500">⬇</span>
                </div>
                {/* Phần còn lại */}
                <div
                  className="absolute bottom-0 w-full bg-primary-c500 flex items-center justify-center rounded-b text-sm text-blue-600 font-semibold"
                  style={{ height: "64.2%" }}
                >
                  64.2%
                </div>
              </div>
              <Image src={"/shadow.png"} alt="shadow" width={69} height={69} />
            </div>

            <div className="mt-2 w-[120px] text-center text-sm font-medium text-gray-600">
              New
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ComparisonCard = ({
    existingValue,
    newValue,
    costSave,
    paybackPeriod,
    existingColor = "support-c200",
    newColor = "primary-c500",
  }: {
    existingValue: number;
    newValue: number;
    costSave: string;
    paybackPeriod: number;
    existingColor?: string;
    newColor?: string;
  }) => {
    return (
      <div className="flex flex-col md:flex-row items-center justify-end gap-4">
        <div
          className={`bg-${existingColor} w-full md:w-[249px] text-center md:min-h-[408px] p-6 rounded-lg`}
        >
          <Typography
            textColor={TextColor.GREY_900}
            fontSize={FontSize.BASE}
            fontFamily={FontFamily.SEMI_BOLD}
            className={"mb-[18px]"}
          >
            Existing
          </Typography>
          <Typography
            textColor={TextColor.GREY_900}
            fontSize={FontSize.XL}
            fontFamily={FontFamily.BOLD}
          >
            VND {existingValue}
          </Typography>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={"/exchange-horizontal.png"}
            alt="arrow"
            width={30}
            height={30}
          />
        </div>
        <div
          className={`bg-${newColor} md:min-h-[408px] w-full md:w-[249px] text-center text-white p-6 rounded-lg`}
        >
          <Typography
            textColor={TextColor.WHITE}
            fontSize={FontSize.BASE}
            fontFamily={FontFamily.SEMI_BOLD}
            className={"mb-[18px]"}
          >
            New
          </Typography>
          <Typography
            textColor={TextColor.WHITE}
            fontSize={FontSize.XL}
            fontFamily={FontFamily.BOLD}
            className={"mb-[18px]"}
          >
            VND {newValue}
          </Typography>
          <Divide />
          <div className="flex mt-[18px] flex-col items-start gap-1">
            <Typography
              textColor={TextColor.WHITE}
              fontSize={FontSize.SM}
              fontFamily={FontFamily.LIGHT}
            >
              Annual cost save
            </Typography>
            <div className="flex justify-start gap-4">
              <Typography
                textColor={TextColor.WHITE}
                fontSize={FontSize.SM}
                fontFamily={FontFamily.BOLD}
              >
                Vnd {costSave}
              </Typography>
              <Typography
                textColor={TextColor.WHITE}
                fontSize={FontSize.SM}
                fontFamily={FontFamily.SEMI_BOLD}
              >
                35,8%
              </Typography>
            </div>
          </div>
          <div className="flex mt-[18px] flex-col items-start gap-1">
            <Typography
              textColor={TextColor.WHITE}
              fontSize={FontSize.SM}
              fontFamily={FontFamily.LIGHT}
              className={"text-start"}
            >
              Expected payback period
            </Typography>
            <Typography
              textColor={TextColor.WHITE}
              fontSize={FontSize.SM}
              fontFamily={FontFamily.BOLD}
            >
              {paybackPeriod} years
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full p-[50px] md:pl-[130px] gap-[29px]">
      <div className="w-[280px]">
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
        >
          Prev
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col mb-10">
          <Typography
            textColor={TextColor.GREY_900}
            fontSize={FontSize.XL_2}
            fontFamily={FontFamily.BOLD}
            className="text-white text-xl sm:text-3xl md:text-4xl md:text-grey-c900 mb-0.5"
          >
            Result
          </Typography>
          <Typography
            textColor={TextColor.PRIMARY_900}
            fontSize={FontSize.XL}
            fontFamily={FontFamily.SEMI_BOLD}
          >
            Model code : AR13CYECAWKNSV
          </Typography>
        </div>
        <div className="flex justify-center items-start">
          <Image
            alt="Logo"
            src="/air-condition.png"
            height={146}
            width={413}
            priority
          />
        </div>
      </div>
      <div className="flex flex-col-reverse w-full md:justify-between md:flex-row gap-10 h-auto md:items-end">
        <Chart />
        <div className="flex flex-col md:flex-row gap-10 md:min-h-[408px] md:items-start">
          <ComparisonCard
            existingValue={4_800_000}
            newValue={2_260_000}
            costSave="1,000,000"
            paybackPeriod={2}
          />
        </div>
      </div>
    </div>
  );
}
