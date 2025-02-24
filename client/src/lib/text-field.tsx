"use client";

import {
  BgColor,
  BorderColor,
  FOCUS,
  FontFamily,
  FontSize,
  HOVER,
  TextColor,
} from "@/enum/setting";
import React, { useMemo, memo, forwardRef, useState, useRef } from "react";
import Typography from "./typography";
import ErrorIcon from "@mui/icons-material/Error";

type Props = {
  id?: string;
  label?: string;
  resize?: React.CSSProperties["resize"];
  children?: React.ReactNode;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement & HTMLInputElement>;
  type?: "text" | "password"; // input only
  fullWidth?: boolean;
  disabled?: boolean;
  boxClassName?: string;
  multiline?: boolean;
  error?: boolean;
  helperText?: string;
  rows?: number;
  placeholder?: string;
  value?: string;
  inputProps?: {
    // input only
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
};

export type TextFieldProps = Props &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  React.InputHTMLAttributes<HTMLInputElement>;
export type TextFieldRef = HTMLTextAreaElement | HTMLInputElement | null;

const TextField = forwardRef<TextFieldRef, TextFieldProps>(function TextField(
  {
    id,
    resize = "none",
    label = "",
    children,
    className = "",
    onChange = () => null,
    type,
    fullWidth = false,
    disabled,
    boxClassName = "",
    multiline,
    rows,
    error,
    helperText,
    placeholder,
    value = "",
    inputProps,
    ...args
  },
  ref
) {
  const [focus, setFocus] = useState(false);
  const curRef = useRef<TextFieldRef>(null);

  const colorAttitude = useMemo(() => {
    return {
      error: `
                ${BgColor.TRANSPARENT}
                ${TextColor.PRIMARY_900}      
                ${BorderColor.SUPPORT_900}
                ${FOCUS.BorderColor.SUPPORT}
                focus-within:border-support-c900
                `,
      normal: `
                ${BgColor.TRANSPARENT}
                ${TextColor.PRIMARY_900}      
                ${BorderColor.GREY_100}
                ${FOCUS.BorderColor.GREY}
                focus-within:border-grey-c900
                `,
      disable: `
                ${BgColor.TRANSPARENT}
                ${TextColor.GREY_900}
                ${BorderColor.GREY_400}
                `,
    };
  }, []);

  function renderInput<T extends React.ForwardedRef<TextFieldRef>>(ref: T) {
    return (
      <div className="flex items-center justify-between flex-row w-full text-grey-c900">
        {inputProps?.startAdornment}
        <input
          {...args}
          placeholder={placeholder}
          autoComplete={placeholder || ""}
          ref={(e) => {
            if (
              ref !== null &&
              ref !== undefined &&
              typeof ref !== "function"
            ) {
              ref.current = e;
            }
            curRef.current = e;
          }}
          style={{
            resize: resize,
          }}
          className={`
                    text-sm sm:text-sm md:text-base text-grey-c900 
                    bg-transparent
                    grow
                    w-full
                    outline-0
                    
                    h-12
                    flex items-center 
                    justify-center
                    ${FontFamily.NORMAL}	
                    ${className}
                `}
          disabled={disabled}
          type={type}
          value={value}
          onBlur={() => setFocus(false)}
          onFocus={() => setFocus(true)}
          onChange={onChange}
        />
        {inputProps?.endAdornment}
      </div>
    );
  }

  function renderTextArea<T extends React.ForwardedRef<TextFieldRef>>(ref: T) {
    return (
      <textarea
        {...args}
        placeholder={placeholder}
        rows={rows}
        autoComplete={placeholder || ""}
        ref={(e) => {
          if (ref !== null && ref !== undefined && typeof ref !== "function") {
            ref.current = e;
          }
          curRef.current = e;
        }}
        style={{
          resize: resize,
        }}
        className={`
                text-sm sm:text-sm md:text-base text-grey-c900 
                bg-transparent
                w-full
                h-12
                outline-0
                flex items-center
                justify-center
                text-justify
                ${FontFamily.NORMAL}	
                ${className}
            `}
        disabled={disabled}
        value={value}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        onChange={onChange}
      />
    );
  }

  return (
    <div
      className={`mb-2.5 h-fit bg-[inherit] ${
        fullWidth ? `w-full` : `w-[auto]`
      }`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`
                block
                mb-[6px]
                text-sm sm:text-sm md:text-base
                ${
                  disabled
                    ? TextColor.GREY_500
                    : error
                    ? TextColor.SUPPORT_900
                    : TextColor.GREY_700
                }
                font-semibold
                ${boxClassName}
            `}
        >
          {label}
        </label>
      )}
      <fieldset
        id={id}
        className={`
            group
            relative
            px-4
            bg-[inherit]
            text-sm sm:text-sm md:text-base 
            flex flex-col justify-center items-start transition-all
            h-fit
            cursor-text
            border-[1px] rounded-4xl
            ${
              disabled
                ? `${colorAttitude["disable"]}`
                : error
                ? `${colorAttitude["error"]} ${
                    !focus && HOVER.BorderColor.SUPPORT
                  }`
                : `${colorAttitude["normal"]} ${
                    !focus && HOVER.BorderColor.PRIMARY
                  }`
            }
            ${boxClassName}
        `}
        onClick={() => {
          setFocus(true);
          curRef.current?.focus();
        }}
      >
        {multiline ? renderTextArea(ref) : renderInput(ref)}
      </fieldset>
      {error && (
        <Typography
          textColor={TextColor.SUPPORT_900}
          fontSize={FontSize.SM}
          fontFamily={FontFamily.MEDIUM}
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
});

export default memo(TextField);
