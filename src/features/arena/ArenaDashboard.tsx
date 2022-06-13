import { Container, Grid, Image } from 'semantic-ui-react';
import { Fragment, useContext, useEffect, useState } from 'react'

import ArenaList from './ArenaList';
import ArenaMainPage from './ArenaMainPage';
import InfiniteScroll from 'react-infinite-scroller';
import Navbar from '../navbar/Navbar';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion/dist/framer-motion'

const ArenaDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {shake, showDice, getPrize} = rootStore;
  const {loadUsers, setPage, page, totalPages, usersArray} = rootStore.userStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const [showArena, setshowArena] = useState(false);  

  //const location = useLocation();

  const AnimationSettings = {
    transition: { duration: 0.5 },
    initial: { opacity: 0, y: '50%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '-50%' }
  };

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadUsers().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    loadUsers();
    setshowArena(true);
  }, [loadUsers]);
  
  return (    
    
    <motion.div {...AnimationSettings}>
      <Fragment>
          <Container fluid style={{ marginTop: "1em", backgroundColor: "white" }}>
          <Navbar />
          <Grid style={{ marginTop: "4em" }}>
            <Grid.Column width={10}>
              <ArenaMainPage initialLoad = {showArena}/>
            </Grid.Column>
            {showDice && (
              <Image
                onClick={getPrize}
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
        </Fragment>
    </motion.div>
  );
}

export default observer(ArenaDashboard);
