import { Fragment, useEffect, useState } from 'react';
import { Header, Grid, Button, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import { PhotoWidgetCropper } from './PhotoWidgetCropper';
import { FieldInputProps } from 'react-final-form';

interface IProps {
  props : FieldInputProps<Input, HTMLElement>
}

const PhotoUploadWidget : React.FC<IProps> = ({props}) => {

  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

    useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      if (props.onChange) {
        props.onChange(image);
      }
    };
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Korak 1 - Dodaj sliku" />
          <PhotoWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={2} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Korak 2 - Promeni veličinu" />
          {files.length > 0 && (
            <PhotoWidgetCropper
              setImage={setImage}
              imagePreview={files[0].preview}
            />
          )}
        </Grid.Column>
        <Grid.Column width={2} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Korak 3 - Prikaz" />
          {files.length > 0 && (
            <Fragment>
              <div
                className="img-preview"
                style={{ minHeight: "200px", overflow: "hidden" }}
              ></div>
              <Button.Group widths={2}>
                <Button
                  icon="close"
                  color="red"
                  onClick={() => {
                    setFiles([]);
                    setImage(null);
                    props.onChange(null);
                  }}
                />
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
} 

export default observer(PhotoUploadWidget);