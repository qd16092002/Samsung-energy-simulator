"use client";
import Typography from "@/lib/typography";
import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { closeModal } from "@/redux/slice/modalSlice";
import CloseIcon from "@mui/icons-material/Close";


export default function Modal() {
  const modalData = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <div className={`fixed inset-0 z-50 ${modalData.isOpen ? 'flex items-center justify-center' : 'hidden'}`}
      aria-labelledby="modal-title" role="dialog" aria-modal="true" hidden={!modalData.isOpen}>
      {modalData.isOpen && (
        <>
          <div className="absolute inset-0 bg-white/40 z-10"></div>
          <div className={`relative z-50 ${modalData.screen} pointer-events-auto shadow-xl`}>
            <div className="bg-white rounded-lg overflow-hidden transform transition-all">
              <div className="sm:overflow-y-auto">
                <div className="px-4 py-4 sm:p-4 flex items-center justify-between border-b-2 border-b-grey-c100 ">
                  <Typography
                    fontSize={FontSize.LG}
                    fontFamily={FontFamily.BOLD}
                    textColor={TextColor.PRIMARY_900}
                  >
                    {modalData.title}
                  </Typography>
                  <CloseIcon onClick={handleCloseModal} className="hover:cursor-pointer" />
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                  {modalData.content}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
