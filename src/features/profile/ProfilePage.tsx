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
  const {getUserProfile} = rootStore.userStore;

  useEffect(() => {
    getUserProfile(Number(userId));
  }, [getUserProfile, userId]);

  return (
    <Grid>
      <GridColumn width={16}>
        <ProfileHeader />
        <ProfileContent userId={userId}/>
      </GridColumn>
    </Grid>
  );
}

export default observer(ProfilePage);
