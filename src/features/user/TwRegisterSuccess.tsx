import React from "react";
import { RouteComponentProps } from "react-router";
import agent from "../../app/api/agent";
import queryString from "query-string";
import { toast } from "react-toastify";
import { Image } from "../../app/components/Image";
import { Button } from "../../app/components/Button";
import { Typography } from "../../app/components/Typography";

const TwRegisterSuccess: React.FC<RouteComponentProps> = ({ location }) => {
  const { email } = queryString.parse(location.search);

  const handleConfirmEmailResend = () => {
    agent.Session.sendEmailVerification(email as string)
      .then(() => {
        toast.success("Potvrda je poslata - molimo Vas da proverite poštu");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-center bg-[#7D36DC]"> 
        <div className="w-full sm:max-w-modal transform overflow-hidden rounded-2xl bg-white p-6 md:py-8 md:px-20 align-middle shadow-xl transition-all">
            <Image
                imageStyle="mx-auto md:pt-8"
                src="/assets/ekviti-logo.svg"
                alt="Ekviti logo"
                />
            <Image
                imageStyle="mx-auto md:pt-8"
                src="/assets/KnightSuccessfullRegistration.png"
                alt="Vitez"
                />
            <Typography variant={Typography.variant.h3} color={Typography.color.text}>
                Uspešna registracija!</Typography>
            <Typography variant={Typography.variant.body}>
                Potvrdite registraciju putem linka koji <br className="hidden sm:block" />smo poslali na Vašu mejl adresu.</Typography>
            <Typography variant={Typography.variant.body}>
                Niste dobili verifikacioni mejl?</Typography>
            <Button
                onClick={handleConfirmEmailResend}
                variant={Button.variant.primary}              
                size={Button.size.md}
                className="shadow-[0_8px_10px_-6px_rgba(1,183,255,1)]"
                fullWidth            
                >Pošalji potvrdu</Button>
        </div>
    </div>
  );
};

export default TwRegisterSuccess;
