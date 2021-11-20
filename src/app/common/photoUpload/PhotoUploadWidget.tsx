import { Fragment, useEffect, useState } from 'react';
import { Header, Grid, Button, Input, Container, GridColumn } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { PhotoWidgetDropzone } from './PhotoWidgetDropzone';
import { PhotoWidgetCropper } from './PhotoWidgetCropper';
import { FieldInputProps } from 'react-final-form';

interface IProps {
  props : FieldInputProps<Input, HTMLElement>,
  error? : boolean,
  maxNumberofFiles : number
}

const thumbsContainer = {
  display: 'flex',
  marginTop: 16
};

const croppedthumbsContainer = {
  display: 'flex',
  marginTop: 16,
  justifyContent: 'right'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  justifyContent: 'center'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const croppedImg = {
  display: 'block',
  maxHeight: '100%',
  maxWidth: '100%'
};

const PhotoUploadWidget : React.FC<IProps> = ({props, error, maxNumberofFiles}) => {

  const [hovered, setHovered] = useState("");

  const [files, setFiles] = useState<any[]>([]);
  const [activefile, setActiveFile] = useState<any>(null);
  const [images, setImages] = useState<Blob[] | null>(null);

  const thumbs = files.map((file) => (
    <div
      style={
        file.name === activefile?.name
          ? { ...thumb, border: "2px solid #21ba45", padding: 0 }
          : file.name === hovered
          ? { ...thumb, padding: 0 }
          : thumb
      }
      key={file.name}
      onClick={() => setActiveFile(file)}
      onMouseOver={() => {
        setHovered(file.name);
      }}
    >
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  const croppedthumbs = images?.map((image) => (
    <div style={thumb} key={images.indexOf(image)}>
      <div style={thumbInner}>
        <img src={URL.createObjectURL(image)} style={croppedImg} />
      </div>
    </div>
  ));

  useEffect(() => {
    if (props.onChange) {
      props.onChange(images);
    }
    return () => {
      if (props.onChange) {
        props.onChange(images);
      }
    };
  }, [images]);

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Korak 1 - Dodaj sliku" />
          <PhotoWidgetDropzone
            maxNumberofFiles={maxNumberofFiles}
            setFiles={setFiles}
            setActiveFile={setActiveFile}
            resetImages={setImages}
            error={error}
            props={props}
            files={files}
          />
        </Grid.Column>
        <Grid.Column width={2} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Korak 2 - Promeni veličinu" />
          {files.length > 0 && (
            <PhotoWidgetCropper
              images={images}
              setImages={setImages}
              activeFile={activefile}
              files={files}
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
                    setImages(null);
                  }}
                />
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
        <GridColumn width={8}>
          <Container style={thumbsContainer}>{thumbs}</Container>
        </GridColumn>
        <GridColumn width={8}>
          <Container style={croppedthumbsContainer}>{croppedthumbs}</Container>
        </GridColumn>
      </Grid>
    </Fragment>
  );
} 

export default observer(PhotoUploadWidget);