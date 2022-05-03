import { Form, FormFieldProps, Input, Label } from "semantic-ui-react";

import { FieldRenderProps } from "react-final-form";
import PhotoUploadWidget from "../photoUpload/PhotoUploadWidget";
import React from "react";

interface IProps
  extends FieldRenderProps<Input, HTMLElement>,
    FormFieldProps {
      maxNumberofFiles: number,
      state: string
    }

export const FileInput: React.FC<IProps> = ({
  input,
  meta: { touched, error},
  maxNumberofFiles,
  state
}) => {

  return (
    <Form.Field error={touched && !!error}>
      <div>
        <PhotoUploadWidget props={input} error={touched && !!error} maxNumberofFiles = {maxNumberofFiles} state = {state}/>
      </div>
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
