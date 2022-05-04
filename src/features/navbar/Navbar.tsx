import  '../../app/layout/styles.css';

import React, { useContext } from 'react'

import { ActivityTypes } from '../../app/models/activity';
import { NavbarDesktop } from './NavbarDesktop';
import { NavbarMobile } from './NavbarMobile';
import { NavbarRighItems } from './NavbarRighItems';
import { RootStoreContext } from '../../app/stores/rootStore';
import { createMedia } from "@artsy/fresnel";
import { history } from "../..";
import { observer } from 'mobx-react-lite';

const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920
  }
});


const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

const Navbar: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;

  const GoodDeedCount = user?.activityCounts?.find((el) => el.type === ActivityTypes.GoodDeed);
  const JokeCount = user?.activityCounts?.find((el) => el.type === ActivityTypes.Joke);
  const QuoteCount = user?.activityCounts?.find((el) => el.type === ActivityTypes.Quote);
  const PuzzleCount = user?.activityCounts?.find((el) => el.type === ActivityTypes.Puzzle);
  const HappeningCount = user?.activityCounts?.find((el) => el.type === ActivityTypes.Happening);
  const ChallengeCount = user?.activityCounts?.find((el) => el.type === ActivityTypes.Challenge);
  
  const leftItems = [
    { content: `${ActivityTypes[1]} ${GoodDeedCount?.available}/${GoodDeedCount?.max}`, key: "delo", icon:"heartbeat", disabled: (GoodDeedCount?.available ?? 0) <= 0, onClick : () => {history.push("/gooddeed")}},
    { content: `${ActivityTypes[2]} ${JokeCount?.available}/${JokeCount?.max}`, key: "vic", icon:"smile outline", disabled: (JokeCount?.available ?? 0) <= 0, onClick : () => {history.push("/joke")}},
    { content: `${ActivityTypes[3]} ${QuoteCount?.available}/${QuoteCount?.max}`, key: "izreka", icon:"comment alternate", disabled: (QuoteCount?.available ?? 0) <= 0, onClick : () => {history.push("/quote")}},
    { content: `${ActivityTypes[4]} ${PuzzleCount?.available}/${PuzzleCount?.max}`, key: "zagonetka", icon:"puzzle piece", disabled: (PuzzleCount?.available ?? 0) <= 0, onClick : () => {history.push("/puzzle")}},
    { content: `${ActivityTypes[5]} ${HappeningCount?.available}/${HappeningCount?.max}`, key: "dogadjaj", icon:"address card outline", disabled: (HappeningCount?.available ?? 0) <= 0, onClick : () => {history.push("/happening")}},
    { content: `${ActivityTypes[6]} ${ChallengeCount?.available}/${ChallengeCount?.max}`, key: "izazov", icon:"hand rock", disabled: (ChallengeCount?.available ?? 0) <= 0, onClick : () => {history.push("/challenge")}},
  
  ];
  
  return (
    <>
      <style>{mediaStyles}</style>
      <MediaContextProvider>
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
      </MediaContextProvider>
    </>
  );
}

export default observer(Navbar);
