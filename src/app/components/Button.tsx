import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LinkProps } from "react-router-dom";

import { classNames } from "../common/utils/commonUtil";
import { LoadingIcon } from "./icons/LoadingIcon";

enum Variant {
  primary,
  secondary,
  success,
  error,
  primaryOutlined,
  secondaryOutlined,
  successOutlined,
  errorOutlined,
  text
}

enum Size {
  xs,
  sm,
  md,
  lg,
  inline
}

enum Utils {
  disabled,
  full,
}

type BaseProps = React.PropsWithChildren<{
  variant: Variant;
  size: Size;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}>;

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: "button";
  };

type ButtonAsLink = BaseProps &
  Omit<LinkProps, keyof BaseProps> & {
    as: "link";
  };

type ButtonAsExternal = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "externalLink";
  };

const VARIANT_MAPS: Record<Variant, string> = {
  [Variant.primary]:
    "bg-primary inline-flex justify-center items-center text-white hover:text-white text-center rounded-lg",
  [Variant.secondary]:
    "bg-secondary inline-flex justify-center items-center text-center border-3 border-light text-white hover:border-white hover:text-white rounded-lg",
  [Variant.success]:
    "bg-success inline-flex justify-center items-center text-white hover:text-white text-center border-3 border-light text-white hover:border-white hover:text-white rounded-lg",
  [Variant.error]:
    "bg-error inline-flex justify-center items-center text-white hover:text-white text-center border-3 border-light text-white hover:border-white hover:text-white rounded-lg",
  [Variant.primaryOutlined]:
    "bg-transparent inline-flex justify-center items-center text-center border-3 border-light text-white hover:border-white hover:text-white rounded-lg",
  [Variant.secondaryOutlined]:
    "bg-transparent inline-flex justify-center items-center text-center border-3 border-secondary text-white hover:border-white hover:text-white rounded-lg",
  [Variant.successOutlined]:
    "bg-transparent inline-flex justify-center items-center text-center border-3 border-success text-white hover:border-white hover:text-white rounded-lg",
  [Variant.errorOutlined]:
    "bg-transparent inline-flex justify-center items-center text-center border-3 border-error text-white hover:border-white hover:text-white rounded-lg",
  [Variant.text]: "bg-transparent inline-flex justify-center items-center text-center text-primary"
};

const SIZE_MAPS: Record<Size, string> = {
  [Size.xs]: "py-2 px-3 text-xs",
  [Size.sm]: "py-2 px-3 text-sm",
  [Size.md]: "py-5 px-5 text-xl",
  [Size.lg]: "p-6 text-2xl md:text-3xl",
  [Size.inline]: "text-sm"
};

const UTIL_MAPS: Record<Utils, string> = {
  [Utils.disabled]: "opacity-50 cursor-not-allowed pointer-events-none",
  [Utils.full]: "w-full",
};

type ButtonProps = ButtonAsButton | ButtonAsExternal | ButtonAsLink;

export const Button = (props: ButtonProps): JSX.Element => {
  const allClassNames = classNames(
    VARIANT_MAPS[props.variant],
    SIZE_MAPS[props.size],
    props.fullWidth ? UTIL_MAPS[Utils.full] : "w-fit",
    props.disabled ? UTIL_MAPS[Utils.disabled] : null,
    props.className
  );

  if (props.as === "link") {
    const {
      variant,
      color,
      size,
      loading,
      fullWidth,
      disabled,
      className,
      as,
      children,
      startIcon,
      endIcon,
      ...rest
    } = props;
    return (
      <Link className={allClassNames} {...rest}>
        {" "}
        {loading ? <LoadingIcon /> : [startIcon, children, endIcon]}
      </Link>
    );
  } else if (props.as === "externalLink") {
    const {
      variant,
      color,
      size,
      loading,
      fullWidth,
      disabled,
      className,
      as,
      children,
      startIcon,
      endIcon,
      ...rest
    } = props;
    return (
      <a
        className={allClassNames}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {loading ? <LoadingIcon /> : [startIcon, children, endIcon]}  
      </a>
    );
  } else {
    const {
      variant,
      color,
      size,
      loading,
      fullWidth,
      disabled,
      className,
      as,
      children,
      startIcon,
      endIcon,
      ...rest
    } = props;
    return (
      <button disabled={disabled} className={allClassNames} {...rest}>
        {loading ? <LoadingIcon /> : [startIcon, children, endIcon]}    
      </button>
    );
  }
};

Button.defaultProps = {
  variant: Variant.primary,
  size: Size.lg,
};

Button.variant = Variant;
Button.size = Size;
