import { Header, Icon, Input } from 'semantic-ui-react'
import React, { useCallback, useState } from 'react'

import { FieldInputProps } from 'react-final-form'
import {useDropzone} from 'react-dropzone'

interface IProps {
  maxNumberofFiles: number;
  setFiles: (files: object[]) => void;
  setActiveFile: (file: object) => void;
  resetImages: (image: Blob[] | null) => void;
  error?: boolean;
  props: FieldInputProps<Input, HTMLElement>;
  files: any[];
}

const dropzoneStyles = {
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: '200px'
};

const dropzoneActive = {
    borderColor: 'green'
};

const dropzoneError = {
  backgroundColor: '#fff6f6',
  border : 'solid 1.5px ',
  borderColor:'#e0b4b4'
};

export const PhotoWidgetDropzone: React.FC<IProps> = ({setFiles, setActiveFile, resetImages, error, props, files, maxNumberofFiles}) => {

  const [canceled, setCanceled] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles([]);
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setActiveFile(acceptedFiles[0]);
      resetImages(null);
    },
    [setFiles, setActiveFile, resetImages]
  );

  const { getRootProps, fileRejections, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxNumberofFiles,
    accept: "image/*",
    onFileDialogCancel: () => setCanceled(true),
    onDropRejected: () => resetImages(null),
  });

  return (
    <div
      {...getRootProps({
        onClick: () => setCanceled(false),
        onBlur: () => {
          if (canceled || files.length > 0 || fileRejections.length > 0) props.onBlur(this);
        },
      })}
      style={
        isDragActive
          ? { ...dropzoneStyles, ...dropzoneActive }
          : error
          ? { ...dropzoneStyles, ...dropzoneError }
          : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Prebacite sliku ovde" />
      {fileRejections.length > 0 &&
        <p>Maksimalan broj slika: {maxNumberofFiles}</p>
      }
    </div>
  );
}