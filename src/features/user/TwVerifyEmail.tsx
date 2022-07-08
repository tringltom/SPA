import React, { Fragment, useContext, useEffect, useState } from "react";
import { Image } from "../../app/components/Image";
import { Button } from "../../app/components/Button";
import TwLoginForm from "./TwLoginForm";
import { RootStoreContext } from "../../app/stores/rootStore";
import { RouteComponentProps } from "react-router";
import agent from "../../app/api/agent";
import queryString from "query-string";
import { toast } from "react-toastify";
import { Typography } from "../../app/components/Typography";

const TwVerifyEmail: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const Status = {
    Verifying: "Verifying",
    Failed: "Failed",
    Success: "Success",
  };

  const [status, SetStatus] = useState(Status.Verifying);
  const { openModal } = rootStore.modalStore;
  const { token, email } = queryString.parse(location.search);

  useEffect(() => {
    agent.Session.verifyEmail(token as string, email as string)
      .then(() => {
        SetStatus(Status.Success);
      })
      .catch(() => {
        SetStatus(Status.Failed);
      });
  }, [Status.Failed, Status.Success, token, email]);

  const handleConfirmEmailResend = () => {
    agent.Session.sendEmailVerification(email as string)
      .then(() => {
        toast.success("Potvrda je poslata - molimo Vas da proverite poštu");
      })
      .catch((error) => console.log(error));
  };

  const getBody = () => {
    switch (status) {
      case Status.Verifying:
        return <Typography
                variant={Typography.variant.body}
                color={Typography.color.text}
                align={Typography.align.center}>
                    Provera...
                </Typography>;
      case Status.Failed:
        return (
          <div className="text-center">
            <Typography variant={Typography.variant.body} className="md:pb-5">
                Potvrda neuspešna, možete opet da <br className="hidden sm:block" />zatražite potvrdu pošte</Typography>
            <Button
              onClick={handleConfirmEmailResend}
              variant={Button.variant.primary}              
              size={Button.size.md}
              className="shadow-[0_8px_10px_-6px_rgba(1,183,255,1)]"
              fullWidth            
            >Pošalji potvrdu</Button>
          </div>
        );
      case Status.Success:
        return (
          <div className="text-center">
            <Typography variant={Typography.variant.body} className="md:pb-5">
                Vaša registracija je uspešna,<br className="hidden sm:block" /> možete da se prijavite</Typography>
            <Button
              onClick={() => openModal(<TwLoginForm />)}
              variant={Button.variant.primary}              
              size={Button.size.md}
              className="shadow-[0_8px_10px_-6px_rgba(1,183,255,1)]"
              fullWidth
            >Prijavi se</Button>
          </div>
        );
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center bg-[#7D36DC]"> 
        <div className="w-full sm:max-w-modal transform overflow-hidden rounded-2xl bg-white p-6 md:py-8 md:px-20 align-middle shadow-xl transition-all">
          <Image
            imageStyle="mx-auto w-[170px]"
            src="/assets/ekviti-logo.svg"
            alt="Ekviti logo"
          />
          <Image
            imageStyle="mx-auto py-8"
            src="/assets/KnightRegistration.png"
            alt="Vitez"
          />
          <Typography variant={Typography.variant.h3} color={Typography.color.text} className="m-0 pb-5">
              Potvrda e-maila</Typography>
          <Fragment>{getBody()}</Fragment>
        </div>
      </div>
  );
};

export default TwVerifyEmail;
