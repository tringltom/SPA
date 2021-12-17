import React from 'react'
import {Tab} from 'semantic-ui-react';


const panes = [
    {menuItem: 'Detalji', render: () => <Tab.Pane>Detalji</Tab.Pane>},
    {menuItem: 'Veštine', render: () => <Tab.Pane>Veštine</Tab.Pane>},
    {menuItem: 'Dobra dela', render: () => <Tab.Pane>Dobra dela</Tab.Pane>},
    {menuItem: 'Vicevi', render: () => <Tab.Pane>Vicevi</Tab.Pane>},
    {menuItem: 'Izreke', render: () => <Tab.Pane>Izreke</Tab.Pane>},
    {menuItem: 'Zagonetke', render: () => <Tab.Pane>Zagonetke</Tab.Pane>},
    {menuItem: 'Događaji', render: () => <Tab.Pane>Događaji</Tab.Pane>},

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
