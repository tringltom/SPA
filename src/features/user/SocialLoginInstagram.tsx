import { observer } from "mobx-react-lite";
import React from "react";
import InstagramLogin from "instagram-login-react";
import Icon from "../../app/components/Icon";

interface IProps {
  igCallback: (response: any) => void;
  loading: boolean;
  button?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const SocialLoginInstagram: React.FC<IProps> = ({ igCallback, loading }) => {
  return (
    <div>
      <InstagramLogin
        clientId="TO DO"
        onSuccess={igCallback}
        onFailure={igCallback}
        render={(props: any) => (
          <button
            className="inline-flex justify-left items-center rounded-lg py-5 px-5 text-base md:text-xl w-full bg-white shadow-[0_0px_10px_1px_rgba(226,225,225,0.75)] text-text hover:text-text "
            onClick={props.onClick}
          >
            <Icon
              iconName="instagram"
              className="text-[#E1306C] mr-3 md:mr-5 w-[25px] h-[25px]"
            />
            Prijava putem Instagrama
          </button>
        )}
      />
    </div>
  );
};

export default observer(SocialLoginInstagram);
