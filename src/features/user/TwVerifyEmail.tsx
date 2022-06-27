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
            <Typography variant={Typography.variant.bodyL}>
                Potvrda neuspešna,<br/> možete opet da zatražite potvrdu pošte</Typography>
            <Button
              onClick={handleConfirmEmailResend}
              size={Button.size.xlCentered}
              fullWidth
            >Pošalji potvrdu</Button>
          </div>
        );
      case Status.Success:
        return (
          <div className="text-center">
            <Typography variant={Typography.variant.bodyL}>
                Vaša registracija je uspešna,<br/> možete da se prijavite</Typography>
            <Button
              onClick={() => openModal(<TwLoginForm />)}
              size={Button.size.xlCentered}
              fullWidth
            >Prijavi se</Button>
          </div>
        );
    }
  };

  return (
      <div className="w-full h-full top-0 left-0 fixed bg-[#7D36DC] grid"> 
        <div className="h-[80%] w-[87.5%] md:w-[650px] m-auto bg-white rounded-lg self-center"
             >
          <Image
            imageStyle="mx-auto py-14 sm:py-20 w-[55%]"
            src="/assets/LogInEkvitiLogo.png"
            alt="Ekviti logo"
          />
          <Image
            imageStyle="mx-auto mb-2"
            src="/assets/KnightRegistration.png"
            alt="Vitez"
          />
          <Typography variant={Typography.variant.bodyXl} color={Typography.color.text}
                className={"sm:text-3xl my-0 py-8 font-bold"}>
              Potvrda e-maila</Typography>
          <Fragment>{getBody()}</Fragment>
        </div>
      </div>
  );
};

export default TwVerifyEmail;
