import { Grid, Loader } from 'semantic-ui-react'
import { useContext, useEffect, useState } from 'react';

import ActivityList from '../activities/ActivityList';
import ApprovedActivityListItemPlaceholder from '../activities/ApprovedActivityListItemPlaceholder';
import InfiniteScroll from 'react-infinite-scroller';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps {
  initialLoad: boolean;
}
const ArenaMainPage: React.FC<IProps> = ({initialLoad}) => {
    const rootStore = useContext(RootStoreContext);
    const {loadReviewedActivities, loading: loadingReviews} = rootStore.reviewStore;
    const {getApprovedActivitiesFromOtherUsers, loadingInitial, setApprovedActivitiesPage, approvedActivitiesPage, totalApprovedActivityPages} = rootStore.activityStore;
    const {loadFavoriteActivities, loading: loadingFavorites} = rootStore.favoriteStore;
    const { userId } = rootStore.userStore;

    useEffect(() => {
      if (userId && initialLoad)
      {
        loadReviewedActivities();
        getApprovedActivitiesFromOtherUsers();
        loadFavoriteActivities();
      }
    }, [getApprovedActivitiesFromOtherUsers, loadReviewedActivities, loadFavoriteActivities, userId, initialLoad]);

    const [loadingNext, setLoadingNext] = useState(false);
  
    const handleGetNext = () => {
      setLoadingNext(true);
      setApprovedActivitiesPage(approvedActivitiesPage + 1);
      getApprovedActivitiesFromOtherUsers().then(() => setLoadingNext(false));
    }

    return (
        <Grid>
          <Grid.Column width={16}>
            {(loadingInitial && approvedActivitiesPage === 0) || loadingReviews || loadingFavorites ? (
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
