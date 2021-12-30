import { observer } from 'mobx-react-lite';
import { useContext } from 'react'
import { Grid, Image } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ArenaList from './ArenaList';
import ArenaMainPage from './ArenaMainPage';


const users = ['pera','mika','zika','dragutin','milutin'];

const ArenaDashboard = () => {

    const {shake, showDice, getPrice} = useContext(RootStoreContext);;
    
    return (
        <Grid>
            <Grid.Column width={10}>
                <ArenaMainPage/>
            </Grid.Column>
            {showDice && <Image onClick={getPrice} className = {shake ? `shake` : undefined} style={{position:"absolute"}} size='small' src="../assets/d20.png"></Image>} 
            <Grid.Column width={6} floated='right'>
                <ArenaList users={users}/>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ArenaDashboard);
