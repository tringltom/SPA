import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react';
import { Item } from 'semantic-ui-react';
import { IActivity } from '../../app/models/activity';
import { RootStoreContext } from '../../app/stores/rootStore';
import { ApprovedActivityListItem } from './ApprovedActivityListItem';
import { PendingActivityListItem } from './PendingActivityListItem';

const ActivityList: React.FC<{approved: boolean}> = ({approved}) => {
  const rootStore = useContext(RootStoreContext);

  const { pendingActivitiesArray, approvedActivitiesArray, loadingInitial } = rootStore.activityStore;
  const { reviewsForCurrentUserArray, loading: loadingReviews } = rootStore.reviewStore;
  const { favoritesArray, loading: loadingFavorites } = rootStore.favoriteStore;

  return (
    <Fragment>
      <Item.Group divided>
        {approved && !loadingInitial && !loadingReviews && !loadingFavorites
          ? approvedActivitiesArray.map((activity: IActivity) => (
              // eslint-disable-next-line
              <ApprovedActivityListItem
                key={activity.id}
                activity={activity}
                favorite={
                  !!favoritesArray.find((fa) => fa.activityId === +activity.id)
                }
                review={
                  reviewsForCurrentUserArray.find(
                    (ra) => ra.activityId === +activity.id
                  )?.reviewTypeId
                }
              />
            ))
          : pendingActivitiesArray.map((activity: IActivity) => (
              <PendingActivityListItem key={activity.id} activity={activity} />
            ))}
      </Item.Group>
    </Fragment>
  );
}

export default observer(ActivityList);