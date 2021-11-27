import React, { Fragment, useRef, useState } from 'react'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from 'semantic-ui-react';

interface IProps {
  images: Blob[] | null;
  activeFile: any;
  files : any[];
  setImages: (file: Blob[]) => void;
}

export const PhotoWidgetCropper: React.FC<IProps> = ({setImages, images, activeFile, files}) => {
  const [croppedImages, setCroppedImages] = useState<Blob[] | null>([]);
  const cropperRef = useRef<HTMLImageElement>(null);

  const confirmCropping = (activeFile: any) => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (imageElement && typeof cropper.getCroppedCanvas() === "undefined") 
      return;
    cropper &&
      imageElement &&
      cropper.getCroppedCanvas().toBlob((blob: Blob) => {
        var imageIndex = files.findIndex(
          (file) => file.name === activeFile.name
        );

        if (images === null)
         setCroppedImages(images);

        if (croppedImages != null) {
          croppedImages[imageIndex] = blob;
          setCroppedImages(croppedImages);
          setImages([...croppedImages]);
        }
      }, "image/jpeg");
  };

  return (
    <Fragment>
      <Cropper
        src={activeFile?.preview}
        style={{ height: 200, width: "100%" }}
        preview=".img-preview"
        guides={false}
        viewMode={1}
        dragMode="move"
        scalable={true}
        cropBoxMovable={true}
        cropBoxResizable={true}
        ref={cropperRef}
      />
      <Button
        icon="share"
        color="green"
        onClick={(e) => {
          e.preventDefault();
          confirmCropping(activeFile);
        }}
      />
    </Fragment>
  );
}
