import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react'
import  ActivityList from '../activities/ActivityList';
import InfiniteScroll from 'react-infinite-scroller'
import PendingActivityListItemPlaceholder from '../activities/PendingActivityListItemPlaceholder';
import { RootStoreContext } from '../../app/stores/rootStore';

const Approvals: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadPendingActivities, loadingInitial, setPendingActivitiesPage, pendingActivitiesPage, totalPendingActivityPages} = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
  
    const handleGetNext = () => {
      setLoadingNext(true);
      setPendingActivitiesPage(pendingActivitiesPage + 1);
      loadPendingActivities().then(() => setLoadingNext(false));
    }
  
    useEffect(() => {
      loadPendingActivities();
    }, [loadPendingActivities]);
    
    return (
      <Grid>
        <Grid.Column width={16}>
          {loadingInitial && pendingActivitiesPage === 0 ? (
            <PendingActivityListItemPlaceholder />
          ) : (
            <InfiniteScroll
              pageStart={0}
              loadMore={handleGetNext}
              hasMore={!loadingNext && pendingActivitiesPage + 1 < totalPendingActivityPages}
              initialLoad={false}
            >
              <ActivityList approved={false} />
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
