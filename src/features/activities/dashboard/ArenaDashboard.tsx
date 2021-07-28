import React from 'react'
import { Grid } from 'semantic-ui-react';
import ArenaList from './ArenaList';
import ArenaMainPage from './ArenaMainPage';



const users = ['pera','mika','zika','dragutin','milutin'];

const ArenaDashboard = () => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ArenaMainPage/>
            </Grid.Column>
            <Grid.Column width={6} floated='right'>
                <ArenaList users={users}/>
            </Grid.Column>
        </Grid>
    )
}

export default ArenaDashboard;
