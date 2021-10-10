import { observer } from "mobx-react-lite";
import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Button } from "semantic-ui-react";

interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

const SocialLoginFacebook: React.FC<IProps> = ({ fbCallback, loading }) => {
  return (
    <div>
      <FacebookLogin
        appId="TO DO"
        fields="name,email,picture"
        callback={fbCallback}
        render={(renderProps: any) => (
          <Button
            style={{ textAlign: "left", position: "relative" }}
            loading={loading}
            onClick={renderProps.onClick}
            type="button"
            fluid
            color="grey"
            className="ekvitiPrimaryFont socialButtonSimpleOverride"
          >
            <img
              alt="fcb"
              src={"./assets/FacebookIcon.png"}
              style={{ paddingRight: "10px" }}
            />
            <Button.Content
              style={{
                display: "inline-block",
                position: "absolute",
                top: "40%",
              }}
            >
              Prijava putem Fejsbuka
            </Button.Content>
          </Button>
        )}
      />
    </div>
  );
};

export default observer(SocialLoginFacebook);
