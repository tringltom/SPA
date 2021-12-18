import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'


const ProfilePage = () => {
    const rootStore = useContext(RootStoreContext);
    const {user, getUser} = rootStore.userStore;

    useEffect(() => {
        getUser();
    }, [getUser])
    return (

        <Grid>
            <GridColumn width={16}>
                <ProfileHeader user = {user!}/>
                <ProfileContent/>
            </GridColumn>
        </Grid>
    )
}

export default observer(ProfilePage);
