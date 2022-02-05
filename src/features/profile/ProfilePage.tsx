import { observer } from 'mobx-react-lite'
import { Grid, GridColumn } from 'semantic-ui-react'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'


const ProfilePage = () => {
    
    return (

        <Grid>
            <GridColumn width={16}>
                <ProfileHeader/>
                <ProfileContent/>
            </GridColumn>
        </Grid>
    )
}

export default observer(ProfilePage);
