import React, { useContext, useEffect, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ArenaList from './ArenaList';
import ArenaMainPage from './ArenaMainPage';
import InfiniteScroll from 'react-infinite-scroller';
import { observer } from 'mobx-react-lite';




const ArenaDashboard = () => {
    const rootStore = useContext(RootStoreContext);
    const {loadUsers, setPage, page, totalPages,usersArray} = rootStore.userStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadUsers().then(() => setLoadingNext(false))
    }

    useEffect(() => {
        loadUsers();
    }, [loadUsers])
    return (
        <Grid>
            <Grid.Column width={10}>
                <ArenaMainPage/>
            </Grid.Column>
            <Grid.Column width={6} floated='right'>
                <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNext}
                hasMore={!loadingNext && page + 1 < totalPages }
                initialLoad = {false}
                >
                <ArenaList users={usersArray}/>
                </InfiniteScroll>
               
            </Grid.Column>
            <Grid.Column width={6} floated='right'>
                <Loader active={loadingNext}/>
               
            </Grid.Column>
        </Grid>
    )
}

export default observer(ArenaDashboard) ;
