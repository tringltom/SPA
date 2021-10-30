import React, { useEffect, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import { Container, Form, FormFieldProps, Input} from "semantic-ui-react";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker/";
import './DateTimeRangePickerInput.css';

interface IProps
  extends FieldRenderProps<Input, HTMLElement>,
    FormFieldProps {}



export const DateTimeRangePickerInput: React.FC<IProps> = ({
  input,
  type,
  meta: { touched, error },
}) => {
    
    const [dates, setDates] = useState<[(Date | undefined)?, (Date | undefined)?] | null>([new Date(), new Date()]);

    useEffect(() => {
        return () => {
            input.onChange(dates);
        };
    });

    return (
        <Form.Field error={touched && !!error} type={type}>
                <Container>
                        <DateTimeRangePicker value={dates} 
                        maxDetail="minute"
                        onChange={setDates}
                        minDate={new Date()}
                        calendarIcon={undefined}
                        disableClock={true}
                        />
                        <div>
                            <span style={{paddingLeft: "20px", fontWeight: "bold"}}>Odaberite početak i kraj izazova</span>
                        </div>
                </Container>
        </Form.Field>
    );
};
