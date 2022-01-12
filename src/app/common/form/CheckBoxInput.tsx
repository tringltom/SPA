import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Icon } from "semantic-ui-react";
import Checkbox from "react-custom-checkbox";
import { EkvitiColors } from "../../layout/EkvitiColors";

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

export const CheckBoxInput: React.FC<IProps> = ({ label, input }) => {
  console.log(input);
  return (
    <Form.Field>
      <Checkbox
        checked={input.checked}
        style={{ backgroundColor: "#f0eff5" }}
        onChange={input.onChange}
        icon={
          <Icon
            name="check square"
            size="big"
            style={{ color: EkvitiColors.primary }}
          />
        }
        borderStyle="none"
        size={18}
        label={label}
        labelClassName="ekvitiPrimaryFont"
        labelStyle={{ marginLeft: 5, fontSize: 10 }}
      />
    </Form.Field>
  );
};