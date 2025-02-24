"use client";
import {
  capacityOptions,
  gradeOptions,
  monthsOptions,
  nations,
  purchasedYearOptions,
  maxMonthlyBill,
} from "@/enum/constants";
import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import Button from "@/lib/button";
import Divide from "@/lib/divide";
import Select from "@/lib/select";
import TextField from "@/lib/text-field";
import Typography from "@/lib/typography";
import { Form, Formik, getIn } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import api from "@/services/api";
import Image from "next/image";
import storage from "@/services/storage";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { closeConfirm, openConfirm } from "@/redux/slice/confirmSlice";
import { Rating, styled } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { Star } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { GradientStar, GradientStarBorder } from "@/lib/star-icon";

const validationSchema = yup.object().shape({
  monthlyBill: yup
    .number()
    .required("Monthly bill is required")
    .positive("Monthly bill must be a positive number")
    .integer("Monthly bill must be an integer"),

  annualAirConditioner: yup
    .number()
    .required("Annual air conditioner usage is required")
    .positive("Annual air conditioner usage must be a positive number")
    .integer("Annual air conditioner usage must be an integer"),

  portionOfAC: yup.number().required("Portion of AC is required"),

  existingAirConditioner: yup.object().shape({
    year: yup.number().required("Year is required"),
    capacity: yup.string().required("Capacity is required"),
    energyStar: yup.string().required("Energy star is required"),
    // isInverter: yup
    //   .boolean()
    //   .nullable()
    //   .required("You must select either Inverter or Non-Inverter"),
  }),

  newAirConditioner: yup.object().shape({
    modelCode: yup
      .string()
      .required("Model code is required")
      .matches(
        /^[A-Z0-9]+$/,
        "Model code must only contain uppercase letters and numbers"
      ),
  }),
});
function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}
export default function Main() {
  const userInfo = useMemo(() => storage.getUserInfo(), []);
  const national = userInfo?.national;
  const t = useTranslations("EnergySimulator");
  const currency =
    nations.find(
      (item) =>
        item?.id === national?.id || item?.national === national?.national
    )?.currency ?? "Dong";
  const [listYear, setListYear] = useState<{ value: string; label: string }[]>(
    []
  );
  const [listCapacity, setListCapacity] = useState([]);
  const [listEnergyStar, setListEnergyStar] = useState([]);
  const [listModelCode, setListModelCode] = useState([]);
  const [listGrade, setListGrade] = useState([]);
  const [listNewCapacity, setListNewCapacity] = useState([]);
  const [resultId, setResultId] = useState(null);
  const [calculateData, setCalculateData] = useState({
    energyConsumption: 0,
    paybackPeriod: 0,
    existCost: 0,
    saveCost: 0,
    newCost: 0,
  });
  const [currentStep, setCurrentStep] = useState(0);

  const getAllYear = async (capacity?: string, energyStar?: any) => {
    try {
      const queryParams = new URLSearchParams();
      if (capacity && capacity !== "") queryParams.append("capacity", capacity);
      if (energyStar && energyStar !== "")
        queryParams.append("energyStar", energyStar);

      const { data } = await api.get(
        `/energy-data/all-year?${queryParams.toString()}`
      );

      const list = data.data.map((item: any) => ({
        value: item,
        label: item,
      }));

      setListYear(list);
    } catch (error) {
      console.error("Error fetching all years:", error);
    }
  };

  const convertToTons = (kW: number): string => {
    const tons = kW * 0.295;

    const roundedTons = Math.round(tons * 2) / 2;

    return roundedTons.toFixed(1);
  };

  const getAllCapacity = async (
    energyStar?: any,
    year?: string,
    formik?: any
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (energyStar && energyStar !== "")
        queryParams.append("energyStar", energyStar);
      if (year && year !== "") queryParams.append("year", year.toString());

      const { data } = await api.get(
        `/energy-data/all-capacity?${queryParams.toString()}`
      );

      const sortedData = data.data.sort((a: string, b: string) => {
        return parseFloat(a) - parseFloat(b);
      });

      const list = sortedData.map((item: number) => {
        const tons = convertToTons(item);
        return {
          value: item,
          label:
            national?.national === "IND"
              ? `${item}kW(${tons}T)`
              : Number(item).toLocaleString(),
        };
      });

      setListCapacity(list);

      if (formik) {
        console.log(formik.values);
        const existingCapacity =
          formik.values?.existingAirConditioner?.capacity;
        const isMatching = list.some(
          (item: any) => item.value === existingCapacity
        );

        console.log(isMatching);

        if (!isMatching) {
          formik.setFieldValue("existingAirConditioner.capacity", "");
          formik.setFieldValue("newAirConditioner.capacity", "");
          formik.setFieldValue("newAirConditioner.grade", "");
          formik.setFieldValue("newAirConditioner.modelCode", "");
          formik.setFieldValue("newAirConditioner.energyStar", "");
          getAllGrade();
          getAllModelCode();
        }
      }
    } catch (error) {
      console.error("Error fetching all capacities:", error);
    }
  };
  const getAllStarClass = async (
    capacity?: string,
    year?: string,
    formik?: any
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (capacity && capacity !== "") queryParams.append("capacity", capacity);
      if (year && year !== "") queryParams.append("year", year.toString());

      const { data } = await api.get(
        `/energy-data/all-star-class?${queryParams.toString()}`
      );

      const sortedData = data.data.sort((a: string, b: string) => {
        const extractNumber = (str: string): number => {
          const match = str.match(/[\d]+/g);
          return match ? parseInt(match[0], 10) : Infinity;
        };

        return extractNumber(a) - extractNumber(b) || a.localeCompare(b);
      });

      const list = sortedData.map((item: string) => ({
        value: item,
        label: item,
      }));

      setListEnergyStar(list);

      if (formik) {
        const existingEnergyStar =
          formik.values?.existingAirConditioner?.energyStar;
        const isMatching = list.some(
          (item: any) => item.value === existingEnergyStar
        );

        if (!isMatching) {
          formik.setFieldValue("existingAirConditioner.energyStar", "");
        }
      }
    } catch (error) {
      console.error("Error fetching all star classes:", error);
    }
  };

  const getAllCapacityNew = async (modelCode?: string) => {
    try {
      const { data } = modelCode
        ? await api.get(`/models/all-capacity?modelCode=${modelCode}`)
        : await api.get("/models/all-capacity");
      const list = data.data.map((item: any) => {
        return {
          value: item,
          label: item,
        };
      });
      setListNewCapacity(list);
    } catch (error) {
      console.error("Error fetching all model codes:", error);
    }
  };

  const getAllGrade = async (capacity?: string) => {
    try {
      const { data } = capacity
        ? await api.get(`/models/all-grade?capacity=${capacity}`)
        : await api.get(`/models/all-grade`);

      const sortedOrder = ["Premium", "Standard", "Mass"];

      const list = data.data
        .sort(
          (a: string, b: string) =>
            sortedOrder.indexOf(a) - sortedOrder.indexOf(b)
        )
        .map((item: any) => {
          return {
            value: item,
            label: item,
          };
        });

      setListGrade(list);
    } catch (error) {
      console.error("Error fetching all grades:", error);
    }
  };

  const getAllModelCode = async (grade?: string, capacity?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (grade && grade !== "") queryParams.append("grade", grade.toString());
      if (capacity && capacity !== "") queryParams.append("capacity", capacity);

      const { data } = await api.get(
        `/models/all-modelCode?${queryParams.toString()}`
      );
      const list = data.data.map((item: any) => {
        return {
          value: item,
          label: item,
        };
      });
      setListModelCode(list);
    } catch (error) {
      console.error("Error fetching all model codes:", error);
    }
  };

  const getModelData = async (modelCode: string, formik: any) => {
    try {
      const { data } = await api.get(`/models/${modelCode}`);
      formik.setFieldValue("newAirConditioner.capacity", data.data.capacity);
      formik.setFieldValue("newAirConditioner.grade", data.data.grade);
      formik.setFieldValue(
        "newAirConditioner.energyStar",
        data.data.energyStar
      );
    } catch (error) {
      console.error(
        `Error fetching model data for modelCode: ${modelCode}`,
        error
      );
    }
  };

  useEffect(() => {
    getAllYear();
    getAllCapacity();
    getAllStarClass();
    getAllModelCode();
    getAllCapacityNew();
    getAllGrade();
  }, []);
  const [rated, setRated] = useState(false);
  const handleClickSendRating = (rating: number) => {
    api
      .post("/score", { score: rating * 2, resultId: resultId })
      .then(() => { })
      .catch(() => { });
  };

  const initialValues = useMemo(
    () => ({
      monthlyBill: "",
      annualAirConditioner: "",
      portionOfAC: "",
      existingAirConditioner: {
        year: "",
        capacity: "",
        energyStar: "",
        isInverter: false,
      },
      newAirConditioner: {
        capacity: "",
        grade: "",
        modelCode: "",
        energyStar: "",
        calculation: false,
        paybackPeriod: null,
      },
    }),
    []
  );
  const checkNextButtonAbility = (formik: any) => {
    if (currentStep === 0) {
      return (
        Boolean(formik.values.existingAirConditioner.capacity) &&
        Boolean(formik.values.existingAirConditioner.year) &&
        Boolean(formik.values.existingAirConditioner.energyStar)
      );
    } else if (currentStep === 1) {
      return (
        Boolean(formik.values.monthlyBill) &&
        Boolean(formik.values.annualAirConditioner) &&
        Boolean(formik.values.portionOfAC)
      );
    }
  };

  const dispatch = useDispatch();

  const onSubmit = (values: any) => {
    let confirm: ConfirmState = {
      isOpen: true,
      title: t("disclaimer"),
      message: t("disclaimerContent"),
      feature: "",
      onConfirm: () => {
        const possibleInverterValues = [
          values.existingAirConditioner.isInverter,
          false,
          true,
          null,
        ];
        const triedValues = new Set();
        let resultFound = false;

        const tryApiCall = async (currentIndex: number) => {
          if (currentIndex >= possibleInverterValues.length || resultFound)
            return;

          const currentInverterValue = possibleInverterValues[currentIndex];

          if (triedValues.has(currentInverterValue)) {
            return tryApiCall(currentIndex + 1);
          }

          triedValues.add(currentInverterValue);

          const variables = {
            monthlyBill: values.monthlyBill,
            annualAirConditioner: values.annualAirConditioner,
            portionOfAC: values.portionOfAC,
            modelCode: values.newAirConditioner.modelCode,
            newModelPrice: values.newAirConditioner.paybackPeriod,
            existingAirConditioner: {
              year: values.existingAirConditioner.year,
              capacity: values.existingAirConditioner.capacity,
              energyStar: values.existingAirConditioner.energyStar,
              isInverter:
                national?.national === "THA" ? currentInverterValue : null,
            },
          };

          await api
            .post("/models/calculate-energy", variables)
            .then((response) => {
              if (response.status === 404) {
                tryApiCall(currentIndex + 1);
              } else if (response.data) {
                dispatch(closeConfirm());
                setRated(false);
                setRating(4);
                setCurrentStep(3);
                setCalculateData(response.data.data);
                setResultId(response.data.data.resultId);
                resultFound = true;
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 404) {
                tryApiCall(currentIndex + 1);
              } else {
                alert("An error occurred, please try again.");
              }
            });
        };

        tryApiCall(0);
      },
    };

    dispatch(openConfirm(confirm));
  };

  const [rating, setRating] = useState(4);

  const Chart = ({
    existCost,
    newCost,
  }: {
    existCost: number;
    newCost: number;
  }) => {
    const percentage = (100 - (newCost / existCost) * 100).toFixed(1);
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mb-[41px]">
          <Typography
            textColor={TextColor.GREY_800}
            fontSize={FontSize.XL_2}
            fontFamily={FontFamily.SEMI_BOLD}
            className={`text-[#333333] text-2xl font-semibold`}
          >
            {t("annualCostSave")}
          </Typography>
        </div>
        <div className="flex">
          {/* Cột Existing */}
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-end">
              <div className="min-w-[100px] h-[358px] items-start px-[19px] border border-[#BABABA] flex flex-col justify-center text-start bg-gradient-to-b from-[#F8F8F8] to-[#C5C5C5] translate-x-[8px]">
                <Typography
                  fontSize={FontSize.BASE}
                  fontFamily={FontFamily.MEDIUM}
                  className={`text-[#333333] text-base font-medium`}
                >
                  {currency}
                </Typography>
                <Typography
                  textColor={TextColor.GREY_900}
                  fontSize={FontSize.XL}
                  fontFamily={FontFamily.BOLD}
                  className={`text-[#333333] text-xl font-bold`}
                >
                  {formatCurrency(existCost)}
                </Typography>
              </div>
              <Image src={"/shadow.png"} alt="shadow" width={69} height={69} />
            </div>
            <div className="mt-2 w-[120px] translate-x-[8px] text-center text-sm font-medium text-gray-600">
              <Typography
                textColor={TextColor.GREY_800}
                fontSize={FontSize.BASE}
                fontFamily={FontFamily.SEMI_BOLD}
                className={`text-[#333333] text-base font-semibold`}
              >
                {t("existing")}
              </Typography>
            </div>
          </div>
          <div className="items-start -translate-x-[24px] mt-10 hidden md:flex">
            <Image src={"/arrow_down.svg"} alt="arrow" width={47} height={90} />
          </div>

          {/* Cột New */}
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-end">
              <div className="min-w-[100px] h-[358px] flex flex-col bg-[#E3FFF4] translate-x-[8px]">
                {/* Phần giảm */}
                <div
                  className="w-full bg-primary-c200 flex items-center justify-center text-[26px] text-[#134D3F] font-bold text-end border border-[#29A587]"
                  style={{ height: `${percentage}%` }}
                >
                  {percentage}
                  <span className="text-[#134D3F] font-normal text-base">
                    %
                  </span>
                </div>
                {/* Phần còn lại */}
                <div
                  className="w-full text-start px-[19px] text-white bg-gradient-to-b from-[#29A587] to-[#103F34] flex flex-col items-start justify-center rounded-b text-sm font-semibold"
                  style={{ height: `${100 - Number(percentage)}%` }}
                >
                  <Typography
                    textColor={TextColor.GREY_900}
                    fontSize={FontSize.BASE}
                    fontFamily={FontFamily.MEDIUM}
                    className={`text-white text-base font-medium`}
                  >
                    {currency}
                  </Typography>
                  <Typography
                    textColor={TextColor.GREY_900}
                    fontSize={FontSize.XL}
                    fontFamily={FontFamily.BOLD}
                    className={`text-white text-xl font-bold`}
                  >
                    {formatCurrency(newCost)}
                  </Typography>
                </div>
              </div>
              <Image src={"/shadow.png"} alt="shadow" width={69} height={69} />
            </div>

            <div className="mt-2 w-[120px] text-center translate-x-[8px] text-sm font-medium text-gray-600">
              <Typography
                textColor={TextColor.GREY_800}
                fontSize={FontSize.BASE}
                fontFamily={FontFamily.SEMI_BOLD}
                className={`text-[#333333] text-base font-semibold`}
              >
                {t("new")}
              </Typography>
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
  }: {
    existingValue: number;
    newValue: number;
    costSave: string;
    paybackPeriod: number;
    existingColor?: string;
    newColor?: string;
  }) => {
    const percentage = (100 - (newValue / existingValue) * 100).toFixed(1);
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6">
          <Typography
            textColor={TextColor.GREY_800}
            fontSize={FontSize.XL_2}
            fontFamily={FontFamily.SEMI_BOLD}
            className={`text-[#333333] text-2xl font-semibold`}
          >
            Annual energy cost
          </Typography>
        </div>
        <div className="flex flex-col w-full md:flex-row md:items-center justify-end gap-5">
          <div
            className={`bg-gradient-to-b from-[#F8F8F8] to-[#C5C5C5] border border-[#BABABA] w-full md:w-[249px] flex flex-col items-center md:min-h-[252px] p-6 rounded-2xl`}
          >
            <Typography
              textColor={TextColor.GREY_900}
              fontSize={FontSize.BASE}
              fontFamily={FontFamily.SEMI_BOLD}
              className={"mb-[18px] text-base font-semibold"}
            >
              {t("existing")}
            </Typography>
            <div className="flex flex-row items-center gap-4">
              <Typography
                textColor={TextColor.GREY_800}
                fontSize={FontSize.BASE}
                fontFamily={FontFamily.MEDIUM}
                className={`text-[#333333] text-base font-medium`}
              >
                {currency}
              </Typography>
              <Typography
                textColor={TextColor.GREY_800}
                fontSize={FontSize.XL_2}
                fontFamily={FontFamily.BOLD}
                className={`text-[#333333] text-2xl font-bold`}
              >
                {formatCurrency(existingValue)}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col md:rotate-90 rotate-0 items-center">
            <Image
              src={"/exchange-horizontal.svg"}
              alt={t("exchangeArrow")}
              width={30}
              height={30}
            />
          </div>
          <div
            className={`bg-gradient-to-b from-[#29A587] px-5 to-[#103F34] md:min-h-[252px] w-full md:w-[249px] flex flex-col items-center text-white p-6 rounded-2xl`}
          >
            <Typography
              textColor={TextColor.WHITE}
              fontSize={FontSize.BASE}
              fontFamily={FontFamily.SEMI_BOLD}
              className={"mb-[18px] text-base font-semibold"}
            >
              {t("new")}
            </Typography>
            <div className="flex flex-row items-center gap-4">
              <Typography
                textColor={TextColor.WHITE}
                fontSize={FontSize.BASE}
                fontFamily={FontFamily.MEDIUM}
                className={`text-base font-medium`}
              >
                {currency}
              </Typography>
              <Typography
                textColor={TextColor.WHITE}
                fontSize={FontSize.XL_2}
                fontFamily={FontFamily.BOLD}
                className={`text-2xl font-bold`}
              >
                {formatCurrency(newValue)}
              </Typography>
            </div>

            <div className="flex mt-[18px] flex-col items-center gap-1 border-t-[1px] border-[#BABABA] pt-4">
              <Typography
                textColor={TextColor.WHITE}
                fontSize={FontSize.BASE}
                fontFamily={FontFamily.NORMAL}
                className={`text-base font-normal text-center`}
              >
                {t("annualCostSave")}
              </Typography>
              <div className="flex flex-col justify-center items-center gap-1">
                <div className="flex gap-4 items-center md:gap-[24px]">
                  <Typography
                    textColor={TextColor.GREY_900}
                    fontSize={FontSize.BASE}
                    fontFamily={FontFamily.MEDIUM}
                    className={`text-white text-base font-medium`}
                  >
                    {currency}
                  </Typography>
                  <Typography
                    textColor={TextColor.GREY_900}
                    fontSize={FontSize.XL_2}
                    fontFamily={FontFamily.BOLD}
                    className={`text-white text-2xl font-bold`}
                  >
                    {formatCurrency(Number(costSave))}
                  </Typography>
                </div>
                <Typography
                  textColor={TextColor.WHITE}
                  fontSize={FontSize.LG}
                  fontFamily={FontFamily.NORMAL}
                  className={"text-white text-lg font-normal"}
                >
                  {percentage}%
                </Typography>
              </div>
            </div>
            {/* <div className="flex mt-[18px] flex-col items-start gap-1">
            <Typography
              textColor={TextColor.WHITE}
              fontSize={FontSize.SM}
              fontFamily={FontFamily.LIGHT}
              className={"text-start"}
            >
              {t("expectedPaybackPeriod")}
            </Typography>
            <Typography
              textColor={TextColor.WHITE}
              fontSize={FontSize.SM}
              fontFamily={FontFamily.BOLD}
            >
              {paybackPeriod} {t("years")}
            </Typography>
          </div> */}
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full px-5 items-center md:items-end mt-10 border-t-[1px] border-[#BABABA]">
          <div className="flex flex-col items-center flex-1">
            <Typography
              textColor={TextColor.GREY_800}
              fontSize={FontSize.BASE}
              fontFamily={FontFamily.SEMI_BOLD}
              className={"mt-6 text-base text-[#333333] font-semibold"}
            >
              Please rate your experience with our site.
            </Typography>
            <div className="flex flex-row items-end mt-2 gap-5">
              <Rating
                name="customized-color"
                size="large"
                precision={0.5}
                value={rating}
                disabled={rated}
                onChange={(event, newValue) => {
                  setRating(newValue as number);
                  setRated(true);
                  handleClickSendRating(newValue as number);
                }}
                icon={<GradientStar />}
                emptyIcon={<GradientStarBorder />}
              />
              <div className="flex flex-row items-baseline">
                <Typography
                  textColor={TextColor.GREY_600}
                  fontSize={FontSize.XL_3}
                  fontFamily={FontFamily.SEMI_BOLD}
                  className={
                    "text-start text-[#2A2C2F] font-medium text-[32px]"
                  }
                >
                  {rating}
                </Typography>
                <Typography
                  textColor={TextColor.GREY_700}
                  fontSize={FontSize.SM}
                  fontFamily={FontFamily.NORMAL}
                  className={"text-start text-[#7783A1] text-sm font-normal"}
                >
                  /5
                </Typography>
              </div>
            </div>
          </div>
          {/* <div className="mb-4 w-[110px] mt-5 md:mt-0 md:mb-2 ">
            <Button
              color="outline"
              fullWidth
              className="h-[48px] w-[110px]"
              onClick={handleClickSendRating}
            >
              Send
            </Button>
          </div> */}
        </div>
      </div>
    );
  };
  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#103F34",
    },
    "& .MuiRating-iconHover": {
      color: "#29A587",
    },
    "& .MuiRating-iconDisabled": {
      color: "#103F34",
    },
  });

  const AirConditionerImage = ({ modelCode }: { modelCode: string }) => {
    const [src, setSrc] = useState(`/images/${modelCode}.png`);

    return (
      <Image
        alt="Air Conditioner"
        src={src}
        height={146}
        width={413}
        onError={() => setSrc("/air-condition.svg")}
        priority
      />
    );
  };

  const renderResult = (formik: any) => {
    return (
      <div className="flex flex-col w-full md:p-[40px] md:pl-[120px] gap-[29px] flex-1">
        <div className="absolute md:relative top-[0] inset-x-0 md:inset-x-auto bg-none md:bg-white md:rounded-[24px]">
          <div className="absolute bottom-[0] transform -translate-x-1/2 translate-y-1/2  left-1/2  gap-[12px]  w-[346px] hidden md:flex">
            <Button
              className="!w-[346px] !h-[56px]"
              color="black"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>
          </div>
          <div className="flex flex-col w-full gap-[29px] pt-[84px] md:pt-0">
            <div className="flex flex-col justify-center md:flex-row md:gap-[250px] border-b-[1px] border-[#DDE0E5] md:pt-[50px] pb-[41px] px-[50px]">
              <div
                className="flex-row gap-[10px] items-center pb-[24px] flex md:hidden"
                onClick={() => setCurrentStep(2)}
              >
                <Image
                  src="/back-button.svg"
                  alt="back"
                  width={24}
                  height={24}
                />
                <Typography
                  textColor={TextColor.GREY_800}
                  fontSize={FontSize.BASE}
                  fontFamily={FontFamily.SEMI_BOLD}
                  className="text-[#333333] text-base font-semibold"
                >
                  Back
                </Typography>
              </div>
              <div className="flex flex-col mb-10 border-l-[4px] border-[#29A587] pl-[26px]">
                <Typography
                  textColor={TextColor.GREY_800}
                  fontSize={FontSize.XL}
                  fontFamily={FontFamily.SEMI_BOLD}
                  className="text-[#333333] text-xl md:text-2xl md:text-grey-c900 mb-0.5"
                >
                  {t("result")}
                </Typography>
                <Typography
                  textColor={TextColor.PRIMARY_900}
                  fontSize={FontSize.LG}
                  fontFamily={FontFamily.MEDIUM}
                  className="text-[#134D3F] text-lg font-medium"
                >
                  Model code: {formik.values.newAirConditioner.modelCode}
                </Typography>
                <Typography
                  textColor={TextColor.PRIMARY_900}
                  fontSize={FontSize.LG}
                  fontFamily={FontFamily.MEDIUM}
                  className="text-[#134D3F] text-lg font-medium"
                >
                  {t("grade")}: {formik.values.newAirConditioner.grade}
                </Typography>
                <Typography
                  textColor={TextColor.PRIMARY_900}
                  fontSize={FontSize.LG}
                  fontFamily={FontFamily.MEDIUM}
                  className="text-[#134D3F] text-lg font-medium"
                >
                  Energy efficiency class:{" "}
                  {formik.values.newAirConditioner.energyStar}
                </Typography>
              </div>
              <div className="flex justify-center items-start">
                <AirConditionerImage
                  modelCode={formik.values.newAirConditioner.modelCode}
                />
              </div>
            </div>
            <div className="flex flex-col w-full md:flex-row gap-10 h-auto md:items-center justify-center pb-[60px]">
              <Chart
                existCost={calculateData.existCost}
                newCost={calculateData.newCost}
              />
              <div className="flex flex-col md:flex-row gap-10 md:min-h-[252px] px-5 md:px-0 md:items-start">
                <ComparisonCard
                  existingValue={calculateData.existCost}
                  newValue={calculateData.newCost}
                  costSave={calculateData.saveCost.toString()}
                  paybackPeriod={calculateData.paybackPeriod}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExistingAirConditioner = (formik: any) => {
    return (
      <div className="flex flex-1 flex-col gap-[24px] p-5 pb-[80px] md:pb-[49px] mt-[140px] relative  md:mt-0 md:pr-[44px] md:pl-[8px]  z-10 bg-white md:bg-none rounded-r-[24px] rounded-l-[24px] md:rounded-none">
        <div className="flex justify-between items-center">
          <Typography
            textColor={TextColor.PRIMARY_400}
            fontSize={"text-[24px] md:text-[28px]"}
            fontFamily={FontFamily.BOLD}
          >
            {t("existingAirConditioner")}
          </Typography>
        </div>
        <div className="flex flex-col gap-[16px]">
          <div>
            <Typography
              textColor={TextColor.GREY_700}
              className={
                "block text-sm sm:text-sm md:text-base mb-4 font-semibold"
              }
              fontFamily={FontFamily.MEDIUM}
            >
              {t("typeOfAC")}
            </Typography>
            <div className="flex items-center gap-[67px]">
              {formik.values.existingAirConditioner.isInverter}
              <div className="main-checkbox flex items-center">
                <input
                  type="checkbox"
                  name="existingAirConditioner.isInverter"
                  id="nonInverter"
                  checked={
                    formik.values.existingAirConditioner.isInverter === false
                  }
                  onChange={() => {
                    formik.setFieldValue(
                      "existingAirConditioner.isInverter",
                      formik.values.existingAirConditioner.isInverter === false
                        ? null
                        : false
                    );
                  }}
                  className=""
                />
                <label htmlFor="nonInverter">
                  <Typography
                    textColor={TextColor.GREY_900}
                    className={
                      "block text-sm sm:text-sm md:text-base ml-2 font-normal"
                    }
                  >
                    {t("nonInverter")}
                  </Typography>
                </label>
              </div>
              <div className="main-checkbox flex items-center">
                <input
                  type="checkbox"
                  name="existingAirConditioner.isInverter"
                  id="inverter"
                  checked={
                    formik.values.existingAirConditioner.isInverter === true
                  }
                  onChange={() => {
                    formik.setFieldValue(
                      "existingAirConditioner.isInverter",
                      formik.values.existingAirConditioner.isInverter === true
                        ? null
                        : true
                    );
                  }}
                  className="w-[18px] h-[18px] text-primary-c600 bg-primary-c100 rounded"
                />
                <label htmlFor="inverter">
                  <Typography
                    textColor={TextColor.GREY_900}
                    className={
                      "block text-sm sm:text-sm md:text-base ml-2 font-normal"
                    }
                  >
                    {t("inverter")}
                  </Typography>
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-[16px]">
            <Select
              options={listYear}
              selected={formik.values.existingAirConditioner.year}
              name="existingAirConditioner.year"
              onSelectItem={(item) => {
                formik.setFieldValue("existingAirConditioner.year", item.value);
                getAllStarClass(
                  formik.values.existingAirConditioner.capacity,
                  item.value.toString(),
                  formik
                );
                getAllCapacity(
                  formik.values.existingAirConditioner.energyStar,
                  item.value.toString(),
                  formik
                );
              }}
              error={
                getIn(formik.touched, "existingAirConditioner.year") &&
                Boolean(getIn(formik.errors, "existingAirConditioner.year"))
              }
              helperText={
                getIn(formik.touched, "existingAirConditioner.year") &&
                getIn(formik.errors, "existingAirConditioner.year")
              }
              placeholder={t("selectPurchasedYear")}
              title={t("purchasedYear")}
              className={`${FontSize.BASE}`}
            />
            <Select
              options={listCapacity}
              selected={formik.values.existingAirConditioner.capacity}
              name="existingAirConditioner.capacity"
              onSelectItem={(item) => {
                formik.setFieldValue(
                  "existingAirConditioner.capacity",
                  item.value
                );
                formik.setFieldValue("newAirConditioner.capacity", item.value);
                formik.setFieldValue("newAirConditioner.grade", "");
                formik.setFieldValue("newAirConditioner.modelCode", "");
                formik.setFieldValue("newAirConditioner.energyStar", "");
                getAllGrade(item.value.toString());
                getAllModelCode(
                  formik.values.newAirConditioner.grade,
                  item.value.toString()
                );
                getAllStarClass(
                  item.value.toString(),
                  formik.values.existingAirConditioner.year
                );
                // getAllYear(
                //   item.value.toString(),
                //   formik.values.existingAirConditioner.energyStar
                // );
              }}
              error={
                getIn(formik.touched, "existingAirConditioner.capacity") &&
                Boolean(getIn(formik.errors, "existingAirConditioner.capacity"))
              }
              helperText={
                getIn(formik.touched, "existingAirConditioner.capacity") &&
                getIn(formik.errors, "existingAirConditioner.capacity")
              }
              placeholder={t("selectCapacity")}
              title={t("capacity")}
              className={`${FontSize.BASE}`}
            />
            <Select
              options={listEnergyStar}
              selected={formik.values.existingAirConditioner.energyStar}
              name="existingAirConditioner.energyStar"
              onSelectItem={(item) => {
                formik.setFieldValue(
                  "existingAirConditioner.energyStar",
                  item.value
                );
                // getAllYear(
                //   formik.values.existingAirConditioner.capacity,
                //   item.value
                // );
                getAllCapacity(
                  item.value,
                  formik.values.existingAirConditioner.year
                );
              }}
              error={
                getIn(formik.touched, "existingAirConditioner.energyStar") &&
                Boolean(
                  getIn(formik.errors, "existingAirConditioner.energyStar")
                )
              }
              helperText={
                getIn(formik.touched, "existingAirConditioner.energyStar") &&
                getIn(formik.errors, "existingAirConditioner.energyStar")
              }
              placeholder={t("selectEnergyStar")}
              title={t("energyEfficiencyClass")}
              className={`${FontSize.BASE}`}
            />
          </div>
        </div>
        <div className="flex justify-center inset-x-0 absolute bottom-[25px] md:hidden ">
          {renderButtons(formik)}
        </div>
        <div className="h-[430px] top-[42px] right-0 absolute border border-solid border-[#EFF0F4] hidden md:block"></div>
      </div>
    );
  };

  const renderEnergyCost = (formik: any) => {
    return (
      <div className="flex flex-1 flex-col gap-[24px] p-5 pb-[80px] md:pb-[49px] mt-[140px] relative  md:mt-0 md:pr-[44px] md:pl-[8px]  z-10 bg-white md:bg-none rounded-r-[24px] rounded-l-[24px] md:rounded-none">
        <Typography
          textColor={TextColor.PRIMARY_400}
          fontSize={"text-[24px] md:text-[28px]"}
          fontFamily={FontFamily.BOLD}
        >
          {t("energyCost")}
        </Typography>
        <div className="flex flex-col gap-[16px]">
          {/* Annual Air Conditioner */}
          <Select
            options={monthsOptions}
            selected={formik.values.annualAirConditioner}
            name="annualAirConditioner"
            onSelectItem={(item) => {
              formik.setFieldValue("annualAirConditioner", item.value);
            }}
            error={
              getIn(formik.touched, "annualAirConditioner") &&
              Boolean(getIn(formik.errors, "annualAirConditioner"))
            }
            helperText={
              getIn(formik.touched, "annualAirConditioner") &&
              getIn(formik.errors, "annualAirConditioner")
            }
            placeholder={t("enterMonth")}
            title={t("annualAirConditioner")}
            className={`${FontSize.BASE}`}
          />

          {/* Monthly Energy Bill */}
          <TextField
            label={t("monthlyEnergyBill")}
            placeholder={t("enterBill")}
            name="monthlyBill"
            className={`${FontSize.BASE}`}
            value={
              formik.values.monthlyBill !== null &&
                formik.values.monthlyBill !== undefined
                ? formik.values.monthlyBill
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const maxValue =
                maxMonthlyBill[national?.national as "VN" | "THA" | "IND"];

              if (rawValue === "") {
                formik.setFieldValue("monthlyBill", "");
              } else if (!isNaN(Number(rawValue))) {
                const numericValue = parseInt(rawValue, 10);
                if (numericValue > maxValue) {
                  formik.setFieldValue("monthlyBill", maxValue);
                } else {
                  formik.setFieldValue("monthlyBill", numericValue);
                }
              }
            }}
            error={
              getIn(formik.touched, "monthlyBill") &&
              Boolean(getIn(formik.errors, "monthlyBill"))
            }
            helperText={
              getIn(formik.touched, "monthlyBill") &&
              getIn(formik.errors, "monthlyBill")
            }
          />
          {/* Portion of AC */}
          <TextField
            label={t("portionOfAC")}
            placeholder={t("enterPortionOfAC")}
            name="portionOfAC"
            className={`${FontSize.BASE}`}
            value={formik.values.portionOfAC ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                formik.setFieldValue("portionOfAC", "");
              } else if (!isNaN(Number(value))) {
                const parsedValue = parseInt(value);
                if (parsedValue >= 0 && parsedValue <= 100) {
                  formik.setFieldValue("portionOfAC", parsedValue);
                }
              }
            }}
            error={
              getIn(formik.touched, "portionOfAC") &&
              Boolean(getIn(formik.errors, "portionOfAC"))
            }
            helperText={
              getIn(formik.touched, "portionOfAC") &&
              getIn(formik.errors, "portionOfAC")
            }
          />
        </div>
        <div className="flex justify-center inset-x-0 absolute bottom-[16px] md:hidden ">
          {renderButtons(formik)}
        </div>
        <div className="h-[430px] top-[42px] right-0 absolute border border-solid border-[#EFF0F4] hidden md:block"></div>
      </div>
    );
  };

  const renderNewAirConditioner = (formik: any) => {
    return (
      <div className="flex flex-1 flex-col gap-[24px] p-5 pb-[80px] md:pb-[49px] mt-[140px] relative  md:mt-0 md:pr-[0px] md:pl-[8px]  z-10 bg-white md:bg-none rounded-r-[24px] rounded-l-[24px] md:rounded-none">
        <Typography
          textColor={TextColor.PRIMARY_400}
          fontSize={"text-[24px] md:text-[28px]"}
          fontFamily={FontFamily.BOLD}
        >
          {t("desiredAirConditioner")}
        </Typography>
        <div className="flex flex-col gap-[16px]">
          {/* <Select
            options={listNewCapacity}
            placeholder={t("selectCapacity")}
            title={t("capacity")}
            className={`${FontSize.BASE}`}
            selected={formik.values.newAirConditioner.capacity}
            onSelectItem={(item) => {
              formik.setFieldValue("newAirConditioner.capacity", item.value);
              getAllGrade(item.value.toString());
              getAllModelCode(
                formik.values.newAirConditioner.grade,
                item.value.toString()
              );
            }}
            error={
              getIn(formik.touched, "newAirConditioner.capacity") &&
              Boolean(getIn(formik.errors, "newAirConditioner.capacity"))
            }
            helperText={
              getIn(formik.touched, "newAirConditioner.capacity") &&
              getIn(formik.errors, "newAirConditioner.capacity")
            }
          /> */}
          <TextField
            label={t("capacity")}
            placeholder="-"
            name="capacity"
            className={`${FontSize.BASE}`}
            value={
              national?.national === "IND" &&
                formik.values.newAirConditioner.capacity
                ? `${formik.values.newAirConditioner.capacity
                }kW (${convertToTons(
                  formik.values.newAirConditioner.capacity
                )}T)`
                : formik.values.newAirConditioner.capacity
                  ? Number(
                    formik.values.newAirConditioner.capacity
                  ).toLocaleString()
                  : ""
            }
          />

          <Select
            options={listGrade}
            placeholder={t("selectGrade")}
            title={t("grade")}
            className={`${FontSize.BASE}`}
            selected={formik.values.newAirConditioner.grade}
            onSelectItem={(item) => {
              formik.setFieldValue("newAirConditioner.grade", item.value);
              getAllModelCode(
                item.value.toString(),
                formik.values.newAirConditioner.capacity
              );
            }}
            error={
              getIn(formik.touched, "newAirConditioner.grade") &&
              Boolean(getIn(formik.errors, "newAirConditioner.grade"))
            }
            helperText={
              getIn(formik.touched, "newAirConditioner.grade") &&
              getIn(formik.errors, "newAirConditioner.grade")
            }
          />
          <Select
            options={listModelCode}
            placeholder={t("selectModelCode")}
            title={t("modelCode")}
            className={`${FontSize.BASE}`}
            selected={formik.values.newAirConditioner.modelCode}
            onSelectItem={async (item) => {
              formik.setFieldValue("newAirConditioner.modelCode", item.value);
              getModelData(item.value.toString(), formik);
            }}
            error={
              getIn(formik.touched, "newAirConditioner.modelCode") &&
              Boolean(getIn(formik.errors, "newAirConditioner.modelCode"))
            }
            helperText={
              getIn(formik.touched, "newAirConditioner.modelCode") &&
              getIn(formik.errors, "newAirConditioner.modelCode")
            }
          />
          <TextField
            label={t("energyEfficiencyClass")}
            className={`${FontSize.BASE}`}
            placeholder="-"
            value={formik.values.newAirConditioner.energyStar ?? ""}
            error={
              getIn(formik.touched, "newAirConditioner.energyStar") &&
              Boolean(getIn(formik.errors, "newAirConditioner.energyStar"))
            }
            helperText={
              getIn(formik.touched, "newAirConditioner.energyStar") &&
              getIn(formik.errors, "newAirConditioner.energyStar")
            }
          />
          {/* <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Typography
                textColor={TextColor.GREY_900}
                fontSize={FontSize.BASE}
                fontFamily={FontFamily.MEDIUM}
              >
                {t("paybackPeriod")}
              </Typography>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formik.values.newAirConditioner.calculation}
                  name="calculation"
                  onChange={() => {
                    formik.setFieldValue(
                      "newAirConditioner.calculation",
                      !formik.values.newAirConditioner.calculation
                    );
                    formik.setFieldValue(
                      "newAirConditioner.paybackPeriod",
                      null
                    );
                  }}
                  className="w-5 h-5 text-primary-c600 bg-primary-c100 rounded focus:ring-primary-c500"
                />
                <Typography
                  textColor={TextColor.GREY_700}
                  fontSize={FontSize.SM}
                  fontFamily={FontFamily.MEDIUM}
                  className="ml-2"
                >
                  {t("calculation")}
                </Typography>
              </div>
            </div>
            {formik.values.newAirConditioner.calculation ? (
              <TextField
                className={`${FontSize.BASE}`}
                placeholder={t("enterPrice")}
                value={
                  formik.values.newAirConditioner.paybackPeriod !== null &&
                  formik.values.newAirConditioner.paybackPeriod !== undefined
                    ? formik.values.newAirConditioner.paybackPeriod
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  if (rawValue === "") {
                    formik.setFieldValue("newAirConditioner.paybackPeriod", "");
                  } else if (!isNaN(Number(rawValue))) {
                    formik.setFieldValue(
                      "newAirConditioner.paybackPeriod",
                      parseInt(rawValue)
                    );
                  }
                }}
                error={
                  getIn(formik.touched, "newAirConditioner.paybackPeriod") &&
                  Boolean(
                    getIn(formik.errors, "newAirConditioner.paybackPeriod")
                  )
                }
                helperText={
                  getIn(formik.touched, "newAirConditioner.paybackPeriod") &&
                  getIn(formik.errors, "newAirConditioner.paybackPeriod")
                }
              />
            ) : null}
          </div> */}
        </div>
        <div className="flex justify-center inset-x-0 absolute bottom-[16px] md:hidden ">
          {renderButtons(formik)}
        </div>
      </div>
    );
  };

  const renderButtons = (formik: any) => {
    return (
      <div className="flex w-full mt-5 gap-4 md:gap-[24px] justify-center md:hidden">
        {currentStep > 0 && (
          <Button
            fullWidth
            color="outline"
            className="py-[12px] !w-[100px]"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            {t("previous")}
          </Button>
        )}
        <Button
          variant="contained"
          color="black"
          className="!w-[100px] h-[56px]"
          onClick={() => {
            formik.resetForm();
            setCurrentStep(0);
            getAllYear();
            getAllCapacity();
            getAllStarClass();
            getAllModelCode();
          }}
        >
          Reset
        </Button>
        {currentStep < 2 && (
          <Button
            color="primary"
            className="!w-[100px] h-[56px]"
            disabled={!checkNextButtonAbility(formik)}
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            {t("next")}
          </Button>
        )}
        {currentStep === 2 && (
          <Button
            type="submit"
            className="!w-[100px] h-[56px]"
            color="primary"
            disabled={!formik.isValid}
          >
            {t("simulation")}
          </Button>
        )}
      </div>
    );
  };

  const renderSteps = (formik: any) => {
    switch (currentStep) {
      case 0:
        return renderExistingAirConditioner(formik);
      case 1:
        return renderEnergyCost(formik);
      case 2:
        return renderNewAirConditioner(formik);
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange
      validateOnBlur
    >
      {(formik) => (
        <Form className="flex flex-col w-full flex-1">
          {currentStep < 3 && (
            <div className="flex flex-col w-full md:p-[40px] md:pl-[120px] gap-[29px] flex-1">
              <div className="absolute md:relative top-[0] inset-x-0 md:inset-x-auto bg-none md:bg-white md:rounded-[24px] md:p-[24px]">
                <div className="flex flex-row justify-between md:items-center h-[240px] md:h-[170px]  pl-[27px]  bg-[url('/form-image-mobile.png')] md:bg-[url('/form-image.svg')] bg-no-repeat bg-cover	 md:rounded-[16px] ">
                  <Typography
                    textColor={TextColor.PRIMARY_900}
                    fontFamily={FontFamily.BOLD}
                    fontSize={"text-3xl md:text-4xl"}
                    className="mt-[54px] md:mt-[0px]"
                  >
                    {t("energySimulator")}
                  </Typography>
                  <div className="absolute bottom-[0] transform -translate-x-1/2 translate-y-1/2  left-1/2  gap-[12px]  w-[346px] hidden md:flex">
                    <Button
                      className="!w-[120px] "
                      color="black"
                      onClick={() => {
                        formik.resetForm();
                        setCurrentStep(0);
                        getAllYear();
                        getAllCapacity();
                        getAllStarClass();
                        getAllModelCode();
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      className="py-[10px]"
                      disabled={!formik.isValid || !formik.dirty}
                      color="primary"
                    >
                      {t("simulation")}
                    </Button>
                  </div>
                </div>
                <div className="md:flex flex-col w-full md:flex-row gap-10 h-auto md:items-start hidden mt-[24px]">
                  {renderExistingAirConditioner(formik)}
                  {renderEnergyCost(formik)}
                  {renderNewAirConditioner(formik)}
                </div>
              </div>

              <div className="flex flex-col w-full md:hidden flex-1">
                {renderSteps(formik)}
              </div>
            </div>
          )}
          {currentStep === 3 && renderResult(formik)}
        </Form>
      )}
    </Formik>
  );
}
