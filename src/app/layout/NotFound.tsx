import { Button, Grid, GridColumn, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { EkvitiColors } from "./EkvitiColors";

const NotFound = () => {
  return (
      <Grid style={GridStyle} verticalAlign='middle' columns={4} centered>
        <GridColumn mobile={13} style={ColumnStyle} textAlign="center">
            <Image src="/assets/LogoForNotFound.png" centered style={LogoStyle}></Image> 
            <Image src="/assets/ConfusedKnight.png" centered></Image> 
            <span className="ekvitiPrimaryFont" style={OopsStyle}>Oops!</span>
            <br/>
            <span className="ekvitiPrimaryFont" style={TextStyle}>Sve smo pretražili, ali ovu putanju nismo pronašli.</span>
            <br/>
            <Button
              as={Link} to="/"
              className="ekvitiPrimaryFont"
              content="Vrati se na početnu"
              style={ButtonStyle}
              />
        </GridColumn>
      </Grid>
  );
};

export default NotFound;

const ColumnStyle = {
  minHeight: "60%",
  backgroundColor: EkvitiColors.white,
  borderRadius: "15px",
  maxWidth: "700px"
};

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

const LogoStyle = {
  paddingTop: "9%",
  paddingBottom: "3%",
  height: "auto",
  width: "55%"
};

const OopsStyle = {
  paddingTop: "4%",
  paddingBottom: "3%",
  display: "inline-block",
  fontSize: 26
};

const ButtonStyle = {
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
  marginBottom: "5%"
};

const TextStyle = {
  display: "inline-block", 
  fontSize: 19, 
  color: EkvitiColors.primary,
  letterSpacing: "1px"
};