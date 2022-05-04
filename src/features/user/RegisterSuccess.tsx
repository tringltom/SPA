import { Button, Grid, Header, Image } from "semantic-ui-react";

import React from "react";
import { RouteComponentProps } from "react-router";
import agent from "../../app/api/agent";
import queryString from "query-string";
import { styles } from "../../app/layout/FullScreenCardStyle";
import { toast } from "react-toastify";

const RegisterSuccess: React.FC<RouteComponentProps> = ({ location }) => {
  const { email } = queryString.parse(location.search);

  const handleConfirmEmailResend = () => {
    agent.Session.sendEmailVerification(email as string)
      .then(() => {
        toast.success("Potvrda je poslata - molimo Vas da proverite poštu");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid style={styles.GridStyle} verticalAlign="middle" centered>
      <Grid.Column mobile={14} style={styles.ColumnStyle} textAlign="center">
        <Image
          src="/assets/LogInEkvitiLogo.png"
          style={styles.LogoStyle}
          centered
        />
        <Image src="/assets/KnightSuccessfullRegistration.png" centered />
        <Header as="h2" content="Uspešna registracija!" />
        <p style={styles.TextStyle}>
          Uspešno ste se registrovali, potvrdite putem linka koji
          <br />
          smo poslali na vašu mejl adresu.
        </p>
        <p
          style={{
            ...styles.TextStyle,
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Niste dobili verifikacioni mejl?
        </p>
        <Button
          style={styles.ButtonStyle}
          onClick={handleConfirmEmailResend}
          content="Ponovo pošalji potvrdu"
        />
      </Grid.Column>
    </Grid>
  );
};

export default RegisterSuccess;
