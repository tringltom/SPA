import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { RootStoreContext } from "../../app/stores/rootStore";
import queryString from "query-string";
import agent from "../../app/api/agent";
import { Button, GridColumn, Segment,Image, Grid, Container } from "semantic-ui-react";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";
import { EkvitiColors } from "../../app/layout/EkvitiColors";

const VerifyEmail: React.FC<RouteComponentProps> = ({ location }) => {
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
    agent.User.verifyEmail(token as string, email as string)
      .then(() => {
        SetStatus(Status.Success);
      })
      .catch(() => {
        SetStatus(Status.Failed);
      });
  }, [Status.Failed, Status.Success, token, email]);

  const handleConfirmEmailResend = () => {
    agent.User.resendVerifyEmailConfirm(email as string)
      .then(() => {
        toast.success("Potvrda je poslata - molimo Vas da proverite poštu");
      })
      .catch((error) => console.log(error));
  };

  const getBody = () => {
    switch (status) {
      case Status.Verifying:
        return <p>Provera...</p>;
      case Status.Failed:
        return (
          <div className="center">
            <p style={TextStyle} className="ekvitiPrimaryFont">Potvrda neuspešna,<br/> možete opet da zatražite potvrdu pošte</p>
            <Button
              style={ButtonStyle}
              onClick={handleConfirmEmailResend}
              size="huge"
              content="Pošalji potvrdu"
            ></Button>
          </div>
        );
      case Status.Success:
        return (
          <div className="center">
            <p style={TextStyle} className="ekvitiPrimaryFont">Vaša registracija je uspešna,<br/> možete da se prijavite.</p>
            <Button
              style={ButtonStyle}
              onClick={() => openModal(<LoginForm />)}
              size="medium"
              content="Prijavi se"
            ></Button>
          </div>
        );
    }
  };

  return (
    <Container>
      <Grid style={GridStyle} verticalAlign="middle" columns={4} centered>
        <GridColumn mobile={14} style={ColumnStyle} textAlign="center">
          <Image
            size="large"
            src="/assets/LogInEkvitiLogo.png"
            style={LogoStyle}
            centered
          ></Image>
          <br />
          <br />
          <Image
            size="medium"
            src="/assets/KnightRegistration.png"
            style={SecondaryImageStyle}
            centered
          ></Image>
          <br />
          <span style={HeaderTextStyle} className="ekvitiPrimaryFont">
            Potvrda e-maila
          </span>
          <Segment.Inline>{getBody()}</Segment.Inline>
        </GridColumn>
      </Grid>
    </Container>
  );
};

export default VerifyEmail;

const LogoStyle = {
  height: "55%",
  width: "55%",
  marginTop: "80px",
};

const SecondaryImageStyle ={
  height: "25%",
  width: "25%",
  marginTop: "5%",
};

const ButtonStyle ={
  marginTop: "6%",
  minWidth: "75%",
  display: "inline-block",
  fontSize: "20px",
  paddingTop: "23px",
  paddingBottom: "23px",
  borderRadius: "10px",
  boxShadow: `00 8px 10px -6px ${EkvitiColors.primary}`,
  backgroundColor: EkvitiColors.primary,
  color: "white",
  marginBottom: "15%"
};

const TextStyle = {
  display: "inline-block", 
  fontSize: 20, 
  color: EkvitiColors.primary,
};

const HeaderTextStyle = {
  display: "inline-block", 
  fontSize: 25, 
  color: "#000000",
  marginTop: "5%",
  marginBottom: "3%"
};

const GridStyle = {
  backgroundColor: EkvitiColors.primary,
  height: "100%",
  width: "100%",
  marginTop: "0px",
  marginLeft: "0px",
  position: "fixed",
  top: "0",
  left: "0"
};

const ColumnStyle = {
  minHeight: "30%",
  backgroundColor: EkvitiColors.white,
  borderRadius: "15px",
  maxWidth:"650px",
};
