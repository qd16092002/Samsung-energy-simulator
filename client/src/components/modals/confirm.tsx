"use client";
import RecommendIcon from "@mui/icons-material/Recommend";
import Typography from "@/lib/typography";
import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { closeConfirm } from "@/redux/slice/confirmSlice";
import CheckIcon from "@mui/icons-material/Check";
import storage from "@/services/storage";
import { useRouter } from "next/navigation";
import { LOGOUT } from "@/redux/actions/action";
import Cookie from "js-cookie";
import { useTranslations } from "next-intl";

export default function Confirm() {
  const confirmData = useSelector((state: RootState) => state.confirm);
  const dispatch = useDispatch();
  const t = useTranslations("EnergySimulator");

  const handleCloseAlert = () => {
    dispatch(closeConfirm());
  };

  const handleConfirm = () => {
    if (confirmData.onConfirm) {
      confirmData.onConfirm();
    }
    switch (confirmData.feature) {
      case LOGOUT:
        storage.clearStorage();
        const locale = Cookie.get("NEXT_LOCALE") || "vi";
        window.location.pathname = `/${locale}/login`;
        dispatch(closeConfirm());
        break;
      default:
        dispatch(closeConfirm());
        break;
    }
  };

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      hidden={!confirmData.isOpen}
    >
      <div className="fixed inset-0 z-50 px-[20px] md:px-0 flex items-center justify-center bg-grey-c900 bg-opacity-50">
        <div
          className="relative transform overflow-hidden rounded-2xl md:rounded-4xl h-[380px] md:h-[400px] text-left shadow-xl transition-all sm:w-full sm:max-w-lg bg-white"
        >
          <div className="bg-white px-[20px] pt-5 h-full flex flex-col">
            {/* Tiêu đề cố định */}
            <div className="flex-shrink-0">
              <Typography
                fontSize={FontSize.XL}
                fontFamily={FontFamily.BOLD}
                textColor={TextColor.GREY_900}
                className={`text-xl font-bold`}
              >
                {confirmData.title}
              </Typography>
            </div>

            {/* Nội dung cuộn */}
            <div className="flex-grow overflow-y-auto mt-4">
              <Typography
                fontSize={FontSize.SM}
                fontFamily={FontFamily.LIGHT}
                textColor={TextColor.GREY_800}
                className="text-[#6C757D] text-[16px] font-normal"
              >
                {confirmData.message}
              </Typography>
            </div>

            {/* Footer cố định */}
            <div className="flex-shrink-0 bg-white py-4 md:py-5 gap-2 justify-end items-end flex pointer-events-auto">
              <button
                type="button"
                onClick={handleCloseAlert}
                className="mt-3 inline-flex justify-center items-center rounded-full bg-[#EFF0F4] px-6 md:px-10 py-[14px] text-sm font-medium text-[#A8ABB2] shadow-sm hover:bg-support-300 sm:mt-0 sm:w-auto"
              >
                {t("decline")}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="mt-3 inline-flex justify-center items-center rounded-full bg-[#2582F3] px-6 md:px-10 py-[14px] text-sm font-medium text-white shadow-sm hover:bg-support-c800 sm:mt-0 sm:w-auto"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
