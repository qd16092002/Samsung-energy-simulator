"use client";
import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import Button from "@/lib/button";
import TextField from "@/lib/text-field";
import Typography from "@/lib/typography";
import { useState } from "react";
import { Form, Formik, getIn } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/slice/loadingSlice";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import storage from "@/services/storage";
import Select from "@/lib/select";
import Image from "next/image";

type LoginFormValues = {
  username: string;
  password: string;
  isRemember: boolean;
};

const validationSchema = yup.object({
  username: yup.string().required("Please enter your username"),
  password: yup
    .string()
    .required("Please enter your password")
    .min(6, "Password must be at least 6 characters long"),
});

export default function Main() {
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const dispatch = useDispatch();
  const username = storage.getSavedUsername() || "";
  const saveID = storage.getSaveID() || false;
  const initialValues: LoginFormValues = {
    username: username,
    password: "",
    isRemember: saveID,
  };
  const router = useRouter();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      dispatch(openLoading());
      const variables = {
        username: values.username,
        password: values.password,
      };

      const res = await api.post("auth/login", variables);

      if (res.data && res.data.data) {
        storage.updateAccessToken(res.data.data.accessToken);
        storage.updateRefreshToken(res.data.data.refreshToken);
        storage.saveUserInfo(res.data.data);

        if (values.isRemember) {
          storage.saveUsername(values.username);
          storage.saveSaveID(true);
        } else {
          storage.removeSavedUsername();
          storage.removeSaveID();
        }
        if (res.data.data.national.national === "VN") {
          router.push("/vi/energy-simulator");
        } else if (res.data.data.national.national === "THA") {
          router.push("/th/energy-simulator");
        } else if (res.data.data.national.national === "IND") {
          router.push("/hi/energy-simulator");
        }
      } else {
        throw new Error("Invalid response");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsError(true);
      }
    } finally {
      dispatch(closeLoading());
    }
  };

  const idOptions = [
    { value: "vietnam", label: "Vietnam" },
    { value: "thailand", label: "Thailand" },
    { value: "india", label: "India" },
  ];

  return (
    <div className="h-screen md:px-[80px] md:py-[70px] ">
      <div className="md:rounded-3xl h-full bg-white flex flex-col md:flex-row">
        <div className="md:flex-1 m-[12px] md:m-[24px] h-square md:h-auto rounded-2xl bg-[url('/background_mb.svg')] md:bg-[url('/background.svg')] bg-cover bg-center">
          <div className="flex flex-col h-full pt-20 pl-10 md:pt-40 md:pl-24">
            <Typography
              textColor={TextColor.PRIMARY_900}
              fontSize={FontSize.XL_5}
              fontFamily={FontFamily.BOLD}
              className={
                "text-[32px] sm:text-3xl md:text-[42px] text-primary-c900 leading-9"
              }
            >
              Energy Simulator
            </Typography>
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 md:px-[115px] md:w-[580px]">
          <div className="mt-11 mb-4 md:my-8">
            <Typography
              fontSize={FontSize.XL_3}
              fontFamily={FontFamily.BOLD}
              className={"text-primary-c400 text-[24px] md:text-[32px]"}
            >
              LOGIN
            </Typography>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form>
                {/* Username textfield*/}
                <div className="flex-1">
                  <Select
                    options={idOptions}
                    name="username"
                    selected={formik.values.username}
                    onSelectItem={(item) => {
                      formik.setFieldValue("username", item.value);
                    }}
                    className={`${FontSize.XS}`}
                    error={
                      getIn(formik.touched, "username") &&
                      Boolean(getIn(formik.errors, "username"))
                    }
                    helperText={
                      getIn(formik.touched, "username") &&
                      getIn(formik.errors, "username")
                    }
                  ></Select>
                </div>
                {/* Password textfield*/}
                <div className="flex-1">
                  <TextField
                    name="password"
                    onChange={formik.handleChange}
                    fullWidth
                    value={formik.values.password}
                    error={
                      getIn(formik.touched, "password") &&
                      Boolean(getIn(formik.errors, "password"))
                    }
                    helperText={
                      getIn(formik.touched, "password") &&
                      getIn(formik.errors, "password")
                    }
                    type={showPassword ? "text" : "password"}
                    inputProps={{
                      endAdornment: showPassword ? (
                        <Image
                          alt="eye"
                          src={"/eye_on.svg"}
                          onClick={handleClickShowPassword}
                          width={20}
                          height={20}
                        />
                      ) : (
                        <Image
                          alt="eye"
                          src={"/eye.svg"}
                          onClick={handleClickShowPassword}
                          width={20}
                          height={20}
                        />
                      ),
                    }}
                    className={`${FontSize.XS}`}
                  ></TextField>
                </div>
                {isError && (
                  <div className="flex-1">
                    <Typography
                      textColor={TextColor.SUPPORT_900}
                      fontSize={FontSize.BASE}
                      fontFamily={FontFamily.MEDIUM}
                    >
                      There is no matching account.
                    </Typography>
                  </div>
                )}

                {/* Sign in button */}
                <div className="flex justify-center mt-[32px]">
                  <Button
                    type="submit"
                    fullWidth
                    className="h-[56px]"
                    color="primary"
                  >
                    Sign in
                  </Button>
                </div>
                {/* Actions such as remember me, forgot password */}
                <div className="flex-1 flex items-center justify-between pt-2">
                  <div className="flex items-end">
                    <div className="flex items-center">
                      <label
                        htmlFor="remember-login"
                        className="flex items-center gap-2 mt-1 cursor-pointer"
                      >
                        <div
                          className={`w-[18px] h-[18px] rounded-[2.5px] border-[1.5px] border-[#A8ABB2] flex items-center justify-center`}
                        >
                          {formik.values.isRemember && (
                            <Image
                              src="/check_sign.svg"
                              alt="check"
                              width={11}
                              height={11}
                            />
                          )}
                        </div>
                      </label>
                      <input
                        id="remember-login"
                        onChange={(e) => {
                          formik.setFieldValue("isRemember", e.target.checked);
                        }}
                        type="checkbox"
                        className="hidden"
                      />
                    </div>
                    <Typography
                      textColor={TextColor.GREY_700}
                      fontSize={FontSize.SM}
                      fontFamily={FontFamily.NORMAL}
                      className="text-[#6C757D] ml-1"
                    >
                      Save ID
                    </Typography>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
