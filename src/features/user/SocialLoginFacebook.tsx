import React from "react";
import { observer } from "mobx-react-lite";

interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

const SocialLoginFacebook: React.FC<IProps> = ({ fbCallback, loading }) => {
  return (
    <div className="mb-3 sm:mb-5">
      {/* <FacebookLogin
        appId="TO DO"
        fields="name,email,picture"
        callback={fbCallback}
        render={(props: any) => (
          <button
            className="inline-flex justify-left items-center rounded-lg p-3 sm:py-5 sm:px-5 text-base sm:text-xl w-full bg-white shadow-[0_0px_10px_1px_rgba(226,225,225,0.75)] text-text hover:text-text "
            onClick={props.onClick}
          >
            <Icon
              iconName="facebook"
              className="text-[#1877F2] mr-3 sm:mr-5 w-[20px] h-[20px] sm:w-[25px] sm:h-[25px]"
            />
            Prijava putem Fejsbuka
          </button>
        )}
      /> */}
    </div>
  );
};

export default observer(SocialLoginFacebook);
