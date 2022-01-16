import { EkvitiColors } from "./EkvitiColors";

const GridStyle = {
  backgroundColor: EkvitiColors.secondary,
  height: "100%",
  width: "100%",
  marginTop: "0px",
  marginLeft: "0px",
  position: "fixed",
  top: "0",
  left: "0",
};
  
const ColumnStyle = {
  minHeight: "62%",
  backgroundColor: EkvitiColors.white,
  borderRadius: "10px",
  maxWidth: "650px",
};
  
const LogoStyle = {
  paddingTop: "10%",
  paddingBottom: "4%",
  height: "auto",
  width: "57.5%",
};
  
const ButtonStyle = {
  marginRight: "0em",
  minWidth: "77%",
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
  fontSize: 19,
  color: EkvitiColors.primary
};

const styles = {
  GridStyle,
  ColumnStyle,
  LogoStyle,
  ButtonStyle,
  TextStyle
};

export {styles};