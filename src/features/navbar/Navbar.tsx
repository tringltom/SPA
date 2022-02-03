import React from 'react'
import { observer } from 'mobx-react-lite';
import { Container} from 'semantic-ui-react';
import  '../../app/layout/styles.css';
import { history } from "../..";
import { createMedia } from "@artsy/fresnel";
import { NavbarMobile } from './NavbarMobile';
import {NavbarDesktop}  from './NavbarDesktop';
import { NavbarRighItems } from './NavbarRighItems';

const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920
  }
});

const leftItems = [
  { content: "Delo", key: "delo", icon:"heartbeat", onClick : () => {history.push("/gooddeed")}},
  { content: "Vic", key: "vic", icon:"smile outline", onClick : () => {history.push("/joke")}},
  { content: "Izreka", key: "izreka", icon:"comment alternate", onClick : () => {history.push("/quote")}},
  { content: "Zagonetka", key: "zagonetka", icon:"puzzle piece", onClick : () => {history.push("/puzzle")}},
  { content: "Dogadjaj", key: "dogadjaj", icon:"address card outline", onClick : () => {history.push("/happening")}},
  { content: "Izazov", key: "izazov", icon:"hand rock", onClick : () => {history.push("/challenge")}},

];

const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

const Navbar: React.FC = () => {
  return (
    <>
      <style>{mediaStyles}</style>

      <MediaContextProvider>
        <Container>
          <Media at="mobile">
            <NavbarMobile
              leftItems={leftItems}
              rightItems={<NavbarRighItems />}
            ></NavbarMobile>
          </Media>
          <Media greaterThan="mobile">
            <NavbarDesktop
              leftItems={leftItems}
              rightItems={<NavbarRighItems />}
            />
          </Media>
        </Container>
      </MediaContextProvider>
    </>
  );
}

export default observer(Navbar);
