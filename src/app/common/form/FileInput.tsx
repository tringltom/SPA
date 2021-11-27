import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Input, Label } from "semantic-ui-react";
import PhotoUploadWidget from "../photoUpload/PhotoUploadWidget";

interface IProps
  extends FieldRenderProps<Input, HTMLElement>,
    FormFieldProps {
      maxNumberofFiles: number
    }

export const FileInput: React.FC<IProps> = ({
  input,
  meta: { touched, error},
  maxNumberofFiles
}) => {

  return (
    <Form.Field error={touched && !!error}>
      <div>
        <PhotoUploadWidget props={input} error={touched && !!error} maxNumberofFiles = {maxNumberofFiles}/>
      </div>
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
