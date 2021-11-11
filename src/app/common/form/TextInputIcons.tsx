import React, { useEffect, useState } from "react";
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
  meta: { touched, error },
  iconName,
  labelName,
  password,
}) => {
  const [inputType, setInputType] = useState("input");
  const [rightIcon, setRightIcon] = useState("eye slash" as SemanticICONS);


  useEffect(() => {
    setInputType(input.type!);
  }, [input.type]);

  const togleType = () => {
    inputType === "password" ? setInputType("text") : setInputType("password");
    rightIcon === "eye slash" ? setRightIcon("eye") : setRightIcon("eye slash");
  }

  return (
    <div style={{ position: "relative", paddingBottom: "10px" }}>
      <Form.Field error={touched && !!error}>
        <Label className="ekvitiPrimaryFont" style={labelStyle}>
          {labelName}
        </Label>
        <Icon name={iconName} style={lefticonStyle}></Icon>

        {password && (
          <Icon
            name={rightIcon!}
            style={righticonStyle}
            onClick={togleType}
          ></Icon>
        )}
        <input {...input} type={inputType} style={inputStyle}></input>
        {touched && error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
      </Form.Field>
    </div>
  );
};
