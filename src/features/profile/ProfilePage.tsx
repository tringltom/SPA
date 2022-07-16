import { Grid, GridColumn } from 'semantic-ui-react'

import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'
import { RouteComponentProps } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { RootStoreContext } from '../../app/stores/rootStore'

interface DetailParams {
  id: string;
}

const ProfilePage : React.FC<RouteComponentProps<DetailParams>> = ({ match }) => {
  const userId = match.params.id;
  const rootStore = useContext(RootStoreContext);
  const {userProfile, getUserProfile, getIsProfileOwner, isProfileOwner} = rootStore.userStore;

  useEffect(() => {
    getIsProfileOwner(Number(userId));
  },[getIsProfileOwner,userId]);

  useEffect(() => {
    getUserProfile(Number(userId));
  }, [getUserProfile]);

  return (
    <Grid>
      <GridColumn width={16}>
        <ProfileHeader user={userProfile} isProfileOwner={isProfileOwner}/>
        <ProfileContent userId={userId} isProfileOwner={isProfileOwner}/>
      </GridColumn>
    </Grid>
  );
}

export default observer(ProfilePage);
