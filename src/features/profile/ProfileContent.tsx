import { ProfileAbout } from './ProfileAbout';
import ProfileApprovedActivities from './ProfileApprovedActivities'
import ProfileFavoriteActivities from './ProfileFavoriteActivities';
import ProfilePendingActivities from './ProfilePendingActivities';
import ProfileSkills from './ProfileSkills';
import { RootStoreContext } from '../../app/stores/rootStore';
import {Tab} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

interface IProps {
  userId: string;
};

const ProfileContent: React.FC<IProps> = ({ userId }) => {
    const rootStore = useContext(RootStoreContext);
    const { isProfileOwner } = rootStore.userStore;
   
    const panes = [
        {menuItem: 'Detalji', render: () => <Tab.Pane><ProfileAbout/></Tab.Pane>},
        {menuItem: 'Veštine', render: () => <Tab.Pane><ProfileSkills userId={userId}/></Tab.Pane>},
        {menuItem: 'Aktivnosti na čekanju', render: () => isProfileOwner && <Tab.Pane ><ProfilePendingActivities/></Tab.Pane>},
        {menuItem: 'Odobrene aktivnosti', render: () => <Tab.Pane><ProfileApprovedActivities userId={userId}/></Tab.Pane>},
        {menuItem: 'Omiljene aktivnosti', render: () => <Tab.Pane><ProfileFavoriteActivities userId={userId}/></Tab.Pane>},
    ]

    return (
        <Tab
        menu={{fluid: true, vertical: true}}
        menuPosition="right"
        panes={panes}
        />
    )
}

export default observer(ProfileContent);
