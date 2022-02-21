import { AxiosResponse } from "axios";
import React from "react";
import { Message } from "semantic-ui-react";
import { EkvitiColors } from "../../layout/EkvitiColors";

interface IProps {
  error: AxiosResponse;
  text?: string;
}

export const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    <Message style={{color: EkvitiColors.error }} error>
      <Message.Header style={{color: EkvitiColors.error }} >Nažalost, došlo je do problema :/</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <Message.List>
          {Object.values(error.data.errors)
            .flat()
            .map((err: any, i) => (
              <Message.Item key={i}>{err}</Message.Item>
            ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};
