import React from "react";
import { RouteComponentProps } from "react-router";
import queryString from "query-string";
import { Button, Card, Container, Grid, GridColumn, Header, Icon, Image, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { EkvitiColors } from "../../app/layout/EkvitiColors";

const RegisterSuccess: React.FC<RouteComponentProps> = ({ location }) => {
  const { email } = queryString.parse(location.search);

  const handleConfirmEmailResend = () => {
    agent.User.resendVerifyEmailConfirm(email as string)
      .then(() => {
        toast.success("Potvrda je poslata - molimo Vas da proverite poštu");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid style={GridStyle} verticalAlign="middle" centered>
      <Grid.Column mobile={14} style={ColumnStyle} textAlign="center">
        <Image
          src="/assets/LogInEkvitiLogo.png"
          style={LogoStyle}
          centered
        />
        <Image
          src="/assets/KnightSuccessfullRegistration.png"
          centered
        />
        <Header as="h2" style={HeaderStyle}  content="Uspešna registracija!"/>
        <Container style={TextStyle} >
          Uspešno ste se registrovali, potvrdite putem linka koji smo poslali na
          vašu mejl adresu.
        </Container>
        <Container style={{...TextStyle, marginTop:"40px", marginBottom:"20px"}}>Niste dobili verifikacioni mejl?</Container>
        <Button
          style={ButtonStyle}
          onClick={handleConfirmEmailResend}
          content="Ponovo pošalji potvrdu"
        />
      </Grid.Column>
    </Grid>
  );
};

export default RegisterSuccess;

const GridStyle = {
  backgroundColor: EkvitiColors.secondary,
  height: "100%",
  width: "100%",
  marginTop: "0px",
  marginLeft: "0px",
  position: "fixed",
  top: "0",
  left: "0"
};

const ColumnStyle = {
  minHeight: "62%",
  backgroundColor: EkvitiColors.white,
  borderRadius: "10px",
  maxWidth: "650px"
};

const LogoStyle = {
  paddingTop: "10%",
  paddingBottom: "4%",
  height: "auto",
  width: "57.5%"
};

const ButtonStyle = {
  marginRight: "0em", 
  //marginTop: "7%",
  minWidth: "77%",
  //display: "inline-block",
  fontSize: "19px",
  paddingTop: "23px",
  paddingBottom: "23px",
  borderRadius: "10px",
  boxShadow: `00 8px 10px -6px ${EkvitiColors.primary}`,
  backgroundColor: EkvitiColors.primary, 
  color: "white",
  marginBottom: "5%",
  //fontWeight: 100
};

const HeaderStyle = {
  //fontWeight: " !important"
  //paddingTop: "5%",
  //paddingBottom: "3%",
  //display: "inline-block",
  //fontSize: 25
  //color: EkvitiColors.primary
  //textShadow: "2px 2px black"
};

const TextStyle = {
  fontSize: 19, 
  color: EkvitiColors.primary,
  //letterSpacing: "0.6px",
  //fontWeight: "bold"
};

