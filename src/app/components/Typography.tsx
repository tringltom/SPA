import React, { ElementType } from "react";

import { classNames } from "../common/utils/commonUtil";

enum Variant {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  body,
  subscript
}

interface VariantMapping {
  element: ElementType;
  style: string;
}

enum Color {
  primary,
  secondary,
  text,
  success,
  error,
  white,
}

enum Align {
  left,
  center,
  right,
  justify,
}

type Props = React.PropsWithChildren<{
  variant: Variant;
  align: Align;
  color: Color;
  className?: string;
}>;

const VARIANT_MAPS: Record<Variant, VariantMapping> = {
  [Variant.h1]: { element: "h1", style: "text-6xl" },
  [Variant.h2]: { element: "h2", style: "text-4xl" },
  [Variant.h3]: { element: "h3", style: "text-xl sm:text-2xl" },
  [Variant.h4]: { element: "h4", style: "text-lg" },
  [Variant.h5]: { element: "h5", style: "text-base" },
  [Variant.h6]: { element: "h6", style: "text-sm" },
  [Variant.body]: { element: "p", style: "text-xl" },
  [Variant.subscript]: { element: "p", style: "text-xs sm:text-sm" },
};

const COLOR_MAPS: Record<Color, string> = {
  [Color.primary]: "text-primary",
  [Color.secondary]: "text-secondary",
  [Color.text]: "text-text",
  [Color.success]: "text-success",
  [Color.error]: "text-error",
  [Color.white]: "text-white",
};

const ALIGN_MAPS: Record<Align, string> = {
  [Align.left]: "text-left",
  [Align.center]: "text-center",
  [Align.right]: "text-right",
  [Align.justify]: "text-justify",
};

export const Typography = (props: Props) => {
  const { variant, color, align, className, children } = props;

  const { element, style } = VARIANT_MAPS[variant];

  const Component = variant ? element : "h1";

  return (
    <Component
      className={classNames(
        ALIGN_MAPS[align],
        COLOR_MAPS[color],
        style,
        className
      )}
    >
      {children}
    </Component>
  );
};

Typography.defaultProps = {
  variant: Variant.h1,
  align: Align.center,
  color: Color.primary,
};

Typography.variant = Variant;
Typography.color = Color;
Typography.align = Align;
