import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react'
import { Item } from 'semantic-ui-react'
import { IActivity } from '../../app/models/activity';
import { RootStoreContext } from '../../app/stores/rootStore';
import { ActivityListItem } from './ActivityListItem';

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {activitiesArray} = rootStore.activityStore;
  console.log(activitiesArray[0]);
    return (
      <Fragment>
        
          <Item.Group divided>
            {activitiesArray.map((activity: IActivity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        
      </Fragment>
    );
}

export default observer(ActivityList);