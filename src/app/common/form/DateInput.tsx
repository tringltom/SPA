import 'react-widgets/dist/css/react-widgets.css';

import { Form, FormFieldProps, Label } from 'semantic-ui-react';

import { DateTimePicker } from 'react-widgets';
import { FieldRenderProps } from 'react-final-form';
import React from 'react'

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
            value={input.value.toString() === "" ? undefined : input.value}
            {...rest}
        />
        {error && (
          <Label basic color='red'>
            {error}
          </Label>
        )}
      </Form.Field>
    )
}

export default DateInput