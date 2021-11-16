import React from 'react'
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

interface IProps
  extends FieldRenderProps<Date, HTMLElement>,
    FormFieldProps {}

const DateInput: React.FC<IProps> = ({
    input,
    width,
    placeholder,
    id,
    date = false,
    time = false,
    meta: { touched, error },
    ...rest
  }) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
        <DateTimePicker
            id={String(id)} 
            placeholder={placeholder}
            onChange={input.onChange}
            onKeyDown={(e) => e.preventDefault()}
            onBlur={() => input.onBlur(this)}
            date={date}
            time={time}
            step={5}
            {...rest}
        />
        { error && (
          <Label basic color='red'>
            {error}
          </Label>
        )}
      </Form.Field>
    )
}

export default DateInput