import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Input, Label } from "semantic-ui-react";
import PhotoUploadWidget from "../photoUpload/PhotoUploadWidget";

interface IProps
  extends FieldRenderProps<Input, HTMLElement>,
    FormFieldProps {}

export const FileInput: React.FC<IProps> = ({
  input,
  type,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} type={type}>
      <div>
        <PhotoUploadWidget props={input}/>
      </div>
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
