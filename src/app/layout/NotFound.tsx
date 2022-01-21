import { Button, Grid, GridColumn, Header, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { styles } from "../../app/layout/FullScreenCardStyle";

const NotFound = () => {
  return (
    <Grid style={styles.GridStyle} verticalAlign="middle" columns={4} centered>
      <GridColumn mobile={14} style={styles.ColumnStyle} textAlign="center">
        <Image
          src="/assets/LogoForNotFound.png"
          centered
          style={styles.LogoStyle}
        ></Image>
        <Image src="/assets/KnightConfused.png" centered></Image>
        <Header as="h2" content="Oops!" />
        <br />
        <p style={styles.TextStyle}>
          Sve smo pretražili, ali ovu putanju nismo pronašli.
        </p>
        <br />
        <Button
          as={Link}
          to="/"
          content="Vrati se na početnu"
          style={styles.ButtonStyle}
        />
      </GridColumn>
    </Grid>
  );
};

export default NotFound;
