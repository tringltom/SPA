import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Icon, Label } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import { EkvitiColors } from "../../layout/EkvitiColors";

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {
        iconName : SemanticICONS,
        labelName: string,
        password : boolean
    }

const labelStyle = {
    position: "absolute",
    left: "21px",
    top: "1px",
    background: "transparent",
    color: EkvitiColors.primary,
    };

const lefticonStyle = {
    position: "absolute",
    left: "5px",
    top: "15px",
    };

const righticonStyle = {
    position: "absolute",
    right: "5px",
    top: "15px",
    };

const inputStyle = {
    textIndent: '16px',
    height: '50px',
    paddingTop: '25px',
    fontFamily: 'Comfortaa, cursive' 
} 

export const TextInputIcons: React.FC<IProps> = ({
  input,
  type,
  placeholder,
  meta: { touched, error },
  iconName,
  labelName,
  password,
}) => {
  return (
    <div style={{ position: "relative", paddingBottom: "10px" }}>
      <Form.Field error={touched && !!error} type={type}>
        <Label className="ekvitiPrimaryFont" style={labelStyle}>
          {labelName}
        </Label>
        <Icon name={iconName} style={lefticonStyle}></Icon>

        {password && (
          <Icon
            name="eye slash"
            style={righticonStyle}
            onClick={() => console.log("invert type")}
          ></Icon>
        )}
        <input {...input} placeholder={placeholder} style={inputStyle}></input>
        {touched && error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
      </Form.Field>
    </div>
  );
};
