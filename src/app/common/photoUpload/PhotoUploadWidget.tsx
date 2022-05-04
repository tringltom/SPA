import { Button, Container, Grid, GridColumn, Header, Input } from 'semantic-ui-react';
import { Fragment, useEffect, useState } from 'react';

import { FieldInputProps } from 'react-final-form';
import { PhotoWidgetCropper } from './PhotoWidgetCropper';
import { PhotoWidgetDropzone } from './PhotoWidgetDropzone';
import { observer } from 'mobx-react-lite';

interface IProps {
  props : FieldInputProps<Input, HTMLElement>,
  error? : boolean,
  maxNumberofFiles : number,
  state: string
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

const PhotoUploadWidget : React.FC<IProps> = ({props, error, maxNumberofFiles, state}) => {

  const [loadExisting, setLoadExisting] = useState(true);
  const [reset, setReset] = useState(true);
  const [hovered, setHovered] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [activefile, setActiveFile] = useState<any>(null);
  const [images, setImages] = useState<Blob[] | null>(null);

  const thumbs = files.map((file) => (
    <div
      style={
        file?.name === activefile?.name
          ? { ...thumb, border: "2px solid #21ba45", padding: 0 }
          : file.name === hovered
          ? { ...thumb, padding: 0 }
          : thumb
      }
      key={files.indexOf(file)}
      onClick={() => setActiveFile(file)}
      onMouseOver={() => {
        setHovered(file.name);
      }}
    >
      <div style={thumbInner}>
        <img src={file?.preview} style={img} alt="slika" />
      </div>
    </div>
  ));

  const croppedthumbs = images?.map((image) => 
    <div style={thumb} key={images.indexOf(image)}>
      <div style={thumbInner}>
        <img src={URL.createObjectURL(image)} style={croppedImg}  alt="spremna slika"/>
      </div>
    </div>
  );

  useEffect(() => {
    let values=  props?.value as unknown as any[];

    if (loadExisting && values && values.length > 0 && state) {
      setFiles(
        values.map((file: any) => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      setActiveFile(values[0]);
      setImages(values);
      setLoadExisting(false);
    }

    if (state === undefined && reset) {
      setReset(false);
      setFiles([]);
      setImages(null);
    }
    
    if ((values || images) && props.onChange) {
      props.onChange(images);
    }

    return () => {
      if ((values || images) && props.onChange) {
        props.onChange(images);
      }    
    };
  }, [props, images, setFiles, loadExisting, state, reset]);

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