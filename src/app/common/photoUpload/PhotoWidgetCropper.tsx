import React, { useRef } from 'react'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface IProps {
    setImage: (file: Blob) => void;
    imagePreview: string;
}

export const PhotoWidgetCropper: React.FC<IProps> = ({setImage, imagePreview}) => {
    const cropperRef  = useRef<HTMLImageElement>(null);
    
    const cropImage = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        if (imageElement && typeof cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        cropper &&
        imageElement &&
          cropper.getCroppedCanvas().toBlob((blob: any) => {
            setImage(blob);
          }, "image/jpeg");
    }

    return (
      <Cropper
        src={imagePreview}
        style={{ height: 200, width: "100%" }}
        // Cropper.js options
        initialAspectRatio={1 / 1}
        preview='.img-preview'
        guides={false}
        viewMode={1}
        dragMode='move'
        scalable={true}
        cropBoxMovable={true}
        cropBoxResizable={true}
        crop={cropImage}
        ref={cropperRef}
      />
    );
}
