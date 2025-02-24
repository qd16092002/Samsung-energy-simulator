"use client"
import { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import Typography from "@/lib/typography";
import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { closeAlert } from "@/redux/slice/alertSlice";

export default function Alert() {
    const alertData = useSelector((state: RootState) => state.alert);
    const dispatch = useDispatch();

    const handleCloseAlert = () => {
        dispatch(closeAlert());
    }

    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the open value to false
            dispatch(closeAlert());
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }
    }, [dispatch]);
    

    const renderAlertForm = (data: AlertState) => {
        switch (data.type) {
            case "error":
                return (
                    <div className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
                        <div className="bg-support-c200 px-4 pb-4 sm:pt-2 xs:pt-2 pt-5">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                    <ErrorIcon fontSize="large" color="error"></ErrorIcon>
                                </div>
                                <div className="md:mt-3 text-center sm:ml-4 sm:mt-0 xs:mt-0 sm:text-left">
                                    <Typography fontSize={FontSize.LG} fontFamily={FontFamily.BOLD} textColor={TextColor.SUPPORT_900}>{data.title}</Typography>
                                    <div className="mt-2">
                                        <Typography fontSize={FontSize.BASE} fontFamily={FontFamily.BOLD} textColor={TextColor.SUPPORT_800}>{data.message}</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "success":
                return (<div className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
                    <div className="bg-success-c50 px-4 pb-4 sm:pt-2 xs:pt-2 pt-5">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                <CheckCircleIcon fontSize="large" color="success"></CheckCircleIcon>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <Typography fontSize={FontSize.LG} fontFamily={FontFamily.BOLD} textColor={TextColor.SUCCESS_900}>{data.title}</Typography>
                                <div className="mt-2">
                                    <Typography fontSize={FontSize.BASE} fontFamily={FontFamily.BOLD} textColor={TextColor.SUCCESS_800}>{data.message}</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )
            default:
                return (<div className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
                    <div className="bg-primary-c50 px-4 pb-4 sm:pt-2 xs:pt-2 pt-5">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                <HelpIcon fontSize="large" color="info"></HelpIcon>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <Typography fontSize={FontSize.LG} fontFamily={FontFamily.BOLD} textColor={TextColor.PRIMARY_900}>{data.title}</Typography>
                                <div className="mt-2">
                                    <Typography fontSize={FontSize.BASE} fontFamily={FontFamily.BOLD} textColor={TextColor.PRIMARY_900}>{data.message}</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )
        }
    }

    return (
        <div className="fixed inset-0 z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true" hidden={!alertData.isOpen}>
        <div className="fixed z-50 w-screen">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
                {renderAlertForm(alertData)}
            </div>
        </div>
        <div className="fixed inset-0 transition-opacity z-0" onClick={handleCloseAlert}></div>
    </div>
    )
}