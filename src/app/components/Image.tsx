import React from "react";

import { classNames } from "../common/utils/commonUtil";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageStyle?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  src: string;
  alt: string;
  style?: object;
}

export const Image = (props: ImageProps) => {
  const { imageStyle, onClick, style, src, alt } = props;

  return (
    <img
      className={classNames(imageStyle)}
      style={style}
      onClick={onClick}
      src={src}
      alt={alt}
    />
  );
};
