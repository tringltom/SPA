import {Tab} from 'semantic-ui-react';


const panes = [
    {menuItem: 'Detalji', render: () => <Tab.Pane>Detalji</Tab.Pane>},
    {menuItem: 'Veštine', render: () => <Tab.Pane>Veštine</Tab.Pane>},
    {menuItem: 'Aktivnosti na čekanju', render: () => <Tab.Pane>Aktivnosti koje čekaju odobrenje</Tab.Pane>},
    {menuItem: 'Odobrene aktivnosti', render: () => <Tab.Pane>Odobrene aktivnosti</Tab.Pane>},
]
const ProfileContent = () => {
    return (
        <Tab
        menu={{fluid: true, vertical: true}}
        menuPosition="right"
        panes={panes}
        />
    )
}

export default ProfileContent;