import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react'
import  ActivityList from './ActivityList';
import InfiniteScroll from 'react-infinite-scroller'
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';
import { RootStoreContext } from '../../app/stores/rootStore';

const Approvals: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadActivities, loadingInitial, setPage, page, totalPages} = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
  
    const handleGetNext = () => {
      setLoadingNext(true);
      setPage(page + 1);
      loadActivities().then(() => setLoadingNext(false));
    }
  
    useEffect(() => {
      loadActivities();
    }, [loadActivities]);
    
    return (
      <Grid>
        <Grid.Column width={16}>
          {loadingInitial && page === 0 ? (
            <ActivityListItemPlaceholder />
          ) : (
            <InfiniteScroll
              pageStart={0}
              loadMore={handleGetNext}
              hasMore={!loadingNext && page + 1 < totalPages}
              initialLoad={false}
            >
              <ActivityList />
            </InfiniteScroll>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <Loader active={loadingNext} />
        </Grid.Column>
      </Grid>
    );
  }
  
  export default observer(Approvals);
