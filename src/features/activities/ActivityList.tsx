import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useState } from 'react';
import { Item } from 'semantic-ui-react';
import { IActivity } from '../../app/models/activity';
import { RootStoreContext } from '../../app/stores/rootStore';
import { ApprovedActivityListItem } from './ApprovedActivityListItem';
import { PendingActivityListItem } from './PendingActivityListItem';

const ActivityList: React.FC<{approved: boolean}> = ({approved}) => {
  const rootStore = useContext(RootStoreContext);
  
  const {pendingActivitiesArray, approvedActivitiesArray} = rootStore.activityStore;
  const { reviewsForCurrentUserArray } = rootStore.reviewStore;
  const { favoritesArray } = rootStore.favoriteStore;

  const [review, setReview] = useState<any>(null);

    return (
      <Fragment>
          <Item.Group divided>
            { approved ? 
              approvedActivitiesArray.map((activity: IActivity) => (
                // eslint-disable-next-line
                setReview(reviewsForCurrentUserArray.find((ra) => ra.activityId === +activity.id)),
                <ApprovedActivityListItem key={activity.id} activity={activity}
                favorite={!!favoritesArray.find((fa) => fa.activityId === +activity.id)}
                review={!!review ? review.reviewTypeId : null}
                /> 
              ))
            :
              pendingActivitiesArray.map((activity: IActivity) => (
                <PendingActivityListItem key={activity.id} activity={activity} />
              ))
            }
          </Item.Group>
      </Fragment>
    );
}

export default observer(ActivityList);