import { useContext, useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityList from '../activities/ActivityList';
import { observer } from 'mobx-react-lite';
import ApprovedActivityListItemPlaceholder from '../activities/ApprovedActivityListItemPlaceholder';

const ArenaMainPage = () => {
    const rootStore = useContext(RootStoreContext);
    const {loadReviewedActivities} = rootStore.reviewStore;
    const {loadApprovedActivitiesExcludingUser, loadingInitial, setApprovedActivitiesPage, approvedActivitiesPage, totalApprovedActivityPages} = rootStore.activityStore;
    const {loadFavoriteActivitiesForUser} = rootStore.favoriteStore;
    const { userId } = rootStore.userStore;

    useEffect(() => {
      if (userId)
      {
        loadReviewedActivities(userId);
        loadApprovedActivitiesExcludingUser(userId);
        loadFavoriteActivitiesForUser(userId);
      }
    }, [loadApprovedActivitiesExcludingUser, loadReviewedActivities, loadFavoriteActivitiesForUser, userId]);

    const [loadingNext, setLoadingNext] = useState(false);
  
    const handleGetNext = () => {
      setLoadingNext(true);
      setApprovedActivitiesPage(approvedActivitiesPage + 1);
      loadApprovedActivitiesExcludingUser(userId ? userId : -1).then(() => setLoadingNext(false));
    }

    return (
        <Grid>
          <Grid.Column width={16}>
            {loadingInitial && approvedActivitiesPage === 0 ? (
              <ApprovedActivityListItemPlaceholder />
            ) : (
              <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNext}
                hasMore={!loadingNext && approvedActivitiesPage + 1 < totalApprovedActivityPages}
                initialLoad={false}
              >
                <ActivityList approved={true} />
              </InfiniteScroll>
            )}
          </Grid.Column>
          <Grid.Column width={16}>
            <Loader active={loadingNext} />
          </Grid.Column>
        </Grid>
    );
}

export default observer(ArenaMainPage);
