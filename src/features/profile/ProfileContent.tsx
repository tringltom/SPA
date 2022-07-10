import { ProfileAbout } from './ProfileAbout';
import ProfilePendingActivities from './ProfilePendingActivities';
import ProfileApprovedActivities from './ProfileApprovedActivities'
import ProfileSkills from './ProfileSkills';
import {Tab} from 'semantic-ui-react';
import { useContext } from 'react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileFavoriteActivities from './ProfileFavoriteActivities';

interface IProps {
  userId: string;
};

const ProfileContent: React.FC<IProps> = ({ userId }) => {
    const rootStore = useContext(RootStoreContext);
    const {user} = rootStore.userStore;

    const isProfileOwner = () => Number(userId) === user?.id;
    
    const panes = [
        {menuItem: 'Detalji', render: () => <Tab.Pane><ProfileAbout isProfileOwner={isProfileOwner()}/></Tab.Pane>},
        {menuItem: 'Veštine', render: () => <Tab.Pane><ProfileSkills userId={userId} isProfileOwner={isProfileOwner()}/></Tab.Pane>},
        {menuItem: 'Aktivnosti na čekanju', render: () =><Tab.Pane active={isProfileOwner()}><ProfilePendingActivities/></Tab.Pane>},
        {menuItem: 'Odobrene aktivnosti', render: () => <Tab.Pane><ProfileApprovedActivities userId={userId}/></Tab.Pane>},
        {menuItem: 'Omiljene aktivnosti', render: () => <Tab.Pane><ProfileFavoriteActivities userId={userId} isProfileOwner={isProfileOwner()} /></Tab.Pane>},
    ]

    return (
        <Tab
        menu={{fluid: true, vertical: true}}
        menuPosition="right"
        panes={panes}
        />
    )
}

export default ProfileContent;
