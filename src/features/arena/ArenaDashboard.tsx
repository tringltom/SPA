
import { observer } from 'mobx-react-lite';
import { Fragment, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Container, Grid, Image, Transition } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import Navbar from '../navbar/Navbar';
import WelcomeScreen from '../WelcomeScreen';
import ArenaList from './ArenaList';
import ArenaMainPage from './ArenaMainPage';
import InfiniteScroll from 'react-infinite-scroller';

const ArenaDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {shake, showDice, getPrice} = rootStore;
  const {loadUsers, setPage, page, totalPages, usersArray} = rootStore.userStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const [showArena, setshowArena] = useState(false);
  const [showWelcomeScreen, setshowWelcomeScreen] = useState(true);

  const location = useLocation();

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadUsers().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    loadUsers();
    setshowArena(true);
  }, [loadUsers]);

  const arena = () => (
    <Container fluid style={{ marginTop: "1em", backgroundColor: "white" }}>
      <Navbar />
      <Grid style={{ marginTop: "4em" }}>
        <Grid.Column width={10}>
          <ArenaMainPage initialLoad = {showWelcomeScreen}/>
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
        <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNext}
                hasMore={!loadingNext && page + 1 < totalPages }
                initialLoad = {false}
                >
                <ArenaList users={usersArray}/>
                </InfiniteScroll>
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
            onComplete={() => {setshowWelcomeScreen(false); location.state="";}}
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
