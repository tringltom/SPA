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
        password : boolean,
    }

export const TextInputIcons: React.FC<IProps> = ({
  input,
  meta: { touched, error },
  iconName,
  labelName,
  password
}) => {
  const [inputType, setInputType] = useState("input");
  const [rightIcon, setRightIcon] = useState("eye slash" as SemanticICONS);
  const [hovered, setHovered] = useState(false);

  const labelStyle = {
    position: "absolute",
    left: "40px",
    top: "5px",
    background: "transparent"
  };

  const inputStyle = {
    textIndent: "35px",
    height: "50px",
    paddingTop: "25px",
    fontFamily: "Comfortaa, cursive",
    backgroundColor: "#f0eff5",
    borderRadius: "7px",
  };

  const lefticonStyle = {
    position: "absolute",
    left: "18px",
    top: "15px",
  };

  const righticonStyle = {
    position: "absolute",
    right: "15px",
    top: "15px",
    color: hovered ? "black" : "#e4e3ed",
  };

  useEffect(() => {
    setInputType(input.type!);
  }, [input.type]);

  const togleType = () => {
    inputType === "password" ? setInputType("text") : setInputType("password");
    rightIcon === "eye slash" ? setRightIcon("eye") : setRightIcon("eye slash");
  };

  const showError = touched && !!error;

  return (
    <div style={{ position: "relative", paddingBottom: "10px" }}>
      <Form.Field error={showError}>
        <Label
          style={{
            ...labelStyle,
            ...{ color: showError ? EkvitiColors.error : EkvitiColors.primary },
          }}
          content={showError ? error : labelName}
        />
        <Icon
          name={iconName}
          style={{
            ...lefticonStyle,
            ...{ color: showError ? EkvitiColors.error : "" },
          }}
        />
        {password && (
          <Icon
            name={rightIcon!}
            style={righticonStyle}
            onClick={togleType}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
        )}
        <input
          {...input}
          type={inputType}
          style={{
            ...inputStyle,
            ...{
              borderColor: showError ? EkvitiColors.error : EkvitiColors.white,
              borderStyle: showError ? "solid" : "none",
            },
          }}
        />
      </Form.Field>
    </div>
  );
};
