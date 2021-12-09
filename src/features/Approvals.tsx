import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react'
import  ActivityList from './activities/ActivityList';
import InfiniteScroll from 'react-infinite-scroller'
import ActivityListItemPlaceholder from './activities/ActivityListItemPlaceholder';
import { RootStoreContext } from '../app/stores/rootStore';

const Approvals: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadPendingActivities, loadingInitial, setPage, page, totalPages} = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
  
    const handleGetNext = () => {
      setLoadingNext(true);
      setPage(page + 1);
      loadPendingActivities().then(() => setLoadingNext(false));
    }
  
    useEffect(() => {
      loadPendingActivities();
    }, [loadPendingActivities]);
    
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
        <Grid.Column width={16}>
          <Loader active={loadingNext} />
        </Grid.Column>
      </Grid>
    );
  }
  
  export default observer(Approvals);
