import { observer } from 'mobx-react-lite';
import { Fragment, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Container, Grid, Image, Transition } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import Navbar from '../navbar/Navbar';
import WelcomeScreen from '../WelcomeScreen';
import ArenaList from './ArenaList';
import ArenaMainPage from './ArenaMainPage';

const users = ['pera','mika','zika','dragutin','milutin'];

const ArenaDashboard = () => {
  const { shake, showDice, getPrice } = useContext(RootStoreContext);
  const [showArena, setshowArena] = useState(false);
  const [showWelcomeScreen, setshowWelcomeScreen] = useState(true);

  const location = useLocation();

  useEffect(() => {
    setshowArena(true);
  }, []);

  const arena = () => (
    <Container fluid style={{ marginTop: "1em", backgroundColor: "white" }}>
      <Navbar />
      <Grid style={{ marginTop: "4em" }}>
        <Grid.Column width={10}>
          <ArenaMainPage />
        </Grid.Column>
        {showDice && (
          <Image
            onClick={getPrice}
            className={shake ? `shake` : undefined}
            style={{ position: "absolute" }}
            size="small"
            src="../assets/d20.png"
          ></Image>
        )}
        <Grid.Column width={6} floated="right">
          <ArenaList users={users} />
        </Grid.Column>
      </Grid>
    </Container>
  );

  return (
    <Fragment>
      {location.state === "/" ? (
        <Fragment>
          {showWelcomeScreen && <WelcomeScreen />}
          <Transition
            visible={showArena}
            animation="fly up"
            duration={3000}
            onComplete={() => {setshowWelcomeScreen(false); location.state=""; console.log(location)}}
            children={arena()}
          />
        </Fragment>
      ) : (
        arena()
      )}
    </Fragment>
  );
}

export default observer(ArenaDashboard);
