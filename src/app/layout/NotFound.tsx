import { Button, Grid, GridColumn, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { EkvitiColors } from "./EkvitiColors";

const NotFound = () => {
  return (
      <Grid style={GridStyle} verticalAlign='middle' columns={4} centered>
        <GridColumn mobile={14} style={ColumnStyle} textAlign="center">
            <Image src="/assets/LogoForNotFound.png" centered style={LogoStyle}></Image> 
            <Image src="/assets/KnightConfused.png" centered></Image> 
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
  minHeight: "62%",
  backgroundColor: EkvitiColors.white,
  borderRadius: "10px",
  maxWidth: "650px"
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
  paddingTop: "10%",
  paddingBottom: "4%",
  height: "auto",
  width: "57.5%"
};

const OopsStyle = {
  paddingTop: "5%",
  paddingBottom: "3%",
  display: "inline-block",
  fontSize: 25
};

const ButtonStyle = {
  marginRight: "0em", 
  marginTop: "7%",
  minWidth: "77%",
  display: "inline-block",
  fontSize: "19px",
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
  letterSpacing: "0.6px"
};