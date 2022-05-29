import { Container, Grid, GridColumn, Header, Image, Segment } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { RouteComponentProps } from "react-router";
import agent from "../../app/api/agent";
import queryString from "query-string";
import { styles } from "../../app/layout/FullScreenCardStyle";

const HappeningConfirmation: React.FC<RouteComponentProps> = ({ location }) => {

  const Status = {
    Verifying: "Verifying",
    Failed: "Failed",
    Success: "Success",
  };

  const [status, SetStatus] = useState(Status.Verifying);
  const { id } = queryString.parse(location.search);

  useEffect(() => {
    agent.Activity.confirmAttendenceToHappening(id as string)
      .then(() => {
        SetStatus(Status.Success);
      })
      .catch(() => {
        SetStatus(Status.Failed);
      });
  }, [Status.Failed, Status.Success, id]);

  const getBody = () => {
    switch (status) {
      case Status.Verifying:
        return <p>Provera...</p>;
      case Status.Failed:
        return (
          <div className="center">
            <p style={{...styles.TextStyle, marginBottom: "40px"}}>Potvrda neuspešna,<br/> možete opet da skenirate kod</p>
          </div>
        );
      case Status.Success:
        return (
          <div className="center">
            <p style={{...styles.TextStyle, marginBottom: "40px"}}>Vaša potvrda je uspešna,<br/> Dobrodošli na dogadjaj!</p>
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
          <Header as="h2" content="Potvrda dolaska na dogadjaj"/>
          <Segment.Inline>{getBody()}</Segment.Inline>
        </GridColumn>
      </Grid>
    </Container>
  );
};

export default HappeningConfirmation;
