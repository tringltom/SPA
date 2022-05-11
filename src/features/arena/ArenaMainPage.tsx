import { Dropdown, DropdownItemProps, Grid, Input, Loader } from 'semantic-ui-react'
import { useContext, useEffect, useState } from 'react';

import ActivityList from '../activities/ActivityList';
import { ActivityTypes } from '../../app/models/activity';
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
    const {getApprovedActivitiesFromOtherUsers, loadingInitial, setApprovedActivitiesPage, approvedActivitiesPage, totalApprovedActivityPages, setPredicate} = rootStore.activityStore;
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

    const options = Object.keys(ActivityTypes).map((key: any, el) => {
      if (ActivityTypes[el + 1] !== undefined)
        return {key: key, text: ActivityTypes[el + 1], value: Number(key)}
      return undefined
    }).filter(f => f !== undefined);

    return (
      <Grid>
        <Grid.Column width={16}>
          <Dropdown
            style={{ float: "right", marginBottom: "1em" }}
            placeholder="Akivnosti"
            multiple
            selection
            options={options as DropdownItemProps[]}
            onChange={(e, { value }) =>
              setPredicate("activityTypesArray", value?.toString() ?? "")
            }
          />
          <Input
            style={{ float: "right", marginBottom: "1em", marginRight: "1em" }}
            icon="thumbs up"
            iconPosition="left"
            placeholder="Pretraži aktivnosti..."
            onChange={(e) => setPredicate("title", e.target.value)}
          />
          {(loadingInitial && approvedActivitiesPage === 0) ||
          loadingReviews ||
          loadingFavorites ? (
            <ApprovedActivityListItemPlaceholder />
          ) : (
            <InfiniteScroll
            style={{marginTop:"3em"}}
              pageStart={0}
              loadMore={handleGetNext}
              hasMore={
                !loadingNext &&
                approvedActivitiesPage + 1 < totalApprovedActivityPages
              }
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
