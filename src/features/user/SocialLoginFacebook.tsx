import { observer } from "mobx-react-lite";
import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Icon from "../../app/components/Icon";

interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

const SocialLoginFacebook: React.FC<IProps> = ({ fbCallback, loading }) => {
  return (
    <div className="mb-5">
      <FacebookLogin
        appId="TO DO"
        fields="name,email,picture"
        callback={fbCallback}
        render={(props: any) => (
          <button
            className="inline-flex justify-left items-center rounded-lg py-5 px-5 text-base md:text-xl w-full bg-white shadow-[0_0px_10px_1px_rgba(226,225,225,0.75)] text-text hover:text-text "
            onClick={props.onClick}
          >
            <Icon
              iconName="facebook"
              className="text-[#1877F2] mr-3 md:mr-5 w-[25px] h-[25px]"
            />
            Prijava putem Fejsbuka
          </button>
        )}
      />
    </div>
  );
};

export default observer(SocialLoginFacebook);
