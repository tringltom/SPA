import { observer } from "mobx-react-lite";
import React from "react";
import InstagramLogin from "instagram-login-react";
import { Button, Icon} from "semantic-ui-react";

interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

const SocialLoginInstagram: React.FC<IProps> = ({ fbCallback, loading }) => {
  return (
    <div>
      <InstagramLogin
        clientId="TO DO"
        onSuccess={fbCallback}
        onFailure={fbCallback}
        render={(renderProps: any) => (
          <Button
            style={{ marginTop: "0.5em" }}
            loading={loading}
            onClick={renderProps.onClick}
            type="button"
            fluid
            color="instagram"
          >
            <Icon name="instagram" />
            Uloguj se preko Instagrama
          </Button>
        )}
      />
    </div>
  );
};

export default observer(SocialLoginInstagram);
