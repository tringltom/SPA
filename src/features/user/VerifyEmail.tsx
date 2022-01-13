import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { RootStoreContext } from "../../app/stores/rootStore";
import queryString from "query-string";
import agent from "../../app/api/agent";
import { Button, GridColumn, Segment,Image, Grid, Container, Header } from "semantic-ui-react";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";
import { styles } from "../../app/layout/FullScreenCardStyle";

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
            <p style={{...styles.TextStyle, marginBottom: "40px"}}>Potvrda neuspešna,<br/> možete opet da zatražite potvrdu pošte</p>
            <Button
              style={styles.ButtonStyle}
              onClick={handleConfirmEmailResend}
              size="huge"
              content="Pošalji potvrdu"
            ></Button>
          </div>
        );
      case Status.Success:
        return (
          <div className="center">
            <p style={{...styles.TextStyle, marginBottom: "40px"}}>Vaša registracija je uspešna,<br/> možete da se prijavite.</p>
            <Button
              style={styles.ButtonStyle}
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
      <Grid style={styles.GridStyle} verticalAlign="middle" centered>
        <GridColumn mobile={14} style={styles.ColumnStyle} textAlign="center">
          <Image
            src="/assets/LogInEkvitiLogo.png"
            style={styles.LogoStyle}
            centered
          />
          <br />
          <br />
          <Image
            src="/assets/KnightRegistration.png"
            centered
          />
          <br />
          <Header as="h2" content="Potvrda e-maila"/>
          <Segment.Inline>{getBody()}</Segment.Inline>
        </GridColumn>
      </Grid>
    </Container>
  );
};

export default VerifyEmail;
