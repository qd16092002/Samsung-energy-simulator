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
import React, {
  useMemo,
  memo,
  forwardRef,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import Typography from "./typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CancelIcon from "@mui/icons-material/Cancel";

export type Item = {
  value: string | number | boolean;
  label: React.ReactNode;
  startIcon?: React.ReactNode;
};

type Props = {
  id?: string;
  className?: string;
  onSelectItem?: (
    item: Item,
    ...args: any[]
  ) => any | React.Dispatch<React.SetStateAction<Item | null>>;
  onSelectMultiple?: (
    item: Array<Item>,
    ...args: any[]
  ) => any | React.Dispatch<React.SetStateAction<Array<Item> | null>>;
  title?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  selected?:
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | null;
  options: Array<Item>;
  selectClassName?: string;
  closeOnSelect?: boolean;
  itemClassName?: string;
  boxClassName?: string;
  multiple?: boolean;
  endIcon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  filterPlaceholder?: string;
  position?: "top" | "bottom" | "center";
  altLabel?: ReactNode;
  name?: string;
  filter?: boolean;
};

const isValueArray = (
  x: string | number | boolean | Array<string | number | boolean> | null
): x is Array<string | number | boolean> => Array.isArray(x);

const getListItem = (
  selected: string | number | boolean | (string | number | boolean)[] | null,
  options: Array<Item>
) => {
  let listItem: Array<Item> = [];
  if (isValueArray(selected)) {
    for (let i = 0; i < selected.length; i++) {
      const item = options.find((item) => item.value === selected[i]);
      if (item !== undefined) {
        listItem.push(item);
      }
    }
  } else {
    listItem = options.filter((item) => item.value === selected);
  }

  return listItem;
};

const Select = forwardRef<HTMLDivElement, Props>(function Select(
  {
    id,
    className = "",
    onSelectItem,
    onSelectMultiple,
    fullWidth,
    disabled,
    selected,
    options = [],
    selectClassName = "",
    closeOnSelect = true,
    boxClassName = "",
    itemClassName = "",
    multiple = false,
    endIcon,
    error,
    helperText,
    placeholder,
    filterPlaceholder,
    position = "bottom",
    altLabel,
    title,
    name,
    filter,
    ...args
  },
  ref
) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [select, setSelect] = useState<Array<Item>>(
    selected !== undefined ? getListItem(selected, options) : []
  );
  const [find, setFind] = useState<string>("");
  const fieldRef = useRef<HTMLFieldSetElement>(null);
  const filterOptions = useMemo(() => {
    if (find) {
      return options.filter((item) =>
        item.label?.toString().toLowerCase().includes(find.toLowerCase())
      );
    }

    return options;
  }, [find, options]);

  const filterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selected === null) {
      setSelect([]);
    }
    if (selected !== undefined) {
      setSelect(getListItem(selected, options));
    }
  }, [selected, options]);

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
                  ${TextColor.GREY_900}      
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

  const handleSelect = (item: Item) => {
    const index = select.findIndex((option) => option?.value === item.value);
    let newSelect = [...select];
    if (multiple) {
      if (index !== -1) {
        newSelect.splice(index, 1);
      } else {
        newSelect.push(item);
      }
      onSelectMultiple && onSelectMultiple(newSelect);
    } else {
      newSelect[0] = item;
    }

    setSelect(newSelect);
    onSelectItem && onSelectItem(item);

    if (closeOnSelect && !multiple) {
      handleOpenClose("close");
    }
  };

  const handleOpenClose = (type: "open" | "close") => {
    if (disabled) {
      return;
    }

    if (type === "open") {
      setOpen(true);
      setHidden(false);
      filter && filterRef.current?.focus();
    } else {
      setOpen(false);
      setTimeout(() => setHidden(true), 400);
    }
  };

  const renderText = () => {
    return select.length > 0 ? (
      multiple ? (
        <div className="flex w-[inherit] flex-row flex-wrap gap-1">
          {select.map((item, index) => (
            <div
              key={index}
              className={`flex min-w-0 truncate gap-1 ${colorAttitude["normal"]} !bg-primary-c100 px-2.5 rounded-full`}
            >
              <span className={`block truncate basis-auto`}>{item.label}</span>
              <CancelIcon
                className="py-1 basis-auto text-primary-c500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`flex w-[inherit] truncate gap-2 ${colorAttitude["normal"]} ${className}`}
        >
          <div className={`truncate text-base`}>{select[0].label}</div>
        </div>
      )
    ) : (
      <Typography
        className={`inline-flex truncate !text-grey-c400 ${FontFamily.NORMAL}`}
      >
        {placeholder}
      </Typography>
    );
  };

  return (
    <div className="relative">
      <div
        id={id}
        ref={ref}
        className={`
                    mb-2.5
                    ${TextColor.GREY_700} 
                    ${FontSize.BASE} 
                    bg-[inherit] 
                    min-w-[7.5rem]
                    max-w-full
                    ${fullWidth ? "w-full" : "w-[auto]"}
                    ${boxClassName}
                `}
        {...args}
      >
        {title && (
          <>
            <label
              className={`
                                block
                                mb-[6px]
                                text-base
                                ${
                                  disabled
                                    ? TextColor.GREY_500
                                    : error
                                    ? TextColor.SUPPORT_900
                                    : TextColor.GREY_700
                                }
                                ${
                                  open || disabled
                                    ? "cursor-default"
                                    : "cursor-pointer"
                                }
                                font-semibold
                                truncate
                               ${boxClassName}

                            `}
            >
              {title}
            </label>
          </>
        )}
        <fieldset
          ref={fieldRef}
          className={`
                                min-w-0
                                w-full
                                relative 
                                h-fit
                                px-4
                                bg-[inherit] 
                                outline-0
                                border-[1px] rounded-full
                                text-base 
                                ${FontFamily.NORMAL}
                                ${!title ? " mt-2.5" : ""}
                                ${
                                  disabled
                                    ? `${colorAttitude["disable"]} cursor-default`
                                    : error
                                    ? `${colorAttitude["error"]} ${
                                        !open
                                          ? HOVER.BorderColor.SUPPORT
                                          : BorderColor.SUPPORT_700
                                      } cursor-pointer`
                                    : `${colorAttitude["normal"]} ${
                                        !open
                                          ? HOVER.BorderColor.GREY
                                          : BorderColor.GREY_900
                                      } cursor-pointer`
                                }
                                ${className}
                            `}
          onClick={(e) => {
            handleOpenClose(open && !filter ? "close" : "open");
          }}
          disabled={disabled}
        >
          <input
            value={select.map((it) => it.value).join("")}
            name={name}
            onChange={() => null}
            className={`hidden absolute opacity-0 pointer-events-none select-none ${FontFamily.NORMAL}`}
          />

          <div className="flex items-center justify-between h-12 gap-0 w-full">
            <div className="relative flex truncate w-[inherit]">
              {altLabel ? (
                altLabel
              ) : (
                <div
                  className={`${
                    open && filter ? "opacity-0" : "opacity-100"
                  } flex items-center text-base flex-row gap-3 w-full truncate z-10`}
                >
                  {!multiple && select[0]?.startIcon}
                  {renderText()}
                </div>
              )}
              {filter && (
                <input
                  ref={filterRef}
                  value={find}
                  onChange={(e) => setFind(e.target.value)}
                  placeholder={filterPlaceholder}
                  className={`absolute w-full text-grey-c700 ${
                    FontFamily.NORMAL
                  }
                  ${
                    !open ? "opacity-0" : "opacity-100 z-50"
                  } truncate outline-0 bg-[inherit]`}
                />
              )}
            </div>
            {!open ? (
              <KeyboardArrowDownIcon
                className={`md:text-2xl sm:text-xl text-xl ${
                  disabled ? "cursor-default" : "cursor-pointer"
                }`}
              />
            ) : (
              <KeyboardArrowUpIcon
                className={`md:text-2xl sm:text-xl text-xl ${
                  disabled ? "cursor-default" : "cursor-pointer"
                }`}
              />
            )}
          </div>
        </fieldset>
        {error && (
          <Typography
            className="px-2"
            textColor={TextColor.SUPPORT_900}
            fontSize={FontSize.SM}
            fontFamily={FontFamily.MEDIUM}
          >
            {helperText}
          </Typography>
        )}
      </div>
      {!hidden && (
        <>
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-transparent z-10"
            onClick={() => handleOpenClose("close")}
          ></div>
          <ul
            style={{
              width: fieldRef.current?.offsetWidth,
              top: fieldRef.current
                ? position === "bottom"
                  ? fieldRef.current?.offsetTop + fieldRef.current?.offsetHeight
                  : position === "center"
                  ? fieldRef.current?.offsetTop +
                    fieldRef.current?.offsetHeight / 2
                  : fieldRef.current?.offsetTop
                : 0,
              left: fieldRef.current?.offsetLeft,
            }}
            className={`
                                absolute
                                z-50
                                max-h-48 
                                overflow-auto
                                rounded-md border-[1px]
                                bg-white 
                                py-1 
                                focus:outline-none 
                                transition-all
                                duration-[400ms]
                                ${
                                  fieldRef.current?.offsetWidth &&
                                  fieldRef.current.offsetWidth <= 120
                                    ? "min-w-min"
                                    : ""
                                }
                                ${
                                  position === "bottom"
                                    ? "mt-1"
                                    : position === "center"
                                    ? "-translate-y-1/2"
                                    : "-translate-y-full -mt-1"
                                }
                                ${
                                  open
                                    ? `opacity-100 origin-top`
                                    : `opacity-0 origin-top`
                                }
                                ${
                                  disabled
                                    ? `${colorAttitude["disable"]} ${HOVER.BorderColor.GREY}`
                                    : error
                                    ? `${colorAttitude["error"]} ${HOVER.BorderColor.SUPPORT}`
                                    : `${colorAttitude["normal"]} ${HOVER.BorderColor.PRIMARY}`
                                }
                            `}
          >
            {filterOptions.map((option, index) => (
              <li
                key={index}
                className={`
                                        relative 
                                        cursor-pointer 
                                        select-none 
                                        py-2 px-4
                                        ${
                                          select.find(
                                            (it) => it?.value === option.value
                                          )
                                            ? `hover:bg-primary-c200 bg-primary-c200`
                                            : `hover:bg-primary-c100`
                                        }
                                        ${itemClassName}
                                    `}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center justify-between flex-row gap-3 w-full truncate">
                  <div className="flex items-center flex-row gap-3 w-full truncate">
                    {option.startIcon}
                    <Typography
                      fontFamily={FontFamily.NORMAL}
                      fontSize={FontSize.SM}
                      textColor={TextColor.GREY_900}
                    >
                      {option.label}
                    </Typography>
                  </div>
                  {endIcon}
                </div>
              </li>
            ))}
            {filterOptions.length <= 0 && (
              <div className="flex flex-row gap-3 w-full truncate relative select-none py-2 px-4">
                <div className="flex items-center flex-row gap-3 w-full truncate">
                  <Typography className="block truncate">No options</Typography>
                </div>
              </div>
            )}
          </ul>
        </>
      )}
    </div>
  );
});

export default memo(Select);
