import { observer } from "mobx-react-lite";
import React from "react";
import InstagramLogin from "instagram-login-react";
import { Button} from "semantic-ui-react";

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
            style={{ textAlign: "left", position: "relative" }}
            loading={loading}
            onClick={renderProps.onClick}
            type="button"
            fluid
            color="grey"
            className="socialButtonSimpleOverride"
          >
            <img
              alt="ins"
              src={"/assets/InstagramIcon.png"}
              style={{ paddingRight: "10px",  width: "28px" }}
            />
            <Button.Content
              style={{
                display: "inline-block",
                position: "absolute",
                top: "35%",
              }}
            >
              Prijava putem Instagrama
            </Button.Content>
          </Button>
        )}
      />
    </div>
  );
};

export default observer(SocialLoginInstagram);
