import { useContext, useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityList from '../activities/ActivityList';
import { observer } from 'mobx-react-lite';
import ApprovedActivityListItemPlaceholder from '../activities/ApprovedActivityListItemPlaceholder';

interface IProps {
  initialLoad: boolean;
}
const ArenaMainPage: React.FC<IProps> = ({initialLoad}) => {
    const rootStore = useContext(RootStoreContext);
    const {loadReviewedActivities, loading: loadingReviews} = rootStore.reviewStore;
    const {getApprovedActivitiesFromOtherUsers, loadingInitial, setApprovedActivitiesPage, approvedActivitiesPage, totalApprovedActivityPages} = rootStore.activityStore;
    const {loadFavoriteActivitiesForUser, loading: loadingFavorites} = rootStore.favoriteStore;
    const { userId } = rootStore.userStore;

    useEffect(() => {
      if (userId && initialLoad)
      {
        loadReviewedActivities(userId);
        getApprovedActivitiesFromOtherUsers(userId);
        loadFavoriteActivitiesForUser(userId);
      }
    }, [getApprovedActivitiesFromOtherUsers, loadReviewedActivities, loadFavoriteActivitiesForUser, userId, initialLoad]);

    const [loadingNext, setLoadingNext] = useState(false);
  
    const handleGetNext = () => {
      setLoadingNext(true);
      setApprovedActivitiesPage(approvedActivitiesPage + 1);
      getApprovedActivitiesFromOtherUsers(userId ? userId : -1).then(() => setLoadingNext(false));
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
